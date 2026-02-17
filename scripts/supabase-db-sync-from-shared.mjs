import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";

const CHECK_ONLY = process.argv.includes("--check");

function listSql(dir) {
  return readdirSync(dir)
    .sort()
    .filter((name) => {
      const fullPath = path.join(dir, name);
      return statSync(fullPath).isFile() && name.endsWith(".sql");
    });
}

function digest(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function buildMap(dir, files) {
  const map = new Map();
  for (const file of files) {
    map.set(file, digest(path.join(dir, file)));
  }
  return map;
}

function main() {
  const repoRoot = process.cwd();
  const srcDir = path.resolve(repoRoot, "shared-schema/migrations");
  const dstDir = path.resolve(repoRoot, "supabase/migrations");

  mkdirSync(dstDir, { recursive: true });

  let srcFiles;
  try {
    srcFiles = listSql(srcDir);
  } catch {
    console.error(`[db-sync] source directory not found: ${srcDir}`);
    console.error("[db-sync] shared-schema submodule을 먼저 초기화하세요.");
    process.exit(1);
  }

  const dstFiles = listSql(dstDir);
  const srcMap = buildMap(srcDir, srcFiles);
  const dstMap = buildMap(dstDir, dstFiles);

  const missing = srcFiles.filter((f) => !dstMap.has(f));
  const extra = dstFiles.filter((f) => !srcMap.has(f));
  const changed = srcFiles.filter((f) => dstMap.has(f) && srcMap.get(f) !== dstMap.get(f));

  if (CHECK_ONLY) {
    if (missing.length === 0 && extra.length === 0 && changed.length === 0) {
      console.log("[db-sync] check passed: supabase/migrations is in sync with shared-schema/migrations");
      return;
    }

    console.error("[db-sync] check failed: migration directories differ");
    if (missing.length) console.error(`- missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`- extra: ${extra.join(", ")}`);
    if (changed.length) console.error(`- changed: ${changed.join(", ")}`);
    process.exit(1);
  }

  for (const file of extra) {
    rmSync(path.join(dstDir, file), { force: true });
  }

  for (const file of srcFiles) {
    copyFileSync(path.join(srcDir, file), path.join(dstDir, file));
  }

  console.log(
    `[db-sync] synced ${srcFiles.length} files from shared-schema/migrations to supabase/migrations`
  );
}

main();
