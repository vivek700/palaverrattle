import { FC, ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Icon, Icons } from "@/app/components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { getFriendsByUserId } from "@/app/lib/get-friends";
import { fetchRedis } from "@/app/lib/redis";
import SidebarChat from "@/app/components/SidebarChat";
import FriendRequestsSidebar from "@/app/components/FriendRequestsSidebar";
import SignOut from "@/app/components/SignOut";
import { auth } from "@/app/lib/auth";

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
      `user:${session?.user.id}:friend_requests`,
    )) as User[]
  ).length;

  const sideBarElement = sideBarOpt.map((opt) => {
    const Icon = Icons[opt.Icon];
    return (
      <li key={opt.id}>
        <Link
          href={opt.href}
          className="group flex items-center gap-3 rounded-md p-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-blue-500"
        >
          <span className="flex h-6 w-6 items-center  justify-center rounded-lg border border-slate-800 bg-slate-200 text-[0.625rem] font-medium text-slate-800 group-hover:border-blue-600 group-hover:text-blue-600">
            <FontAwesomeIcon icon={Icon} className="h-4 w-4" />
          </span>
          <span className="truncate">{opt.name}</span>
        </Link>
      </li>
    );
  });

  return (
    <section className=" flex h-dvh w-full">
      <section
        className=" flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-500
       bg-slate-800/50 p-6"
      >
        <Link
          href={"/dashboard"}
          className="group flex h-16 shrink-0 items-center text-3xl font-semibold"
        >
          <abbr title="Dashboard" className="flex items-center no-underline">
            <FontAwesomeIcon
              icon={Icons.faEnvelope}
              className="mr-2 h-8 w-8 group-hover:animate-bounce"
            />
            <span>Palaverrattle</span>
          </abbr>
        </Link>
        {friends.length > 0 && (
          <p className="text-xs font-semibold text-slate-300">Your Chats</p>
        )}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
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
                <section className="relative h-10 w-10 rounded-full bg-slate-800">
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
                  <span className="text-xs text-slate-600" aria-hidden="true">
                    {session?.user.email}
                  </span>
                </div>
              </section>
              <SignOut className="h-11" />
            </li>
          </ul>
        </nav>
      </section>
      <aside className="container max-h-screen w-full py-4">{children}</aside>
    </section>
  );
};

export default Layout;
