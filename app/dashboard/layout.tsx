import { FC, ReactNode } from "react";
import { auth } from "../lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Icon, Icons } from "../components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import SignOut from "../components/SignOut";
import FriendRequestsSidebar from "../components/FriendRequestsSidebar";
import { fetchRedis } from "../lib/redis";
import { getFriendsByUserId } from "../lib/get-friends";
import SidebarChat from "../components/SidebarChat";

interface LayouProps {
  children: ReactNode;
}

type Sidebartypes = {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
};

const sideBarOpt: Sidebartypes[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "faUserPlus",
  },
];

const Layout: FC<LayouProps> = async ({ children }) => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const friends = await getFriendsByUserId(session.user.id);

  const reqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session?.user.id}:friend_requests`
    )) as User[]
  ).length;

  const sideBarElement = sideBarOpt.map((opt) => {
    const Icon = Icons[opt.Icon];
    return (
      <li key={opt.id}>
        <Link
          href={opt.href}
          className="text-slate-200 hover:text-blue-500 hover:bg-slate-800 group items-center flex gap-3 rounded-md p-2 text-sm"
        >
          <span className="text-slate-800 border-slate-800 group-hover:border-blue-600 group-hover:text-blue-600  flex h-6 w-6 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-slate-200">
            <FontAwesomeIcon icon={Icon} className="w-4 h-4" />
          </span>
          <span className="truncate">{opt.name}</span>
        </Link>
      </li>
    );
  });

  return (
    <section className="w-full flex h-dvh">
      <section
        className=" flex grow flex-col gap-y-5 w-full h-full max-w-sm overflow-y-auto border-r border-gray-500
       bg-slate-800/50 p-6"
      >
        <Link
          href={"/dashboard"}
          className="flex h-16 shrink-0 items-center text-3xl font-semibold"
        >
          <abbr title="Dashboard" className="flex items-center no-underline">
            <FontAwesomeIcon icon={Icons.faEnvelope} className="w-8 h-8 mr-2" />
            <span>Palaverrattle</span>
          </abbr>
        </Link>
        {friends.length > 0 && (
          <p className="text-xs font-semibold text-slate-300">Your Chats</p>
        )}

        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-col flex-1 gap-y-7">
            <li>
              <SidebarChat sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <section className="text-xs font-semibold text-slate-300">
                Overview
              </section>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sideBarElement}
                <li>
                  <FriendRequestsSidebar
                    initialRequestCount={reqCount}
                    sessionId={session?.user.id}
                  />
                </li>
              </ul>
            </li>

            <li className="-ml-6 mt-auto flex items-center">
              <section className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold text-slate-200">
                <section className="relative h-10 w-10 bg-slate-800 rounded-full">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                    unoptimized
                  />
                </section>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session?.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session?.user.email}
                  </span>
                </div>
              </section>
              <SignOut className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </section>
      {children}
    </section>
  );
};

export default Layout;
