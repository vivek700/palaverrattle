import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { fetchRedis } from "@/app/lib/redis";
import triggerPusherEvent from "@/app/lib/triggerPusherEvent";
import { toPusherKey } from "@/app/lib/utils/toPusherKey";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    );

    if (isAlreadyFriends) {
      return new Response("Already friends", { status: 400 });
    }
    const hasFriendReq = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friend_requests`,
      idToAdd,
    );
    if (!hasFriendReq) {
      return new Response("No friend request", { status: 400 });
    }

    const [userStringObj, friendStringObj] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userStringObj) as User;
    const friend = JSON.parse(friendStringObj) as User;

    await Promise.all([


      await triggerPusherEvent(toPusherKey(`user:${idToAdd}:friends`),
        "new_friend",
        user),
      await triggerPusherEvent(toPusherKey(`user:${session.user.id}:friends`),
        "new_friend",
        friend),



      await db.sadd(`user:${session.user.id}:friends`, idToAdd),
      await db.sadd(`user:${idToAdd}:friends`, session.user.id),

      // await db.srem(`user:${idToAdd}:friend_requests`, session.user.id);

      await db.srem(`user:${session.user.id}:friend_requests`, idToAdd),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
