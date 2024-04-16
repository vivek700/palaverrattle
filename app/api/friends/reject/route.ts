import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { fetchRedis } from "@/app/lib/redis";
import { toPusherKey } from "@/app/lib/utils/toPusherKey";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: idToReject } = z.object({ id: z.string() }).parse(body);

    const [userStringObj, friendStringObj] = (await Promise.all([
      fetchRedis("get", `user:${session.user.id}`),
      fetchRedis("get", `user:${idToReject}`),
    ])) as [string, string];

    const user = JSON.parse(userStringObj) as User;
    const friend = JSON.parse(friendStringObj) as User;

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToReject}:friends`),
        "reject_friend",
        user,
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "reject_friend",
        friend,
      ),
      await db.srem(`user:${session.user.id}:friend_requests`, idToReject),
    ]);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
