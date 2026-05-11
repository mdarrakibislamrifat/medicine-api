import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string;
    const val_id = formData.get("val_id") as string;

    const validationUrl = process.env.NODE_ENV === "production"
        ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}&format=json`
        : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}&format=json`;

    const validationRes = await fetch(validationUrl);
    const validationData = await validationRes.json();

    const transaction = await prisma.transaction.findUnique({
      where: { tranId: tranId },
    });

    if (
      transaction &&
      (validationData.status === "VALID" || validationData.status === "AUTHENTICATED") &&
      parseFloat(validationData.amount) === transaction.amount
    ) {
      if (transaction.status === "PENDING") {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: transaction.userId },
            data: { credits: { increment: transaction.credits } },
          }),
          prisma.transaction.update({
            where: { tranId: tranId },
            data: { status: "VALID" },
          }),
        ]);
      }
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=success`, 303);
    } else {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=failed`, 303);
    }
  } catch (error) {
    console.error("Payment Success Error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?payment=error`, 303);
  }
}