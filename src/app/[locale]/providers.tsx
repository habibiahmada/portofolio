'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  const pathname = usePathname();
  
  // Only wrap with AuthProvider for admin/dashboard routes
  const isAdminRoute = pathname?.includes('/dashboard') || pathname?.includes('/login');
  
  return (
    <ThemeProvider {...props}>
      {isAdminRoute ? (
        <AuthProvider>
          {children}
        </AuthProvider>
      ) : (
        children
      )}
    </ThemeProvider>
  );
}