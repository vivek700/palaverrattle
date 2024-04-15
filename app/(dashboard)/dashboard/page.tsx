import { auth } from "@/app/lib/auth";
import { notFound } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session) notFound();

  return <main className="text-center">Dashboard</main>;
};

export default Dashboard;
