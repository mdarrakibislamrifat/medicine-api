import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const apiKey = req.headers.get("x-api-key"); 

  if (!apiKey) {
    return NextResponse.json({ error: "API Key is required" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { apiKey: apiKey },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
  }

  if (user.credits < 1) {
    return NextResponse.json({ error: "Insufficient credits. Please buy more." }, { status: 402 });
  }


  const medicines = await prisma.medicine.findMany({
    where: {
      OR: [
        { name: { contains: query || "", mode: "insensitive" } },
        { generic: { contains: query || "", mode: "insensitive" } },
      ],
    },
    take: 10,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { credits: { decrement: 1 } },
  });

  return NextResponse.json({
    remaining_credits: user.credits - 1,
    data: medicines
  });
}