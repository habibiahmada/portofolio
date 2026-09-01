/**
 * Sync certificate metadata: local paths → Supabase Storage URLs in certificates.json.
 * Uploads any missing files from public/data/certificates/ when present, then upserts DB.
 *
 * Usage: bun run seed:certificates
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";
import { certificateStorageUrl } from "../lib/data/storage-urls";

const BUCKET = "certificates";

type JsonCert = {
  id: string;
  org: string;
  title: string;
  description: string;
  pages: string[];
  thumb: string;
  isPinned?: boolean;
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

function isStorageUrl(url: string): boolean {
  return url.includes(".supabase.co/storage/v1/object/public/certificates/");
}

function localPathFromDataUrl(url: string): string | null {
  if (!url.startsWith("/data/certificates/")) return null;
  return resolve(process.cwd(), "public", url.replace(/^\//, ""));
}

function storageKeyFromDataUrl(url: string): string | null {
  if (!url.startsWith("/data/certificates/")) return null;
  return url.replace(/^\/data\/certificates\//, "");
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const jsonPath = resolve(process.cwd(), "public/data/certificates.json");
  const certs = JSON.parse(readFileSync(jsonPath, "utf8")) as JsonCert[];

  const supabase = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const uploadKeys = new Set<string>();

  for (const cert of certs) {
    for (const page of cert.pages) {
      const sk = storageKeyFromDataUrl(page);
      if (sk) uploadKeys.add(sk);
    }
    const thumbKey = storageKeyFromDataUrl(cert.thumb);
    if (thumbKey) uploadKeys.add(thumbKey);
  }

  let uploaded = 0;
  let skipped = 0;

  for (const storageKey of uploadKeys) {
    const localFile = resolve(process.cwd(), "public/data/certificates", storageKey);
    if (!existsSync(localFile)) {
      skipped++;
      continue;
    }

    const buffer = readFileSync(localFile);
    const { error } = await supabase.storage.from(BUCKET).upload(storageKey, buffer, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
      upsert: true,
    });
    if (error) {
      console.error(`  failed ${storageKey}:`, error.message);
      process.exit(1);
    }
    uploaded++;
  }

  if (uploaded > 0) {
    console.log(`Uploaded ${uploaded} certificate file(s) to Storage (${skipped} already only in Storage).`);
  }

  for (const cert of certs) {
    cert.pages = cert.pages.map((p) =>
      isStorageUrl(p) ? p : certificateStorageUrl(p.replace(/^\/data\/certificates\//, "")),
    );
    cert.thumb = isStorageUrl(cert.thumb)
      ? cert.thumb
      : certificateStorageUrl(cert.thumb.replace(/^\/data\/certificates\//, ""));
  }

  writeFileSync(jsonPath, `${JSON.stringify(certs, null, 2)}\n`, "utf8");
  console.log(`Updated ${jsonPath} with Storage URLs.`);

  const rows = certs.map((c) => ({
    id: c.id,
    org: c.org,
    title: c.title,
    description: c.description,
    pages: c.pages,
    thumb: c.thumb,
    is_pinned: c.isPinned ?? false,
  }));

  const { error: dbError } = await (supabase as any)
    .from("certificates")
    .upsert(rows, { onConflict: "id" });

  if (dbError) {
    console.error("DB upsert failed:", dbError.message);
    process.exit(1);
  }

  console.log(`Done. ${rows.length} certificate rows synced to Supabase.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
