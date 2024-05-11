import AddFriendButton from "@/app/components/AddFriendButton";
import React from "react";

const page = () => {
  return (
    <main className="py-4 text-slate-200 md:px-8">
      <h1 className="py-6 text-5xl font-bold">Add a friend</h1>
      <AddFriendButton />
    </main>
  );
};

export default page;
