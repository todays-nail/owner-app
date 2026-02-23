import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

const CHECK_ONLY = process.argv.includes("--check");
const SHARED_SCHEMA_REPO_URL =
  process.env.SHARED_SCHEMA_REPO_URL ??
  "https://github.com/todays-nail/shared-schema.git";
const SHARED_SCHEMA_REF =
  process.env.SHARED_SCHEMA_REF ??
  "1c1a08472bd9f0ef0f77e730ec7557bd0ac4a829";

function printSourceHelp(errorMessage) {
  console.error("[db-sync] shared-schema source fetch failed.");
  if (errorMessage) {
    console.error(`[db-sync] reason: ${errorMessage}`);
  }
  console.error("[db-sync] next checks:");
  console.error(`  - SHARED_SCHEMA_REPO_URL 접근이 가능한지 확인하세요: ${SHARED_SCHEMA_REPO_URL}`);
  console.error(`  - SHARED_SCHEMA_REF가 유효한 tag/sha인지 확인하세요: ${SHARED_SCHEMA_REF}`);
  console.error("  - GitHub Actions egress/network 제한 여부를 확인하세요.");
  console.error("[db-sync] 위 항목을 해결한 뒤 다시 실행하세요.");
}

function runGit(cwd, args, label) {
  const result = spawnSync("git", args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf-8",
  });
  if (result.error) {
    throw result.error;
  }
  if ((result.status ?? 1) !== 0) {
    const stderr = (result.stderr ?? "").trim();
    throw new Error(`${label} failed: ${stderr || "unknown error"}`);
  }
  return (result.stdout ?? "").trim();
}

function fetchSharedSchemaMigrations() {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "owner-shared-schema-"));
  const checkoutDir = path.join(tempDir, "repo");
  mkdirSync(checkoutDir, { recursive: true });
  try {
    runGit(checkoutDir, ["init", "-q"], "git init");
    runGit(
      checkoutDir,
      ["remote", "add", "origin", SHARED_SCHEMA_REPO_URL],
      "git remote add"
    );
    runGit(
      checkoutDir,
      ["fetch", "--depth", "1", "origin", SHARED_SCHEMA_REF],
      "git fetch"
    );
    runGit(
      checkoutDir,
      ["checkout", "--detach", "-q", "FETCH_HEAD"],
      "git checkout"
    );
    return {
      srcDir: path.join(checkoutDir, "migrations"),
      tempDir,
    };
  } catch (error) {
    rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }
}

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
  const dstDir = path.resolve(repoRoot, "supabase/migrations");
  let srcDir;
  let tempDir;

  mkdirSync(dstDir, { recursive: true });

  try {
    const fetched = fetchSharedSchemaMigrations();
    srcDir = fetched.srcDir;
    tempDir = fetched.tempDir;
  } catch (error) {
    printSourceHelp(error?.message);
    process.exit(1);
  }

  try {
    const srcFiles = listSql(srcDir);
    const dstFiles = listSql(dstDir);
    const srcMap = buildMap(srcDir, srcFiles);
    const dstMap = buildMap(dstDir, dstFiles);

    const missing = srcFiles.filter((f) => !dstMap.has(f));
    const extra = dstFiles.filter((f) => !srcMap.has(f));
    const changed = srcFiles.filter((f) => dstMap.has(f) && srcMap.get(f) !== dstMap.get(f));

    if (CHECK_ONLY) {
      if (missing.length === 0 && extra.length === 0 && changed.length === 0) {
        console.log(
          `[db-sync] check passed: supabase/migrations is in sync with shared-schema/migrations (${SHARED_SCHEMA_REF})`
        );
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
      `[db-sync] synced ${srcFiles.length} files from shared-schema/migrations (${SHARED_SCHEMA_REF}) to supabase/migrations`
    );
  } finally {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

main();
