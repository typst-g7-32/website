'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExampleItem } from '@/types/example';

interface ExampleCardProps {
  example: ExampleItem;
  showTitle?: boolean;
}

export default function ExampleCard({ example, showTitle = true }: ExampleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/examples/${example.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
        <div className="relative aspect-3/4 overflow-hidden">
          <Image
            src={example.pngUrl}
            alt={example.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? '' : 'blur-xs'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {showTitle && (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
              {example.title}
            </h3>
          </div>
        )}
      </div>
    </Link>
  );
}
