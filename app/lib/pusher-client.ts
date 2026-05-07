"use client";

let pusherClient: any;

if (typeof window !== "undefined") {
  const Pusher = require("pusher-js");
  pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: "ap2",
  });
}

export { pusherClient };
