"use client";

import { useRef, useState } from "react";
import { Message } from "../lib/validations/message";
import { cn } from "../lib/utils/cn";

const Messages = ({
  initialMsg,
  sessionId,
}: {
  initialMsg: Message[];
  sessionId: string;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [msgs, setMsgs] = useState<Message[]>(initialMsg);

  const messageElement = msgs.map((msg, index) => {
    const isCurrentUser = msg.senderId === sessionId;

    const nextMsgFromSameUser =
      msgs[index - 1]?.senderId === msgs[index].senderId;

    return (
      <section key={`${msg.id}-${msg.timestamp}`} className="chat-message">
        <section
          className={cn("flex items-end", {
            "justify-end": isCurrentUser,
          })}
        >
          <div
            className={cn("flex flex-col space-y-2 text-base max-w-xs mx-2", {
              "order-1 items-end": isCurrentUser,
              "order-2 items-start": !isCurrentUser,
            })}
          >
            <span
              className={cn("px-4 py-2 rounded-lg inline-block", {
                "bg-blue-600 text-slate-100": isCurrentUser,
                "bg-slate-200 text-slate-900": !isCurrentUser,
                "rounded-br-none": !nextMsgFromSameUser && isCurrentUser,
                "rounded-bl-none": !nextMsgFromSameUser && !isCurrentUser,
              })}
            >
              {msg.text}{" "}
              <span className="ml-2 text-xs text-slate-400">
                {msg.timestamp}
              </span>
            </span>
          </div>
        </section>
      </section>
    );
  });

  return (
    <section
      id="message"
      className="flex h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollRef} />
      {messageElement}
    </section>
  );
};

export default Messages;
