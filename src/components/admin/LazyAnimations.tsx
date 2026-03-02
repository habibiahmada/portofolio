'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReactNode } from 'react';

/**
 * Loading skeleton for animation components
 * Displays a placeholder while the animation library is being loaded
 */
export function AnimationSkeleton() {
  return (
    <div className="w-full h-75 flex items-center justify-center border rounded-lg bg-muted/30">
      <Skeleton className="w-32 h-32 rounded-full" />
    </div>
  );
}

/**
 * Lazy-loaded Lottie animation component
 * Configured with ssr: false to prevent server-side rendering
 * Includes loading skeleton for better UX
 *
 * Note: Requires 'lottie-react' package to be installed
 */
/*
export const LazyLottieAnimation = dynamic(
  () => import('lottie-react').then((mod) => ({
    default: mod.default,
  })).catch(() => ({
    default: () => (
      <div className="w-full h-[300px] flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Animation component not available</p>
      </div>
    ),
  })),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);
*/

// Placeholder for Lottie animation while package is not installed
export const LazyLottieAnimation = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="w-full h-75 flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">Lottie animation not configured</p>
      </div>
    ),
  }),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded Framer Motion component
 * For complex animations and transitions
 *
 * Note: Requires 'framer-motion' package to be installed
 */
/*
export const LazyMotion = dynamic(
  () => import('framer-motion').then((mod) => ({
    default: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...(props as Record<string, unknown>)}>{children}</div>,
  })).catch(() => ({
    default: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...(props as Record<string, unknown>)}>{children}</div>,
  })),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);
*/

// Placeholder for Framer Motion while package is not installed
export const LazyMotion = dynamic(
  () => Promise.resolve({
    default: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...(props as Record<string, unknown>)}>{children}</div>,
  }),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);

/**
 * Lazy-loaded AnimatePresence from Framer Motion
 * For exit animations
 *
 * Note: Requires 'framer-motion' package to be installed
 */
/*
export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => ({
    default: mod.AnimatePresence,
  })).catch(() => ({
    default: ({ children }: { children: ReactNode }) => <>{children}</>,
  })),
  {
    loading: () => null,
    ssr: false,
  }
);
*/

// Placeholder for AnimatePresence while framer-motion is not installed
export const LazyAnimatePresence = dynamic(
  () => Promise.resolve({
    default: ({ children }: { children: ReactNode }) => <>{children}</>,
  }),
  {
    loading: () => null,
    ssr: false,
  }
);

/**
 * Lazy-loaded React Spring animation component
 * Alternative animation library
 *
 * Note: Requires '@react-spring/web' package to be installed
 */
/*
export const LazySpringAnimation = dynamic(
  () => import('@react-spring/web').then((mod) => ({
    default: mod.animated.div,
  })).catch(() => ({
    default: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...(props as Record<string, unknown>)}>{children}</div>,
  })),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);
*/

// Placeholder for React Spring while package is not installed
export const LazySpringAnimation = dynamic(
  () => Promise.resolve({
    default: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => <div {...(props as Record<string, unknown>)}>{children}</div>,
  }),
  {
    loading: () => <AnimationSkeleton />,
    ssr: false,
  }
);
