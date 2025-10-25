import type { ReactNode } from 'react';
import Image from 'next/image';

interface CodeExampleProps {
  children: ReactNode;
  output: string;
  outputAlt?: string;
}

export function CodeExample({ 
  children, 
  output, 
  outputAlt = "Code output" 
}: CodeExampleProps) {
  return (
    <div className="my-6 grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-lg border border-fd-border bg-fd-card overflow-hidden">
      <div className="relative">
        <div className="[&>pre]:m-0! [&>pre]:rounded-none! [&>pre]:border-0! [&>pre]:h-full">
          {children}
        </div>
      </div>

      <div className="flex items-center justify-center bg-fd-muted p-6 lg:p-8">
        <div className="rounded-lg bg-fd-background p-4 shadow-lg">
          <Image
            src={output}
            alt={outputAlt}
            width={400}
            height={300}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
}
