import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is required" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { apiKey: apiKey },
      select: { id: true, credits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 },
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: "Search query 'q' is required" },
        { status: 400 },
      );
    }

    const [medicines, updatedUser, log] = await prisma.$transaction([
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
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.apiLog.create({
        data: {
          userId: user.id,
          endpoint: "/api/medicines/search",
          status: 200,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      remaining_credits: updatedUser.credits,
      count: (medicines as any[]).length,
      data: medicines,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
