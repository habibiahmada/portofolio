#!/usr/bin/env bun
import { createClient } from "@supabase/supabase-js";

/**
 * Create Admin User Script
 *
 * Creates an admin user with email and password in Supabase.
 * Usage: bun scripts/create-admin.ts <email> <password>
 *
 * Examples:
 *   bun scripts/create-admin.ts admin@example.com "your-secure-password"
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: bun scripts/create-admin.ts <email> <password>");
  console.error("Example: bun scripts/create-admin.ts admin@example.com 'your-secure-password'");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function createAdminUser() {
  console.log(`Creating admin user: ${email}...`);

  try {
    // Create auth user with email and password
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });

    if (error) {
      console.error("Error creating user:", error.message);
      process.exit(1);
    }

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${data.user?.email}`);
    console.log(`   User ID: ${data.user?.id}`);
    console.log(`\nYou can now login at: http://localhost:3000/login`);
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    process.exit(1);
  }
}

createAdminUser();
