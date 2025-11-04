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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.alias.canvas = false;

    return config;
  },
  reactStrictMode: true,
});
