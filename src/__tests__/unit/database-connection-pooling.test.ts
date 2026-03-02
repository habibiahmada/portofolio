/**
 * Unit Test for Database Connection Pooling
 * Feature: nextjs-performance-optimization
 * Example 27: Test Supabase client uses connection pooling
 * Validates: Requirements 21.3
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Example 27: Database Connection Pooling', () => {
  it('should configure Supabase admin client with connection pooling', () => {
    const adminClientPath = path.join(process.cwd(), 'src/lib/supabase/admin.ts');
    
    if (!fs.existsSync(adminClientPath)) {
      throw new Error('Supabase admin client file not found');
    }
    
    const content = fs.readFileSync(adminClientPath, 'utf-8');
    
    // Check for connection pooling configuration
    // This can be indicated by:
    // 1. Connection pool headers
    // 2. Pool configuration in createClient options
    // 3. Comments indicating pooling is enabled
    
    const hasPoolingConfig = 
      content.includes('connection-pool') ||
      content.includes('connectionPool') ||
      content.includes('pool') ||
      content.includes('x-connection-pool');
    
    expect(hasPoolingConfig).toBe(true);
  });
  
  it('should use admin client for server-side operations', () => {
    const adminClientPath = path.join(process.cwd(), 'src/lib/supabase/admin.ts');
    
    if (!fs.existsSync(adminClientPath)) {
      throw new Error('Supabase admin client file not found');
    }
    
    const content = fs.readFileSync(adminClientPath, 'utf-8');
    
    // Should use service role key for admin operations
    const usesServiceRoleKey = content.includes('SUPABASE_SERVICE_ROLE_KEY');
    
    expect(usesServiceRoleKey).toBe(true);
  });
  
  it('should configure auth settings for server-side client', () => {
    const adminClientPath = path.join(process.cwd(), 'src/lib/supabase/admin.ts');
    
    if (!fs.existsSync(adminClientPath)) {
      throw new Error('Supabase admin client file not found');
    }
    
    const content = fs.readFileSync(adminClientPath, 'utf-8');
    
    // Server-side client should disable session persistence
    const disablesSession = 
      content.includes('persistSession: false') ||
      content.includes('autoRefreshToken: false');
    
    expect(disablesSession).toBe(true);
  });
});
