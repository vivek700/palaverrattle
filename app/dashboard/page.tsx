import React from "react";
import { auth } from "../lib/auth";

const Dashboard = async () => {
  const session = await auth();
  return <main className="text-center">Dashboard</main>;
};

export default Dashboard;
