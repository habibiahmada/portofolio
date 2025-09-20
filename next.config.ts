import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com'
            }
        ]
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    // Optimasi untuk Next.js 15 dan i18n
    experimental: {
        // Memastikan async params berfungsi dengan baik
        optimizePackageImports: ['next-intl'],
    },
};
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);