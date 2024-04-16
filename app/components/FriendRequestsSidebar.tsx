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

    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const friendRequestHandler = () => {
      setRequestCount((prev) => prev + 1);
    };

    const friendHandler = () => {
      setRequestCount((prev) => prev - 1);
    };

    pusherClient.bind("friend_requests", friendRequestHandler);
    pusherClient.bind("new_friend", friendHandler);
    pusherClient.bind("reject_friend", friendHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:friend_requests`),
      );

      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.unbind("friend_requests", friendRequestHandler);
      pusherClient.unbind("new_friend", friendHandler);
      pusherClient.unbind("reject_friend", friendHandler);
    };
  }, [sessionId]);

  return (
    <>
      <Link
        href={"/dashboard/requests"}
        className="group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-blue-400"
      >
        <section
          className="flex  h-6 w-6
          shrink-0 items-center justify-center rounded-lg border bg-slate-200 text-[0.625rem] font-medium text-slate-900 group-hover:border-blue-400 group-hover:text-blue-400"
        >
          <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
        </section>
        <p className="truncate">Friend Requests</p>
        {requestCount > 0 && (
          <p className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-xs text-slate-200">
            {requestCount}
          </p>
        )}
      </Link>
    </>
  );
};

export default FriendRequestsSidebar;
