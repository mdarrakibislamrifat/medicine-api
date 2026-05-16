import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: Request) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ success: true, message: "Database is warm and alive!" });
  } catch (error) {
    console.error("Cron Keep-Alive Error:", error);
    return NextResponse.json({ success: false, error: "Failed to ping DB" }, { status: 500 });
  }
}