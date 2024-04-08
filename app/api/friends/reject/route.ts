import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id: idToReject } = z.object({ id: z.string() }).parse(body);

    await db.srem(`user:${session.user.id}:friend_requests`, idToReject);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
