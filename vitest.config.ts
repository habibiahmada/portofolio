import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '.env.local');
const envVars: Record<string, string> = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      envVars[key.trim()] = value;
    }
  });
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    env: envVars,
    alias: {
      'next/navigation': path.resolve(__dirname, './__mocks__/next-navigation.ts'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
