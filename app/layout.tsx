import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CODER TOOLS",
  description: "开发者在线工具集",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <div className="flex flex-col h-screen">
          <header className="h-14 glass flex items-center px-6 fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                C
              </div>
              <h1 className="text-lg font-semibold tracking-tight">CODER TOOLS</h1>
            </div>
          </header>
          <main className="flex-1 pt-14 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
