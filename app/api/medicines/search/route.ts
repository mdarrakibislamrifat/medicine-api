import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    
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

      // --- DAILY RESET LOGIC START ---
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

    // Medicine Query
    const medicineQuery = prisma.$queryRaw`
        SELECT * FROM "Medicine"
        WHERE "name" ILIKE ${`%${query}%`} 
           OR "generic" ILIKE ${`%${query}%`}
        ORDER BY 
          CASE 
            WHEN "name" ILIKE ${`${query}%`} THEN 1
            WHEN "name" ILIKE ${`%${query}%`} THEN 2
            ELSE 3 
          END
        LIMIT 10
      `;

    const queries: any[] = [medicineQuery];

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
    const medicines = results[0];

    return NextResponse.json({
      success: true,
      remainingCredits: apiKey ? userCredits - 1 : null, 
      data: medicines,
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}