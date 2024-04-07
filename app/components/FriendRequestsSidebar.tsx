"use client";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const FriendRequestsSidebar = () => {
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
      </Link>
    </>
  );
};

export default FriendRequestsSidebar;
