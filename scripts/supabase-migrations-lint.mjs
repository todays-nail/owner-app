import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const TRANSITION_TIMESTAMP = 20260218000000n;
const NEW_PATTERN = /^(\d{14})_(ios|web)_[a-z0-9_]+\.sql$/;
const LEGACY_PATTERN = /^(\d{14})_[a-z0-9_]+\.sql$/;

function collectSqlFiles(dir) {
  const entries = readdirSync(dir).sort();
  return entries.filter((name) => {
    const fullPath = path.join(dir, name);
    return statSync(fullPath).isFile() && name.endsWith(".sql");
  });
}

function validateFileName(fileName) {
  const newMatch = fileName.match(NEW_PATTERN);
  if (newMatch) {
    return { ok: true, timestamp: BigInt(newMatch[1]), mode: "new" };
  }

  const legacyMatch = fileName.match(LEGACY_PATTERN);
  if (!legacyMatch) {
    return {
      ok: false,
      reason:
        "파일명은 YYYYMMDDHHMMSS_<team>_<description>.sql 또는 레거시 YYYYMMDDHHMMSS_<description>.sql 형식이어야 합니다.",
    };
  }

  const ts = BigInt(legacyMatch[1]);
  if (ts >= TRANSITION_TIMESTAMP) {
    return {
      ok: false,
      reason:
        "전환 시점(20260218000000) 이후 파일은 팀 접두사(ios|web)가 필요합니다.",
    };
  }

  return { ok: true, timestamp: ts, mode: "legacy" };
}

function main() {
  const targetDir = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.resolve(process.cwd(), "supabase/migrations");

  const files = collectSqlFiles(targetDir);
  if (files.length === 0) {
    console.log(`[migration-lint] SQL 파일이 없습니다: ${targetDir}`);
    return;
  }

  const errors = [];
  const tsToFiles = new Map();

  for (const fileName of files) {
    const result = validateFileName(fileName);
    if (!result.ok) {
      errors.push(`${fileName}: ${result.reason}`);
      continue;
    }

    const key = result.timestamp.toString();
    const list = tsToFiles.get(key) ?? [];
    list.push(fileName);
    tsToFiles.set(key, list);
  }

  for (const [timestamp, names] of tsToFiles.entries()) {
    if (names.length > 1) {
      errors.push(
        `중복 타임스탬프(${timestamp})가 있습니다: ${names.join(", ")}`
      );
    }
  }

  if (errors.length > 0) {
    console.error(`[migration-lint] 실패 (${errors.length}건)`);
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log(`[migration-lint] 통과: ${files.length}개 파일`);
}

main();
