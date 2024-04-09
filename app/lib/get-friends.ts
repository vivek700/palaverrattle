import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const ids = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    ids.map(async (id) => {
      const friend = (await fetchRedis("get", `user:${id}`)) as string;

      const parseFriend = JSON.parse(friend) as User;

      return parseFriend;
    })
  );

  return friends;
};
