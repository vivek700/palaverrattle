import AddFriendButton from "@/app/components/AddFriendButton";
import React from "react";

const page = () => {
  return (
    <section className="p-10 text-slate-200">
      <h1 className="text-3xl py-6 font-semibold">Add a friend</h1>
      <AddFriendButton />
    </section>
  );
};

export default page;
