"use client";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "../lib/utils/toPusherKey";

const FriendRequestsSidebar = ({
  initialRequestCount,
  sessionId,
}: {
  initialRequestCount: number;
  sessionId: string;
}) => {
  const [requestCount, setRequestCount] = useState<number>(initialRequestCount);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friend_requests`));

    const friendRequestHandler = () => {
      setRequestCount((prev) => prev + 1);
    };

    pusherClient.bind("friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:friend_requests`)
      );
      pusherClient.unbind("friend_requests", friendRequestHandler);
    };
  }, []);

  return (
    <>
      <Link
        href={"/dashboard/requests"}
        className="text-slate-200 hover:text-blue-400 hover:bg-slate-800 group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium"
      >
        <section
          className="text-slate-900  group-hover:border-blue-400 group-hover:text-blue-400
          flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-slate-200"
        >
          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
        </section>
        <p className="truncate">Friend Requests</p>
        {requestCount > 0 && (
          <p className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-slate-200 bg-blue-700">
            {requestCount}
          </p>
        )}
      </Link>
    </>
  );
};

export default FriendRequestsSidebar;
