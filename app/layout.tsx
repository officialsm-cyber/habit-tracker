import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// ⚠️ จุดที่ 1: เพิ่มการตั้งค่าสีของแถบสถานะด้านบน (Status Bar) บนมือถือ
export const viewport: Viewport = {
  themeColor: "#10b981",
};

// ⚠️ จุดที่ 2: เพิ่มการเชื่อมต่อไฟล์ manifest และการตั้งค่าสำหรับระบบ Apple (iOS)
export const metadata: Metadata = {
  title: "Premium Habit Tracker",
  description: "Track your habits like a pro",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habits",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${inter.className} transition-colors duration-500 bg-white dark:bg-[#121212]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
