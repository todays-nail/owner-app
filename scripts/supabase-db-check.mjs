import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const LOCK_DIR = path.join("/tmp", "todays-nail-shared-db-check.lock");
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (res.error) throw res.error;
  return res.status ?? 1;
}

function runOrThrow(label, cmd, args, opts = {}) {
  const status = run(cmd, args, opts);
  if (status !== 0) {
    throw new Error(`${label} failed (exit ${status})`);
  }
}

function hasDocker() {
  const check = spawnSync("docker", ["info"], { stdio: "ignore" });
  if (check.error) return false;
  return (check.status ?? 1) === 0;
}

function runWithFallback(label, linkedArgs, dbUrlArgs, dbUrl) {
  const linkedStatus = run("supabase", linkedArgs);
  if (linkedStatus === 0) return;

  if (!dbUrl) {
    throw new Error(
      `${label} failed on --linked and SUPABASE_DB_URL_SHARED_STAGING is not set for fallback.`
    );
  }

  console.warn(`[db-check] ${label}: --linked 실패, --db-url fallback 실행`);
  const fallbackStatus = run("supabase", dbUrlArgs);
  if (fallbackStatus !== 0) {
    throw new Error(`${label} failed on both --linked and --db-url fallback.`);
  }
}

function acquireLock() {
  try {
    mkdirSync(LOCK_DIR);
    writeFileSync(path.join(LOCK_DIR, "pid"), `${process.pid}`);
    return;
  } catch {
    // Continue to stale lock handling.
  }

  const pidFile = path.join(LOCK_DIR, "pid");
  let stale = true;
  try {
    const pid = Number.parseInt(readFileSync(pidFile, "utf-8"), 10);
    if (!Number.isNaN(pid) && pid > 0) {
      try {
        process.kill(pid, 0);
        stale = false;
      } catch {
        stale = true;
      }
    }
  } catch {
    stale = true;
  }

  if (!stale) {
    throw new Error(
      "[db-check] another db-check is already running. run checks sequentially per repository."
    );
  }

  rmSync(LOCK_DIR, { recursive: true, force: true });
  mkdirSync(LOCK_DIR);
  writeFileSync(path.join(LOCK_DIR, "pid"), `${process.pid}`);
}

function main() {
  const dbUrl =
    process.env.SUPABASE_DB_URL_SHARED_STAGING ?? process.env.SUPABASE_DB_URL_WEB_DEV;

  acquireLock();
  process.on("exit", () => rmSync(LOCK_DIR, { recursive: true, force: true }));

  runOrThrow("migration lint", "node", ["scripts/supabase-migrations-lint.mjs"]);
  runOrThrow("shared-schema branch check", "node", [
    "scripts/supabase-shared-schema-branch-check.mjs",
  ]);
  runOrThrow("shared-schema sync check", "node", [
    "scripts/supabase-db-sync-from-shared.mjs",
    "--check",
  ]);

  runWithFallback(
    "supabase migration list",
    ["migration", "list"],
    ["migration", "list", "--db-url", dbUrl ?? ""],
    dbUrl
  );

  runWithFallback(
    "supabase db push --dry-run",
    ["db", "push", "--dry-run"],
    ["db", "push", "--dry-run", "--db-url", dbUrl ?? ""],
    dbUrl
  );

  if (hasDocker()) {
    runWithFallback(
      "supabase db diff",
      ["db", "diff", "--linked"],
      ["db", "diff", "--db-url", dbUrl ?? ""],
      dbUrl
    );
  } else {
    console.warn("[db-check] docker unavailable: skip supabase db diff");
  }

  console.log("[db-check] completed");
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
