"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pathConstructor } from "../lib/utils/pathConstructor";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "../lib/utils/toPusherKey";
import Link from "next/link";

const SidebarChat = ({
  friends,
  sessionId,
}: {
  friends: User[];
  sessionId: string;
}) => {
  const [unseenMsg, setUnseenMsg] = useState<Message[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: any) => {
      const notify =
        pathname !==
        `/dashboard/chat/${pathConstructor(sessionId, message.senderId)}`;

      if (!notify) return;

      setUnseenMsg((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMsg((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  const SidebarChatElement = activeChats.sort().map((friend) => {
    const unseenMsgCount = unseenMsg.filter((msg) => {
      return msg.senderId === friend.id;
    }).length;

    return (
      <li key={friend.id}>
        <a
          href={`/dashboard/chat/${pathConstructor(sessionId, friend.id)}`}
          className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-blue-400"
        >
          {friend.name}
          {unseenMsgCount > 0 ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs text-slate-200">
              {unseenMsgCount}
            </span>
          ) : null}
        </a>
      </li>
    );
  });

  return (
    <>
      <ul
        role="list"
        className="max-h-[25rem] space-y-1 overflow-y-auto md:-mx-2"
      >
        {SidebarChatElement}
      </ul>
    </>
  );
};

export default SidebarChat;
