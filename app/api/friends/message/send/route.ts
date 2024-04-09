import { auth } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();
    const session = await auth();
    if (!session)
      return new Response("Unauthorized", {
        status: 401,
      });
  } catch (error) {}
}
