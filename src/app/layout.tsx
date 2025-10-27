import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from '@next/third-parties/google'
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Typst 7.32",
  description: "Шаблон для оформления документов по ГОСТ 7.32-2017",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <link rel="icon" href="/favicon.ico" />
      <body className="antialiased">
        <Navbar />  
          {children}
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-CF82SLT7VV" />
    </html>
  );
}