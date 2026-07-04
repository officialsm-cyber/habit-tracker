import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Habit Tracker",
  description: "Track your habits like a pro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-500 bg-white dark:bg-[#121212]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}