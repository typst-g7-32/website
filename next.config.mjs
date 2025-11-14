import { createMDX } from 'fumadocs-mdx/next';
import remarkTypstPath from './src/lib/remark-typst-path.js';

const withMDX = createMDX({
  mdxOptions: {
    remarkPlugins: [remarkTypstPath],
    development: process.env.NODE_ENV === 'development',
  },
});

export default withMDX({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/typst-g7-32/modern-g7-32/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/typst-g7-32/examples/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    } else {
      config.externals.push({
        canvas: 'canvas',
        "@myriaddreamin/typst-ts-node-compiler": "@myriaddreamin/typst-ts-node-compiler",
      });
    }

    return config;
  },
  serverExternalPackages: ['pdfjs-dist'],
  reactStrictMode: true,
});
