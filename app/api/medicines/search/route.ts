import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Crucial for Prisma.sql injections

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    
    // Catch the dynamic filter type ('all' | 'name' | 'generic' | 'company')
    const filter = searchParams.get("filter")?.trim() || "all";
    
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 6; 
    const offset = (page - 1) * limit;

    const apiKey = req.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    let userId: string | null = null;
    let userCredits: number = 0;
    let lastReset: Date | null = null;

    if (apiKey) {
      const user = await prisma.user.findUnique({
        where: { apiKey: apiKey },
        select: { id: true, credits: true, lastResetDate: true },
      });

      if (!user) return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
      
      userId = user.id;
      userCredits = user.credits;
      lastReset = user.lastResetDate;

      // --- DAILY RESET LOGIC ---
      const today = new Date();
      const isDifferentDay = !lastReset || today.toDateString() !== lastReset.toDateString();

      if (isDifferentDay) {
        userCredits = 10;
        await prisma.user.update({
          where: { id: userId },
          data: { credits: 10, lastResetDate: today }
        });
      }

      if (userCredits < 1) {
        return NextResponse.json({ error: "Insufficient credits for today" }, { status: 402 });
      }
    } else if (session?.user?.id) {
      userId = session.user.id;
    } else {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const searchQuery = `%${query}%`;
    const prefixQuery = `${query}%`;

    // --- DYNAMIC FILTER CONDITION BUILDER ---
    let filterCondition = Prisma.sql`
      "name" ILIKE ${searchQuery} 
      OR "generic" ILIKE ${searchQuery}
      OR "company" ILIKE ${searchQuery}
      OR similarity("name", ${query}) > 0.3
      OR similarity("generic", ${query}) > 0.3
    `;

    if (filter === "name") {
      filterCondition = Prisma.sql`"name" ILIKE ${searchQuery} OR similarity("name", ${query}) > 0.3`;
    } else if (filter === "generic") {
      filterCondition = Prisma.sql`"generic" ILIKE ${searchQuery} OR similarity("generic", ${query}) > 0.3`;
    } else if (filter === "company") {
      filterCondition = Prisma.sql`"company" ILIKE ${searchQuery}`;
    }

    // Dynamic Raw Query Execution with GIN index speed up optimization
    const medicineQuery = prisma.$queryRaw`
      SELECT *, 
             similarity("name", ${query}) as name_score,
             similarity("generic", ${query}) as generic_score
      FROM "Medicine"
      WHERE ${filterCondition}
      ORDER BY 
        CASE 
          WHEN "name" ILIKE ${prefixQuery} THEN 1
          WHEN "name" ILIKE ${searchQuery} THEN 2
          ELSE 3 
        END,
        similarity("name", ${query}) DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = prisma.$queryRaw<{ count: BigInt }[]>`
      SELECT COUNT(*)::bigint as count FROM "Medicine"
      WHERE ${filterCondition}
    `;

    const queries: any[] = [medicineQuery, countQuery];

    if (apiKey && userId) {
      queries.push(
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        })
      );
      
      queries.push(
        prisma.apiLog.create({
          data: {
            userId: userId,
            endpoint: "/api/medicines/search",
            status: 200,
          },
        })
      );
    }

    const results = await prisma.$transaction(queries);
    const medicines = results[0] as any[];
    
    const totalRecords = Number(results[1][0]?.count || 0); 
    const totalPages = Math.ceil(totalRecords / limit);

    return NextResponse.json({
      success: true,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      remainingCredits: apiKey ? userCredits - 1 : null, 
      data: medicines,
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}