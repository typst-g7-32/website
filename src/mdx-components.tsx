import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { CodeExample } from '@/components/code-example';
import { GostQuote } from './components/docs/quote';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    CodeExample,
    GostQuote,
    ...components,
  };
}