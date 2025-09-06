import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ]
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);