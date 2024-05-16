import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { fetchRedis } from "@/app/lib/redis";
import triggerPusherEvent from "@/app/lib/triggerPusherEvent";
import { toPusherKey } from "@/app/lib/utils/toPusherKey";
import { Message, messageValidator } from "@/app/lib/validations/message";
import { nanoid } from "nanoid";

// const MAX_RETRIES = 3;
// const RETRY_DELAY = 1000; // 1 second

// async function triggerPusherEvent(channel: string, event: string, data: any, retries = MAX_RETRIES) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       await pusherServer.trigger(channel, event, data);
//       return;
//     } catch (error) {
//       if (attempt === retries) {
//         throw error;
//       }
//       console.error(`Attempt ${attempt} failed:`, error);
//       await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
//     }
//   }
// }

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await auth();
    if (!session)
      return new Response("Unauthorized", {
        status: 401,
      });

    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`,
    )) as string[];

    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`,
    )) as string;

    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageValidator.parse(messageData);

    await triggerPusherEvent(toPusherKey(`chat:${chatId}`), "incoming-message", message);
    await triggerPusherEvent(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });
  
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("OK");
  } catch (error) {
    console.error("Error in POST handler:", error);
    if (error instanceof Error) {
      return new Response(error.message, {
        status: 500,
      });
    }
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}










// import { auth } from "@/app/lib/auth";
// import { db } from "@/app/lib/db";
// import { pusherServer } from "@/app/lib/pusher";
// import { fetchRedis } from "@/app/lib/redis";
// import { toPusherKey } from "@/app/lib/utils/toPusherKey";
// import { Message, messageValidator } from "@/app/lib/validations/message";
// import { nanoid } from "nanoid";

// export async function POST(req: Request) {
//   try {
//     const { text, chatId }: { text: string; chatId: string } = await req.json();
//     const session = await auth();
//     if (!session)
//       return new Response("Unauthorized", {
//         status: 401,
//       });

//     const [userId1, userId2] = chatId.split("--");

//     if (session.user.id !== userId1 && session.user.id !== userId2) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const friendId = session.user.id === userId1 ? userId2 : userId1;

//     const frinedList = (await fetchRedis(
//       "smembers",
//       `user:${session.user.id}:friends`,
//     )) as string[];

//     const isFriend = frinedList.includes(friendId);

//     if (!isFriend) {
//       return new Response("Unauthorized", { status: 401 });
//     }
//     const rawSender = (await fetchRedis(
//       "get",
//       `user:${session.user.id}`,
//     )) as string;

//     const sender = JSON.parse(rawSender) as User;

//     const timestamp = Date.now();

//     const messageData: Message = {
//       id: nanoid(),
//       senderId: session.user.id,
//       text,
//       timestamp,
//     };

//     const message = messageValidator.parse(messageData);

//     pusherServer.trigger(
//       toPusherKey(`chat:${chatId}`),
//       "incoming-message",
//       message,
//     );
//     pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
//       ...message,
//       senderImg: sender.image,
//       senderName: sender.name,
//     });
  
//     await db.zadd(`chat:${chatId}:messages`, {
//       score: timestamp,
//       member: JSON.stringify(message),
//     });

//     return new Response("OK");
//   } catch (error) {
//     if (error instanceof Error) {
//       return new Response(error.message, {
//         status: 500,
//       });
//     }
//     return new Response("Internal Server Error", {
//       status: 500,
//     });
//   }
// }



