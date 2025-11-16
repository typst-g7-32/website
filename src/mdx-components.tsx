import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentPropsWithoutRef } from 'react';

import { TypstRender } from './components/docs/typst/renderer';
import { GostQuote } from './components/docs/quote';
import { QuoteLink } from './components/docs/quote-link';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    TypstRender,
    GostQuote,
    QuoteLink,
    ...components,
    a: (props: ComponentPropsWithoutRef<'a'>) => {
      if (props.href?.startsWith('#')) {
        return <QuoteLink {...props} href={props.href} />;
      }
      return <a {...props} target="_blank" rel="noopener noreferrer" />;
    },
  };
}
