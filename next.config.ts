import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzerImport from '@next/bundle-analyzer';

const withBundleAnalyzer = withBundleAnalyzerImport({
    enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
    // Build cache is enabled by default in Next.js
    // Cache location: .next/cache
    // Cache invalidation: automatic on dependency/config/source changes
    // See docs/BUILD_CACHE.md for detailed documentation

    // File watcher optimization - exclude directories from watching
    // Reduces memory footprint and improves hot reload performance
    // Requirements: 5.3, 5.4, 15.1, 15.2, 15.3
    webpack: (config) => {
        // Configure file watcher to exclude directories
        if (config.watchOptions) {
            config.watchOptions = {
                ...config.watchOptions,
                ignored: [
                    '**/node_modules/**',
                    '**/.next/**',
                    '**/.git/**',
                    '**/dist/**',
                    '**/build/**',
                ],
            };
        }
        return config;
    },

    // Development-specific settings
    ...(isDev && {
        // Disable heavy optimizations in development for faster hot reload
        compiler: {
            removeConsole: false,
        },
    }),

    // Production-specific settings
    ...(isProd && {
        // Enable all optimizations in production
        compiler: {
            removeConsole: {
                exclude: ['error', 'warn'],
            },
        },
        // Enable compression
        compress: true,
        // Generate source maps for production debugging
        productionBrowserSourceMaps: true,
    }),

    images: {
        formats: ['image/avif', 'image/webp'],
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
            },
            {
                protocol: 'https',
                hostname: 'tjxcfcllkceoauuwurfe.supabase.co'
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
    experimental: {
        optimizePackageImports: [
            'next-intl',
            'lucide-react',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@supabase/supabase-js',
            'sonner',
        ],
    },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withBundleAnalyzer(withNextIntl(nextConfig));