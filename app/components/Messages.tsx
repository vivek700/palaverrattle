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
  }, [chatId]);

  const messageElement = msgs.map((msg, index) => {
    const isCurrentUser = msg.senderId === sessionId;

    const nextMsgFromSameUser =
      msgs[index - 1]?.senderId === msgs[index].senderId;

    const formatTime = (dt: number) => {
      return format(dt, "KK:mm bbb");
    };
    return (
      <section
        key={`${msg.id}-${msg.timestamp}`}
        ref={index === 0 ? scrollRef : null}
        className="chat-message "
      >
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
              className={cn("inline-block rounded-lg  p-2", {
                "bg-slate-800 text-slate-100": isCurrentUser,
                "bg-violet-700 text-slate-100": !isCurrentUser,
                "rounded-br-none": !nextMsgFromSameUser && isCurrentUser,
                "rounded-bl-none": !nextMsgFromSameUser && !isCurrentUser,
              })}
            >
              {msg?.text ? (
                msg?.text
              ) : msg?.image ? (
                <Image
                  src={msg?.image || ""}
                  width={220}
                  height={220}
                  className="w-full rounded"
                  alt="image"
                  property="false"
                  placeholder="empty"
                />
              ) : (
                <video
                  controls
                  controlsList="nodownload noremoteplayback noplaybackrate "
                  className="max-h-36 max-w-full rounded md:max-h-60"
                  disablePictureInPicture
                >
                  <source src={msg.video || ""} type={msg?.text} />
                  Your browser does not support the video tag.
                </video>
              )}
              {/* {msg?.text}{" "} */}
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
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    const handleResize = () => {
      const chatContainer = document.querySelector(
        ".chat-container",
      ) as HTMLElement;
      const chatInput = document.querySelector(".chat-input") as HTMLElement;

      // Adjust the chat container height
      if (chatContainer && chatInput) {
        const windowHeight = window.innerHeight;
        const chatInputHeight = chatInput.offsetHeight + 155;
        chatContainer.style.height = `${windowHeight - chatInputHeight}px`;
      }
    };
    if (window) {
      window.addEventListener("resize", handleResize);
    }
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="message"
      className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch chat-container md:h-ful flex  flex-col-reverse gap-3 overflow-y-auto px-1 pb-2"
    >
      {messageElement}
    </section>
  );
};

export default Messages;
