import ChatInput from "@/app/components/ChatInput";
import Messages from "@/app/components/Messages";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { fetchRedis } from "@/app/lib/redis";
import { mArrayValidator } from "@/app/lib/validations/message";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

type props = {
  params: {
    chatID: string;
  };
};

const getChat = async (chatID: string) => {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatID}:messages`,
      0,
      -1
    );

    const dbMessages = result.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = mArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
};

const page = async ({ params }: props) => {
  const { chatID } = params;
  const session = await auth();

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatID.split("--");

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }
  const chatPersonId = user.id === userId1 ? userId2 : userId1;

  const chatPerson = (await db.get(`user:${chatPersonId}`)) as User;

  const initialMessages = await getChat(chatID);

  return (
    <section className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)]">
      <section className="flex sm:items-center justify-between py-3 border-b-2 border-gray-400">
        <section className="relative flex items-center space-x-4">
          <section className="relative">
            <section className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPerson.image}
                alt={`${chatPerson.name} profile picture`}
                className="rounded-full"
                unoptimized
              />
            </section>
          </section>
          <div className="flex flex-col leading-tight">
            <div className="text-lg flex items-center">
              <span
                className="text-slate-200 mr-3 font-semibold
              "
              >
                {chatPerson.name}
              </span>
            </div>
            <span className="text-xs text-slate-500">{chatPerson.email}</span>
          </div>
        </section>
      </section>
      <Messages
        sessionId={session.user.id}
        initialMsg={initialMessages}
        sessionImg={session.user.image}
        chatPerson={chatPerson}
      />
      <ChatInput chatPerson={chatPerson} chatId={chatID} />
    </section>
  );
};

export default page;
