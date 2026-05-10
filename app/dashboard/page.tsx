import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import DashboardUI from "./DashboardUI";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { apiKey: true, credits: true }
  });

  return (
    <DashboardUI 
      apiKey={user?.apiKey || "No key found"} 
      credits={user?.credits || 0} 
    />
  );
}