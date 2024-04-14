"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Icons } from "./Icons";
import { useRouter } from "next/navigation";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "../lib/utils/toPusherKey";

const Requests = ({
  initialRequests,
  sessionId,
}: {
  initialRequests: incomingFriendRequest[];
  sessionId: string;
}) => {
  const [requests, setRequests] =
    useState<incomingFriendRequest[]>(initialRequests);

  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friend_requests`));
    const friendRequestHandler = ({
      senderId,
      senderMail,
    }: incomingFriendRequest) => {
      setRequests((prev) => [...prev, { senderId, senderMail }]);
    };

    pusherClient.bind("friend_requests", friendRequestHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:friend_requests`),
      );
      pusherClient.unbind("friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const accept = async (senderId: string) => {
    await fetch("http://localhost:3000/api/friends/accept", {
      method: "POST",
      body: JSON.stringify({ id: senderId }),
    });

    setRequests((prev) => prev.filter((req) => req.senderId !== senderId));

    router.refresh();
  };
  const reject = async (senderId: string) => {
    await fetch("http://localhost:3000/api/friends/reject", {
      method: "POST",
      body: JSON.stringify({ id: senderId }),
    });

    setRequests((prev) => prev.filter((req) => req.senderId !== senderId));

    router.refresh();
  };

  const reqElement = requests?.map((req) => (
    <section key={req.senderId} className="flex items-center gap-4 ">
      <FontAwesomeIcon icon={Icons.faUserPlus} className="h-8 w-8" />
      <p className="text-lg font-medium">{req?.senderMail}</p>
      <button
        onClick={() => accept(req.senderId)}
        aria-label="accept friend"
        className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 transition hover:bg-blue-700 hover:shadow-md"
      >
        <abbr title="Accept">
          <FontAwesomeIcon icon={Icons.faCheck} className="h-4 w-4" />
        </abbr>
      </button>
      <button
        onClick={() => reject(req.senderId)}
        aria-label="reject friend"
        className="grid h-8 w-8 place-items-center rounded-full bg-red-600 transition hover:bg-red-700 hover:shadow-md"
      >
        <abbr title="Reject">
          <FontAwesomeIcon icon={Icons.faXmark} className="h-4 w-4" />
        </abbr>
      </button>
    </section>
  ));

  return (
    <>
      {requests.length === 0 ? (
        <p className="text-slate-600">There is no friend requests.</p>
      ) : (
        reqElement
      )}
    </>
  );
};

export default Requests;
