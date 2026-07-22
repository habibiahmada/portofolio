import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Note: Bun automatically loads .env.local into process.env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const postgresUrl = process.env.POSTGRES_URL;

if (!supabaseUrl || !supabaseServiceKey || !postgresUrl) {
  console.error("Missing required environment variables. Please check .env.local.");
  process.exit(1);
}

const pgClient = new Client({
  connectionString: postgresUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const cleanSupabaseUrl = supabaseUrl.replace(/\/$/, "");

async function emptyBucketRecursive(bucketName: string, folderPath: string = "") {
  const { data: items, error } = await supabase.storage.from(bucketName).list(folderPath);
  if (error) {
    console.error(`Error listing folder "${folderPath}" in bucket "${bucketName}":`, error.message);
    return;
  }

  if (!items || items.length === 0) return;

  const filesToDelete: string[] = [];
  for (const item of items) {
    const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
    if (item.id === null) {
      // It's a folder, traverse recursively first
      await emptyBucketRecursive(bucketName, fullPath);
    } else {
      filesToDelete.push(fullPath);
    }
  }

  if (filesToDelete.length > 0) {
    console.log(`Deleting files from "${bucketName}":`, filesToDelete);
    const { error: deleteError } = await supabase.storage.from(bucketName).remove(filesToDelete);
    if (deleteError) {
      console.error(`Failed to delete files in bucket "${bucketName}":`, deleteError.message);
    }
  }
}

async function main() {
  try {
    // ── 0. RESET AUTH USERS ──
    console.log("Deleting all auth users via Management API...");
    try {
      const authBaseUrl = `${cleanSupabaseUrl}/auth/v1/admin/users`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const listResp = await fetch(authBaseUrl, {
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!listResp.ok) {
        console.error(`Failed to list auth users: ${listResp.status} ${listResp.statusText}`);
      } else {
        const listData: any = await listResp.json();
        const users = listData?.users || [];
        if (users.length > 0) {
          console.log(`Found ${users.length} auth user(s). Deleting...`);
          for (const u of users) {
            const delController = new AbortController();
            const delTimeoutId = setTimeout(() => delController.abort(), 15000);
            const delResp = await fetch(`${authBaseUrl}/${u.id}`, {
              method: "DELETE",
              headers: {
                apikey: supabaseServiceKey,
                Authorization: `Bearer ${supabaseServiceKey}`,
              },
              signal: delController.signal,
            });
            clearTimeout(delTimeoutId);
            if (delResp.ok) {
              console.log(`Deleted auth user: ${u.email || u.id}`);
            } else {
              const delErr = await delResp.text();
              console.error(`Failed to delete user ${u.email || u.id}: ${delResp.status} ${delErr}`);
            }
          }
        } else {
          console.log("No auth users found to delete.");
        }
      }
    } catch (authErr: any) {
      if (authErr.name === "AbortError") {
        console.error("Auth management API timed out. Skipping auth user deletion.");
      } else {
        console.error("Auth management API error (skipping):", authErr.message || authErr);
      }
    }

    // ── 1. RESET DATABASE TABLES ──
    console.log("Connecting to PostgreSQL...");
    await pgClient.connect();

    console.log("Dropping existing tables...");
    await pgClient.query("DROP TABLE IF EXISTS projects CASCADE;");
    await pgClient.query("DROP TABLE IF EXISTS certificates CASCADE;");
    await pgClient.query("DROP TABLE IF EXISTS companies CASCADE;");
    await pgClient.query("DROP TABLE IF EXISTS allowed_users CASCADE;");

    console.log("Creating tables with correct clean schemas...");
    
    // Allowed Users
    await pgClient.query(`
      CREATE TABLE allowed_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Companies (logo is TEXT, not array!)
    await pgClient.query(`
      CREATE TABLE companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        logo TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Certificates (thumb is TEXT, pages is TEXT[])
    await pgClient.query(`
      CREATE TABLE certificates (
        id TEXT PRIMARY KEY,
        org TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        pages TEXT[] DEFAULT '{}'::text[],
        thumb TEXT,
        is_pinned BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Projects (image is TEXT, tags is TEXT[])
    await pgClient.query(`
      CREATE TABLE projects (
        id TEXT PRIMARY KEY,
        title_en TEXT NOT NULL,
        title_id TEXT NOT NULL,
        description_en TEXT,
        description_id TEXT,
        image TEXT,
        tags TEXT[] DEFAULT '{}'::text[],
        live_url TEXT,
        github_url TEXT,
        year INTEGER,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Seed allowed admin emails
    const emails = (process.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    for (const email of emails) {
      await pgClient.query("INSERT INTO allowed_users (email) VALUES ($1) ON CONFLICT DO NOTHING;", [email]);
      console.log(`Seeded allowed admin: ${email}`);
    }

    // ── 2. RESET STORAGE BUCKETS ──
    console.log("Listing existing storage buckets...");
    const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();
    if (listBucketsError) throw listBucketsError;

    for (const bucket of buckets || []) {
      console.log(`Cleaning up storage bucket: ${bucket.name}...`);
      await emptyBucketRecursive(bucket.name);
      
      const { error: deleteBucketError } = await supabase.storage.deleteBucket(bucket.name);
      if (deleteBucketError) {
        console.error(`Failed to delete bucket "${bucket.name}":`, deleteBucketError.message);
      } else {
        console.log(`Bucket "${bucket.name}" deleted.`);
      }
    }

    const targetBuckets = ["projects", "companies", "certificates"];
    for (const bucketName of targetBuckets) {
      console.log(`Creating public bucket "${bucketName}"...`);
      const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 10, // 10MB
      });
      if (createBucketError) throw createBucketError;
    }

    // Helper function to upload file and return public URL
    const uploadFile = async (localPath: string, bucketName: string, destinationKey: string): Promise<string> => {
      const absolutePath = path.resolve(localPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Local file not found at ${absolutePath}`);
      }

      const fileBuffer = fs.readFileSync(absolutePath);
      
      // Determine content type
      let contentType = "image/webp";
      if (localPath.endsWith(".png")) contentType = "image/png";
      else if (localPath.endsWith(".jpg") || localPath.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (localPath.endsWith(".pdf")) contentType = "application/pdf";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(destinationKey, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${localPath} to ${bucketName}/${destinationKey}: ${uploadError.message}`);
      }

      const publicUrl = `${cleanSupabaseUrl}/storage/v1/object/public/${bucketName}/${destinationKey}`;
      console.log(`Uploaded ${destinationKey} -> ${publicUrl}`);
      return publicUrl;
    };

    // ── 3. UPLOAD AND SEED COMPANIES ──
    console.log("Seeding companies...");
    const companiesData = JSON.parse(fs.readFileSync("public/data/companies.json", "utf-8"));
    for (const comp of companiesData) {
      const localLogoPath = path.join("public", comp.logo);
      const filename = path.basename(comp.logo);
      
      console.log(`Uploading company logo: ${comp.name}...`);
      const publicLogoUrl = await uploadFile(localLogoPath, "companies", filename);

      await pgClient.query(
        "INSERT INTO companies (name, logo) VALUES ($1, $2);",
        [comp.name, publicLogoUrl]
      );
    }

    // ── 4. UPLOAD AND SEED PROJECTS ──
    console.log("Seeding projects...");
    const projectsData = JSON.parse(fs.readFileSync("public/data/projects.json", "utf-8"));
    for (const proj of projectsData) {
      const localImagePath = path.join("public", proj.image);
      const filename = path.basename(proj.image);

      console.log(`Uploading project image: ${proj.title_en}...`);
      const publicImageUrl = await uploadFile(localImagePath, "projects", filename);

      await pgClient.query(
        `INSERT INTO projects (id, title_en, title_id, description_en, description_id, image, tags, live_url, github_url, year)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
        [
          proj.id,
          proj.title_en,
          proj.title_id,
          proj.description_en,
          proj.description_id,
          publicImageUrl,
          proj.tags || [],
          proj.live_url || "",
          proj.github_url || "",
          proj.year,
        ]
      );
    }

    // ── 5. UPLOAD AND SEED CERTIFICATES ──
    console.log("Seeding certificates...");
    const certificatesData = JSON.parse(fs.readFileSync("public/data/certificates.json", "utf-8"));
    for (const cert of certificatesData) {
      // 1. Upload thumbnail
      const localThumbPath = path.join("public", cert.thumb);
      const thumbDestinationKey = cert.thumb.replace(/^\/?data\/certificates\//, "");
      
      console.log(`Uploading certificate thumb: ${cert.title}...`);
      const publicThumbUrl = await uploadFile(localThumbPath, "certificates", thumbDestinationKey);

      // 2. Upload pages
      const publicPageUrls: string[] = [];
      for (const pagePath of cert.pages || []) {
        const localPagePath = path.join("public", pagePath);
        const pageDestinationKey = pagePath.replace(/^\/?data\/certificates\//, "");
        
        console.log(`Uploading certificate page: ${pagePath}...`);
        const publicPageUrl = await uploadFile(localPagePath, "certificates", pageDestinationKey);
        publicPageUrls.push(publicPageUrl);
      }

      await pgClient.query(
        `INSERT INTO certificates (id, org, title, description, pages, thumb, is_pinned)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          cert.id,
          cert.org,
          cert.title,
          cert.description || "",
          publicPageUrls,
          publicThumbUrl,
          cert.isPinned || false,
        ]
      );
    }

    console.log("Database and Storage seeding completed successfully!");
  } catch (err: any) {
    console.error("Error executing reset and seed script:", err.message || err);
    process.exit(1);
  } finally {
    await pgClient.end();
  }
}

main();
