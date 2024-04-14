"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../lib/validations/message";
import { cn } from "../lib/utils/cn";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "../lib/utils/toPusherKey";

const Messages = ({
  initialMsg,
  sessionId,
  sessionImg,
  chatPerson,
  chatId,
}: {
  initialMsg: Message[];
  sessionId: string;
  sessionImg: string | null | undefined;
  chatPerson: User;
  chatId: string;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [msgs, setMsgs] = useState<Message[]>(initialMsg);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMsgs((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, []);

  const messageElement = msgs.map((msg, index) => {
    const isCurrentUser = msg.senderId === sessionId;

    const nextMsgFromSameUser =
      msgs[index - 1]?.senderId === msgs[index].senderId;

    const formatTime = (dt: number) => {
      return format(dt, "KK:mm bbb");
    };
    return (
      <section key={`${msg.id}-${msg.timestamp}`} className="chat-message">
        <section
          className={cn("flex items-end", {
            "justify-end": isCurrentUser,
          })}
        >
          <div
            className={cn("mx-2 flex max-w-xs flex-col space-y-2 text-base", {
              "order-1 items-end": isCurrentUser,
              "order-2 items-start": !isCurrentUser,
            })}
          >
            <span
              className={cn("inline-block rounded-lg px-4 py-2", {
                "bg-slate-800 text-slate-100": isCurrentUser,
                "bg-violet-700 text-slate-100": !isCurrentUser,
                "rounded-br-none": !nextMsgFromSameUser && isCurrentUser,
                "rounded-bl-none": !nextMsgFromSameUser && !isCurrentUser,
              })}
            >
              {msg.text}{" "}
              <span className="ml-2 text-xs text-gray-400">
                {formatTime(msg.timestamp)}
              </span>
            </span>
          </div>
          <div
            className={cn("relative h-6 w-6", {
              "order-2": isCurrentUser,
              "order-1": !isCurrentUser,
              invisible: nextMsgFromSameUser,
            })}
          >
            <Image
              fill
              src={isCurrentUser ? (sessionImg as string) : chatPerson.image}
              alt="Profile Picture"
              unoptimized
              referrerPolicy="no-referrer"
              className="rounded-full"
            />
          </div>
        </section>
      </section>
    );
  });

  return (
    <section
      id="message"
      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-col-reverse gap-4 overflow-y-auto p-3"
    >
      <div ref={scrollRef} />
      {messageElement}
    </section>
  );
};

export default Messages;
