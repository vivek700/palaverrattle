import { db } from "./lib/db";

export default async function Home() {
  // await db.set("hello", "vivek");

  return (
    <main className="text-center text-2xl">
      <h1>palaverrattler</h1>
    </main>
  );
}
