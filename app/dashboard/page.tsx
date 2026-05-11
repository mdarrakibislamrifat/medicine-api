import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import DashboardUI from "./DashboardUI";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, apiKey: true, credits: true, lastResetDate: true },
  });

  if (!user) {
    redirect("/login");
  }

  const now = new Date();
  const lastReset = user.lastResetDate;

  const isDifferentDay =
    !lastReset || now.getUTCDate() !== new Date(lastReset).getUTCDate();

  if (isDifferentDay) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: 10,
        lastResetDate: now,
      },
      select: { id: true, apiKey: true, credits: true, lastResetDate: true },
    });
  }

  return (
    <DashboardUI
      apiKey={user?.apiKey || "No key found"}
      credits={user?.credits ?? 0}
    />
  );
}
