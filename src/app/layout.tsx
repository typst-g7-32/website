import type { Metadata } from "next";
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Suspense } from "react";

import { YandexMetrika } from "@/components/yandex-metrics";

import "./globals.css";
import '../components/sections/comparison/styles.css'
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';

import "./globals.css";

const siteUrl = "https://typst-gost.ru";
const siteName = "Typst 7.32";

export const metadata: Metadata = {
  title: "Typst 7.32 — Шаблон для ГОСТ 7.32-2017",
  description: "Шаблон для автоматического оформления документов по ГОСТ 7.32-2017. Используй для курсовых, дипломных работ и лабораторных.",
  keywords: ["ГОСТ 7.32-2017", "Typst", "шаблон", "оформление документов"],

  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Typst 7.32 — Шаблон для ГОСТ 7.32-2017",
    description: "Шаблон для автоматического оформления документов по ГОСТ 7.32-2017",
    siteName: siteName,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Typst 7.32 Preview",
      }
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Typst 7.32 — Шаблон для ГОСТ 7.32-2017",
    description: "Шаблон для автоматического оформления документов по ГОСТ 7.32-2017",
    images: [`${siteUrl}/og-image.png`],
  },
  
  robots: "index, follow",
};

const { provider } = defineI18nUI(i18n, {
  translations: {
    ru: {
      displayName: 'Русский',
      search: 'Поиск',
      searchNoResult: 'Ничего не найдено',
      toc: 'На этой странице',
      lastUpdate: 'Последнее обновление',
      chooseLanguage: 'Выбрать язык',
      chooseTheme: 'Выбрать тему',
      nextPage: "Следующая страница",
      previousPage: "Предыдущая страница",
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={siteUrl} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Typst 7.32",
              description: "Шаблон для автоматического оформления документов по ГОСТ 7.32-2017",
              url: siteUrl,
              applicationCategory: "DeveloperApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "RUB"
              },
              potentialAction: {
                "@type": "UseAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: siteUrl
                }
              }
            })
          }}
        />
      </head>
      
      <body className="antialiased">
        <RootProvider
          theme={{
            defaultTheme: 'dark',
          }}
          i18n={provider("ru")}
        >
        {children}
        </RootProvider>
      </body>

      <Suspense fallback={<></>}>
        <YandexMetrika />
      </Suspense>
    </html>
  );
}
