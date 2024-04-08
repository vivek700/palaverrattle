import Requests from "@/app/components/Requests";
import { auth } from "@/app/lib/auth";
import { fetchRedis } from "@/app/lib/redis";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  const senderIds = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:friend_requests`
  )) as string[];

  const senderReq = await Promise.all(
    senderIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;

      const mails = JSON.parse(sender) as User;

      return {
        senderId,
        senderMail: mails?.email,
      };
    })
  );

  return (
    <main className="py-4 px-8 text-slate-200">
      <h1 className="text-5xl py-6 font-bold">Add a friend</h1>
      <section className="flex flex-col gap-4">
        <Requests initialRequests={senderReq} sessionId={session?.user.id} />
      </section>
    </main>
  );
};

export default Page;
