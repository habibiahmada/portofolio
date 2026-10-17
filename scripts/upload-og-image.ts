/**
 * Convert one project image to a 1200x630 WebP and upload it to Supabase
 * Storage at projects/webekspres/<slug>.webp (overwrites).
 *
 * Usage (from portofolio/):
 *   bun --env-file=.env.local run scripts/upload-og-image.ts <image-file> <slug>
 *
 * Then point the project's `image` in public/data/projects.json at the printed
 * URL and run `bun run seed:projects`.
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const [file, slug] = process.argv.slice(2);
  if (!file || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    console.error("Usage: upload-og-image.ts <image-file> <slug>   (slug: a-z, 0-9, -)");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const webp = await sharp(readFileSync(file))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toBuffer();

  const storageKey = `webekspres/${slug}.webp`;
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabase.storage.from("projects").upload(storageKey, webp, {
    contentType: "image/webp",
    cacheControl: "public, max-age=31536000, immutable",
    upsert: true,
  });
  if (error) {
    console.error(`Upload failed for ${storageKey}:`, error.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from("projects").getPublicUrl(storageKey);
  console.log(`Uploaded ${storageKey} (${Math.round(webp.length / 1024)} KB)`);
  console.log(data.publicUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
