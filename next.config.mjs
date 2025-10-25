import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
});

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/typst-g7-32/modern-g7-32/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                port: '',
                pathname: '/typst-g7-32/examples/**',
                search: '',
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
};

export default withMDX(config);