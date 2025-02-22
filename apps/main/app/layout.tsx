import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
