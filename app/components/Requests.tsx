"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Icons } from "./Icons";
import { useRouter } from "next/navigation";

const Requests = ({
  initialRequests,
  sessionId,
}: {
  initialRequests: FriendRequest[];
  sessionId: string;
}) => {
  const [requests, setRequests] = useState<FriendRequest[]>(initialRequests);

  const router = useRouter();

  const accept = async (senderId: string) => {
    console.log(senderId);
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
    <section key={req.senderId} className="flex gap-4 items-center ">
      <FontAwesomeIcon icon={Icons.faUserPlus} className="w-8 h-8" />
      <p className="font-medium text-lg">{req?.senderMail}</p>
      <button
        onClick={() => accept(req.senderId)}
        aria-label="accept friend"
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 grid place-items-center rounded-full transition hover:shadow-md"
      >
        <abbr title="Accept">
          <FontAwesomeIcon icon={Icons.faCheck} className="w-4 h-4" />
        </abbr>
      </button>
      <button
        onClick={() => reject(req.senderId)}
        aria-label="reject friend"
        className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
      >
        <abbr title="Reject">
          <FontAwesomeIcon icon={Icons.faXmark} className="w-4 h-4" />
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
