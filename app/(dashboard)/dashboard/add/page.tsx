import AddFriendButton from "@/app/components/AddFriendButton";
import React from "react";

const page = () => {
  return (
    <main className="py-4 px-8 text-slate-200">
      <h1 className="text-5xl py-6 font-bold">Add a friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default page;
