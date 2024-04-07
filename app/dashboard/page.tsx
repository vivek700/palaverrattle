import React from "react";
import { auth } from "../lib/auth";

const Dashboard = async () => {
  const session = await auth();
  return <main className="text-center">{JSON.stringify(session)}</main>;
};

export default Dashboard;
