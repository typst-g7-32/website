import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { TypstRender } from '@/components/typst-render';
import { GostQuote } from './components/docs/quote';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    TypstRender,
    ...components,
  };
}
