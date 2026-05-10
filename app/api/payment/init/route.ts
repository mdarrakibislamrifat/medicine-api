import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, amount, credits } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const tranId = `TRAN-${Date.now()}`;

    const data: any = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      total_amount: amount.toString(),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${process.env.NEXTAUTH_URL}/api/payment/success?id=${tranId}`,
      fail_url: `${process.env.NEXTAUTH_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/cancel`,
      cus_name: "Customer Name",
      cus_email: "customer@mail.com",
      cus_phone: "01700000000", 
      shipping_method: "NO",
      product_name: `${credits} API Credits`,
      product_category: "Digital",
      product_profile: "non-physical-goods",
    };


    await prisma.transaction.create({
      data: { 
        userId: userId, 
        amount: parseFloat(amount), 
        credits: parseInt(credits), 
        tranId: tranId,
        status: "PENDING"
      }
    });

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      return NextResponse.json({ url: result.GatewayPageURL });
    } else {
      console.error("SSL Error:", result.failedreason);
      return NextResponse.json({ error: result.failedreason || "Gateway Error" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}