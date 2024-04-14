"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pathConstructor } from "../lib/utils/pathConstructor";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "../lib/utils/toPusherKey";

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

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = () => {
      router.refresh();
    };

    const chatHandler = () => {};

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMsg((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  const SidebarChatElement = friends.sort().map((friend) => {
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
          {unseenMsgCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs text-slate-200">
              {unseenMsgCount}
            </span>
          )}
        </a>
      </li>
    );
  });

  return (
    <>
      <ul role="list" className="-mx-2 max-h-[25rem] space-y-1 overflow-y-auto">
        {SidebarChatElement}
      </ul>
    </>
  );
};

export default SidebarChat;
