/**
 * Upsert all projects from public/data/projects.json (+ project-meta overrides) into Supabase.
 *
 * Usage (from portofolio/):
 *   bun run scripts/seed-projects.ts
 *   node --import tsx scripts/seed-projects.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Database, ProjectRow } from "../lib/supabase/types";
import { PROJECT_META_SEED } from "../lib/data/project-meta-seed";
import { getProjectTaxonomy } from "../lib/data/project-taxonomy";

const WEBEKSPRES_ROLE = "Web Developer (Webekspres team)";

type JsonProject = Omit<ProjectRow, "created_at" | "updated_at" | "role" | "outcome">;

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
    /* .env.local optional when vars already exported */
  }
}

function mergeRow(row: JsonProject): Omit<ProjectRow, "created_at" | "updated_at"> {
  const meta = PROJECT_META_SEED[row.id];
  const tax = getProjectTaxonomy(row.id);
  const role =
    meta?.role ??
    (tax?.origin === "webekspres" ? WEBEKSPRES_ROLE : "");

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
    role,
    outcome: meta?.outcome ?? "",
  };
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const jsonPath = resolve(process.cwd(), "public/data/projects.json");
  const projects = JSON.parse(readFileSync(jsonPath, "utf8")) as JsonProject[];
  const rows = projects.map(mergeRow);

  const supabase = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Upserting ${rows.length} projects into Supabase…`);

  const { data, error } = await (supabase as any)
    .from("projects")
    .upsert(rows, { onConflict: "id" })
    .select("id, title_en, year");

  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }

  console.log(`Done. ${data?.length ?? 0} rows synced.`);
  for (const row of data ?? []) {
    console.log(`  · ${row.year} ${row.title_en}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
