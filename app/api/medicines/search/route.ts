import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    
    const apiKey = req.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    let userId: string | null = null;

    if (apiKey) {
      const user = await prisma.user.findUnique({
        where: { apiKey: apiKey },
        select: { id: true, credits: true },
      });
      if (!user) return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
      if (user.credits < 1) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      userId = user.id;
    } else if (session?.user?.id) {
      userId = session.user.id;
    } else {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const [medicines] = await prisma.$transaction([
      prisma.$queryRaw`
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
      `,
      ...(apiKey ? [
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        }),
        prisma.apiLog.create({
          data: {
            userId: userId,
            endpoint: "/api/medicines/search",
            status: 200,
          },
        }),
      ] : [])
    ]);

    return NextResponse.json({
      success: true,
      data: medicines,
    });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}