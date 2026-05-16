import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const resolvedParams = await params;
    const rawId = resolvedParams.id;

    const medicineId = parseInt(rawId, 10);

    if (isNaN(medicineId)) {
      return NextResponse.json(
        { success: false, message: "Invalid medicine unique reference format logic sequence." },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
    });

    if (!medicine) {
      return NextResponse.json(
        { success: false, message: "Medicine data attributes layout profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: medicine
    });

  } catch (error: any) {
    console.error("Critical dynamic API backend parsing tracking failure logic:", error);
    return NextResponse.json(
      { success: false, message: "Internal application data runtime parsing timeout failure structural template." },
      { status: 500 }
    );
  }
}