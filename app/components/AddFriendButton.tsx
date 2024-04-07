"use client";
import React from "react";
import Button from "./ui/Button";
import { validator } from "../lib/validations/addFriend";
import { useFormState, useFormStatus } from "react-dom";
import { SendRequest } from "../lib/action";
import { error } from "console";

const initialState = {
  message: "",
  error: "",
};

const AddFriendButton = () => {
  const { pending } = useFormStatus();
  console.log(pending);

  const [state, formAction] = useFormState(SendRequest, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="email" className="block">
        Add friend by E-mail
      </label>
      <section className="my-2 flex gap-4">
        <input
          type="email"
          name="email"
          id="email"
          required
          className="block rounded-full py-1 border-0 text-gray-200 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 bg-slate-800/30"
          placeholder="you@example.com"
        />
        <Button type="submit" loading={pending}>
          Add
        </Button>
      </section>
      {state?.errors ? (
        <p className="text-base text-red-500">{state?.message}</p>
      ) : (
        <p className="text-base text-green-500">{state?.message}</p>
      )}
    </form>
  );
};

export default AddFriendButton;
