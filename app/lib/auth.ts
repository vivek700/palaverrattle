import NextAuth from "next-auth";
import { db } from "./db";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import authConfig from "@/auth.config";
import { fetchRedis } from "./redis";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  trustHost: true,
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis("get", `user:${token?.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id!;
        }
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser!?.id,
        name: dbUser!?.name,
        email: dbUser!?.email,
        picture: dbUser!?.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token?.id;
        session.user.name = token?.name;
        session.user.email = token?.email!;
        session.user.image = token?.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
});
