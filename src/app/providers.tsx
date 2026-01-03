'use client';

import { YandexMetricaProvider } from '@artginzburg/next-ym';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <YandexMetricaProvider
        tagID={105476873}
        initParameters={{
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: "dataLayer"
        }}
        strategy="afterInteractive"
      >
        {children}
      </YandexMetricaProvider>
    </>
  );
}
