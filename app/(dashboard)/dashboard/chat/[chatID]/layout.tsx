import React from "react";

import type { Metadata, ResolvingMetadata } from "next";
import { auth } from "@/app/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/app/lib/db";

type Props = {
  params: {
    chatID: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  //   const id = params.id;

  const { chatID } = params;
  const session = await auth();

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatID.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  // fetch data
  const chatPerson = (await db.get(`user:${user.id}`)) as User;

  return {
    title: `${chatPerson.name} | Palaverrattle`,
  };
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <>{children}</>;
};

export default Layout;
