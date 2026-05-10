import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    const transaction = await prisma.transaction.findUnique({
      where: { tranId: tranId }
    });

    if (transaction && transaction.status === "PENDING" && status === "VALID") {
      
      await prisma.$transaction([

        prisma.user.update({
          where: { id: transaction.userId },
          data: { credits: { increment: transaction.credits } }
        }),

        prisma.transaction.update({
          where: { tranId: tranId },
          data: { status: "VALID" }
        })
      ]);

      console.log(`Payment Successful for Transaction: ${tranId}`);
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=success`, 303);

  } catch (error) {
    console.error("Payment Success Handler Error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=error`, 303);
  }
}