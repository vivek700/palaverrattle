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
import MobileNav from "@/app/components/MobileNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palaverrattle | Dashboard",
  description: "A chat web app",
};

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
    <section className="flex w-full flex-col md:h-dvh md:flex-row ">
      <section
        className="flex h-full w-full grow flex-row items-center justify-between gap-y-5 border-gray-500 bg-slate-800/50 p-4 md:max-w-sm md:flex-col md:items-start md:justify-normal md:overflow-y-auto
       md:border-r md:p-6"
      >
        <Link
          href={"/dashboard"}
          className="group flex shrink-0 items-center text-2xl font-semibold md:h-16 md:text-3xl"
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
          <p className="hidden text-xs font-semibold text-slate-300 md:block">
            Your Chats
          </p>
        )}

        <MobileNav>
          {friends.length > 0 && (
            <p className="mt-10 py-2 text-xs font-semibold text-slate-300">
              Your Chats
            </p>
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
                <ul role="list" className=" mt-2 space-y-1">
                  {sideBarElement}
                  <li>
                    <FriendRequestsSidebar
                      initialRequestCount={reqCount}
                      sessionId={session?.user.id}
                    />
                  </li>
                </ul>
              </li>

              <li className="-ml-6 mt-auto flex items-center  ">
                <section className="flex w-8/12 flex-1 items-center gap-x-2 px-6 py-3 text-sm font-semibold text-slate-200">
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
                  <div className="flex  flex-col truncate">
                    <span aria-hidden="true">{session?.user.name}</span>
                    <abbr
                      title={session?.user.email || ""}
                      className="no-underline"
                    >
                      <span
                        className=" truncate text-xs text-slate-600"
                        aria-hidden="true"
                      >
                        {session?.user.email}
                      </span>
                    </abbr>
                  </div>
                </section>
                <SignOut className="h-11" />
              </li>
            </ul>
          </nav>
        </MobileNav>

        <nav className="hidden flex-1 flex-col md:flex">
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

            <li className="mt-auto flex items-center">
              <section className="flex flex-1 items-center gap-x-4 py-3 pr-3 text-sm font-semibold text-slate-200">
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

      <aside className="container max-h-dvh w-full md:py-4">{children}</aside>
    </section>
  );
};

export default Layout;
