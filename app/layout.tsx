import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Palaverrattle",
  description:
    "Palaverrattle is a real-time web chat app built with Next.js, Pusher, and Upstash Redis, featuring secure Google authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} scrollbar-w-2 scrollbar-thumb-blue scrollbar-thumb-rounded`}
      >
        {children}
      </body>
    </html>
  );
}
