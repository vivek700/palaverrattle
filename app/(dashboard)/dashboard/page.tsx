import { auth } from "@/app/lib/auth";
import { getFriendsByUserId } from "@/app/lib/get-friends";
import { fetchRedis } from "@/app/lib/redis";
import { notFound } from "next/navigation";
import { pathConstructor } from "@/app/lib/utils/pathConstructor";
import { faDivide } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "@/app/components/Icons";

const Dashboard = async () => {
  const session = await auth();

  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const lastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [messageRaw] = (await fetchRedis(
        "zrange",
        `chat:${pathConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1,
      )) as string[];

      const message = JSON.parse(messageRaw);
      return {
        ...friend,
        message,
      };
    }),
  );

  return (
    <main className="text-center">
      <h1 className="mb-8 mt-4 text-4xl font-bold">Recent chats</h1>
      {lastMessage.length === 0 ? (
        <p className="text-sm">Nothing to show here...</p>
      ) : (
        lastMessage.map((friend) => (
          <div
            key={friend.id}
            className="relative rounded-md border border-zinc-200 bg-slate-800/50 p-3"
          >
            <div className="absolute inset-y-0 right-4 flex items-center">
              <FontAwesomeIcon icon={Icons.faAngleRight} />
            </div>

            <Link
              href={`/dashboard/chat/${pathConstructor(
                session.user.id,
                friend.id,
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image}
                    fill
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.message.senderId === session.user.id ? "You: " : ""}
                  </span>
                  {friend.message.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </main>
  );
};

export default Dashboard;
