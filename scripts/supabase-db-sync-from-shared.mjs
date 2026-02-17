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

function printSubmoduleHelp(errorMessage) {
  console.error("[db-sync] shared-schema submodule unavailable.");
  if (errorMessage) {
    console.error(`[db-sync] reason: ${errorMessage}`);
  }
  console.error("[db-sync] next checks:");
  console.error("  - SUBMODULE_PAT 시크릿이 있으면, 해당 토큰으로 submodule URL 접근 권한(읽기)이 있는지 확인하세요.");
  console.error("  - actions checkout에서 token 입력값이 유효하고, .github/workflows/ci.yml의 checkout step이 적용되었는지 확인하세요.");
  console.error("  - .gitmodules의 shared-schema URL이 HTTPS인지(현재 https://github.com/todays-nail/shared-schema.git) 확인하세요.");
  console.error("  - 로컬에서 `git submodule update --init --recursive` 실행 후 `git submodule status`가 정상인지 확인하세요.");
  console.error("[db-sync] 위 항목을 해결한 뒤 다시 실행하세요.");
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
  const srcDir = path.resolve(repoRoot, "shared-schema/migrations");
  const dstDir = path.resolve(repoRoot, "supabase/migrations");

  mkdirSync(dstDir, { recursive: true });

  let srcFiles;
  try {
    srcFiles = listSql(srcDir);
  } catch (error) {
    console.error(`[db-sync] source directory not found: ${srcDir}`);
    printSubmoduleHelp(error?.message);
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
