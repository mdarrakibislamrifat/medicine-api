import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string;

    await prisma.transaction.update({
      where: { tranId: tranId },
      data: { status: "FAILED" } 
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=failed`, 303);
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=error`, 303);
  }
}