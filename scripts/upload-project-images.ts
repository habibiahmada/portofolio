/**
 * Sync project rows to Supabase. Images are served from Storage only.
 *
 * - If `image` in projects.json is already a Supabase URL → DB sync only.
 * - Webekspres re-upload (optional): `--from-og` reads ../og-images/manifest.json
 *   and uploads converted/resized WebP to bucket `projects/webekspres/`.
 *
 * Usage:
 *   bun run seed:project-images           # sync URLs already in JSON → DB
 *   bun run seed:project-images --from-og # re-upload Webekspres from og-images
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";
import { PROJECT_META_SEED } from "../lib/data/project-meta-seed";
import { getProjectTaxonomy } from "../lib/data/project-taxonomy";

const BUCKET = "projects";
const WEBEKSPRES_ROLE = "Web Developer (Webekspres team)";

type JsonProject = {
  id: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  image: string;
  tags: string[];
  live_url: string;
  github_url: string;
  year: number;
};

type OgManifestEntry = {
  slug: string;
  saved?: string;
  status?: string;
};

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

function isSupabaseImage(url: string): boolean {
  return url.includes(".supabase.co/storage/v1/object/public/projects/");
}

function storageKeyFromUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/projects/";
  const i = url.indexOf(marker);
  if (i < 0) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

function mergeRow(row: JsonProject) {
  const meta = PROJECT_META_SEED[row.id];
  const tax = getProjectTaxonomy(row.id);
  return {
    id: row.id,
    title_en: row.title_en,
    title_id: row.title_id,
    description_en: meta?.description_en ?? row.description_en,
    description_id: meta?.description_id ?? row.description_id,
    image: row.image,
    tags: row.tags ?? [],
    live_url: row.live_url ?? "",
    github_url: row.github_url ?? "",
    year: row.year,
    role: meta?.role ?? (tax?.origin === "webekspres" ? WEBEKSPRES_ROLE : ""),
    outcome: meta?.outcome ?? "",
  };
}

function contentTypeForPath(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === ".webp") return "image/webp";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function main() {
  loadEnvLocal();
  const fromOg = process.argv.includes("--from-og");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const jsonPath = resolve(process.cwd(), "public/data/projects.json");
  const projects = JSON.parse(readFileSync(jsonPath, "utf8")) as JsonProject[];

  const supabase = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let uploaded = 0;

  if (fromOg) {
    const manifestPath = resolve(process.cwd(), "../og-images/manifest.json");
    if (!existsSync(manifestPath)) {
      console.error(`og-images manifest not found: ${manifestPath}`);
      process.exit(1);
    }
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as OgManifestEntry[];
    const bySlug = Object.fromEntries(manifest.map((e) => [e.slug, e]));

    for (const p of projects) {
      const tax = getProjectTaxonomy(p.id);
      if (tax?.origin !== "webekspres" || !tax.slug) continue;

      const entry = bySlug[tax.slug];
      if (!entry?.saved || !existsSync(entry.saved)) {
        console.warn(`  skip ${tax.slug}: no og-images source`);
        continue;
      }

      const storageKey = `webekspres/${tax.slug}.webp`;
      const buffer = readFileSync(entry.saved);
      const contentType = contentTypeForPath(entry.saved);

      const { error } = await supabase.storage.from(BUCKET).upload(storageKey, buffer, {
        contentType,
        cacheControl: "public, max-age=31536000, immutable",
        upsert: true,
      });
      if (error) {
        console.error(`  failed ${storageKey}:`, error.message);
        process.exit(1);
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(storageKey);
      p.image = data.publicUrl;
      uploaded++;
      console.log(`  ↑ ${storageKey} from ${basename(entry.saved)}`);
    }

    writeFileSync(jsonPath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  } else {
    const needsUpload = projects.filter((p) => p.image && !isSupabaseImage(p.image));
    if (needsUpload.length > 0) {
      console.error(
        `${needsUpload.length} project(s) still use local image paths. Run a one-time upload or pass --from-og for Webekspres.`,
      );
      needsUpload.slice(0, 3).forEach((p) => console.error(`  · ${p.title_en}: ${p.image}`));
      process.exit(1);
    }
    console.log("All project images point to Supabase Storage. Syncing DB rows only.");
  }

  const rows = projects.map(mergeRow);
  const { error: dbError } = await (supabase as any)
    .from("projects")
    .upsert(rows, { onConflict: "id" });

  if (dbError) {
    console.error("DB upsert failed:", dbError.message);
    process.exit(1);
  }

  console.log(`Done. ${uploaded} uploaded, ${rows.length} DB rows synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
