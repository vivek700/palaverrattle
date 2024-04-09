"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { pathConstructor } from "../lib/utils/pathConstructor";

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
          className="text-slate-200 hover:text-blue-400 hover:bg-slate-800 group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium"
        >
          {friend.name}
          {unseenMsgCount > 0 && (
            <span className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-slate-200 bg-blue-700">
              {unseenMsgCount}
            </span>
          )}
        </a>
      </li>
    );
  });

  return (
    <>
      <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
        {SidebarChatElement}
      </ul>
    </>
  );
};

export default SidebarChat;
