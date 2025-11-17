'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { useQuotes } from '@/contexts/quote-context';
import { useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Markdown from 'markdown-to-jsx';

interface QuoteLinkProps {
    href: string;
    children?: React.ReactNode;
}

function CustomLink({ href, children }: QuoteLinkProps) {
    const { getQuote } = useQuotes();
    if (href?.startsWith('#')) {
        const quoteId = href.slice(1).split(',')[0];
        const quote = getQuote(quoteId);
        if (quote) {
            href = `${quote.pagePath}#${quoteId}`;
        }
    }
    return <a href={href} className="text-primary hover:underline">{children}</a>;
}

export function QuoteLink({ href, children }: QuoteLinkProps) {
    const { getQuote } = useQuotes();
    const router = useRouter();
    const pathname = usePathname();
    const [boundary, setBoundary] = useState<Element | null>(null);

    const quoteIds = useMemo(() => {
        const rawId = href.startsWith('#') ? href.slice(1) : href;
        return rawId.split(',').map(id => id.trim()).filter(Boolean);
    }, [href]);

    const quotes = useMemo(() => {
        return quoteIds
            .map(id => getQuote(id))
            .filter((quote): quote is NonNullable<typeof quote> => quote !== null && quote !== undefined);
    }, [quoteIds, getQuote]);

    const actualHref = useMemo(() => {
        if (quotes.length === 0) return href;
        const firstQuote = quotes[0];
        return `${firstQuote.pagePath}#${quoteIds[0]}`;
    }, [quotes, quoteIds, href]);


    const linkRef = useCallback((node: HTMLAnchorElement | null) => {
        if (node) {
            const container = node.closest('article');
            if (container) {
                setBoundary(container);
            }
        }
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (quoteIds.length > 0) {
            e.preventDefault();
            const firstId = quoteIds[0];
            const quote = getQuote(firstId);

            if (quote) {
                if (quote.pagePath !== pathname) {
                    router.push(`${quote.pagePath}#${firstId}`);
                } else {
                    const element = document.getElementById(firstId);
                    if (element) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        window.history.pushState(null, '', `#${firstId}`);
                    }
                }
            }
        }
    }, [quoteIds, getQuote, router, pathname]);

    if (quotes.length === 0) {
        return (
            <a
                ref={linkRef}
                href={href}
                className="text-primary hover:underline"
            >
                {children}
            </a>
        );
    }

    return (
        <HoverCard.Root openDelay={300} closeDelay={100}>
            <HoverCard.Trigger asChild>
                <a
                    ref={linkRef}
                    href={actualHref}
                    onClick={handleClick}
                    className="text-primary hover:underline cursor-pointer"
                >
                    {children}
                </a>
            </HoverCard.Trigger>

            <HoverCard.Portal>
                <HoverCard.Content
                    side="top"
                    align="start"
                    sideOffset={5}
                    alignOffset={-10}
                    collisionBoundary={boundary}
                    collisionPadding={20}
                    avoidCollisions={true}
                    className="z-50 max-w-200 rounded-lg border border-border p-4 bg-indigo-900/10 backdrop-filter backdrop-blur-xl shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-fd-background) 45%, transparent)' }}
                >
                    <div className="space-y-3">
                        {quotes.map((quote, index) => (
                            <div key={index} className={index > 0 ? 'pt-3 border-t border-border/50' : ''}>
                                <div className="text-sm prose text-foreground/85 italic leading-relaxed">
                                    <Markdown
                                        options={{
                                            overrides: {
                                                a: { component: CustomLink }
                                            }
                                        }}
                                    >
                                        {quote.text}
                                    </Markdown>
                                </div>
                                <footer className="text-xs text-muted-foreground flex items-center justify-between pt-2">
                                    <span className="text-primary/60 font-semibold">ГОСТ 7.32-2017</span>
                                    <span>страница {quote.page}</span>
                                </footer>
                            </div>
                        ))}
                    </div>
                    <HoverCard.Arrow style={{ fill: 'var(--color-fd-border)' }} />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}
