"use client";

import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { useLoggedIn } from "@/hooks";
import { useRouter } from "next/navigation";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = useLoggedIn();
  useRouter();
  const { push } = useRouter();
  return (
    <html>
      <body className={robotoMono.className}>{children}</body>
    </html>
  );
}
