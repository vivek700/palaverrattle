const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Commands,
  ...args: (string | number)[]
) {
  const commandUrl = `${redisUrl}/${command}/${args.join("/")}`;
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis command execution failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.result;
}
