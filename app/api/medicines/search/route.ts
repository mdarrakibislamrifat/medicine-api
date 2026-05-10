import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // আপনার authOptions পাথ অনুযায়ী

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    
    // ১. চেক করুন এটি এপিআই কী দিয়ে আসছে নাকি সেশন দিয়ে
    const apiKey = req.headers.get("x-api-key");
    const session = await getServerSession(authOptions);

    let userId: string | null = null;

    if (apiKey) {
      // এপিআই কী দিয়ে অ্যাক্সেস
      const user = await prisma.user.findUnique({
        where: { apiKey: apiKey },
        select: { id: true, credits: true },
      });
      if (!user) return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
      if (user.credits < 1) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      userId = user.id;
    } else if (session?.user?.id) {
      // সেশন (আপনার ওয়েবসাইট) দিয়ে অ্যাক্সেস - এখানে ক্রেডিট কাটবে না বা আলাদা লজিক দিতে পারেন
      userId = session.user.id;
    } else {
      // কোনোটিই না থাকলে এরর
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    // ২. ডাটাবেস অপারেশন (শুধুমাত্র এপিআই কী থাকলে ক্রেডিট কাটবে)
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
      // সেশন থাকলে ক্রেডিট কমানো ঐচ্ছিক, এপিআই কী থাকলে অবশ্যই কমবে
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