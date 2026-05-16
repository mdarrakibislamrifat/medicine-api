import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Last 7 days calculations setup
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch grouped database dynamic analytics log data rows
    const logs = await prisma.apiLog.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // JavaScript Matrix parsing to map daily arrays index blocks
    const chartDataMap: { [key: string]: number } = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("en-US", { day: "numeric", month: "short" }); // e.g. "12 May"
      chartDataMap[dateString] = 0;
    }

    logs.forEach((log) => {
      const dateString = new Date(log.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
      if (chartDataMap[dateString] !== undefined) {
        chartDataMap[dateString]++;
      }
    });

    const formattedChartData = Object.keys(chartDataMap).map((date) => ({
      date: date,
      requests: chartDataMap[date],
    }));

    return NextResponse.json({
      success: true,
      data: formattedChartData,
    });

  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}