import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import { baseOptions } from '@/lib/layout.shared';
import { QuoteProvider } from '@/contexts/quote-context';

import '@/styles/typst-render.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.pageTree}
      containerProps={{
        className: "mx-(--fd-layout-offset)",
      }}
      {...baseOptions()}
    >
      <QuoteProvider>
        {children}
      </QuoteProvider>
    </DocsLayout>
  );
}