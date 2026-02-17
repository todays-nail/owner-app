import { spawnSync } from "node:child_process";

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

function runWithFallback(label, linkedArgs, dbUrlArgs, dbUrl) {
  const linkedStatus = run("supabase", linkedArgs);
  if (linkedStatus === 0) return;

  if (!dbUrl) {
    throw new Error(
      `${label} failed on --linked and SUPABASE_DB_URL_WEB_DEV is not set for fallback.`
    );
  }

  console.warn(`[db-check] ${label}: --linked 실패, --db-url fallback 실행`);
  const fallbackStatus = run("supabase", dbUrlArgs);
  if (fallbackStatus !== 0) {
    throw new Error(`${label} failed on both --linked and --db-url fallback.`);
  }
}

function main() {
  const dbUrl = process.env.SUPABASE_DB_URL_WEB_DEV;

  runOrThrow("migration lint", "node", ["scripts/supabase-migrations-lint.mjs"]);
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

  runWithFallback(
    "supabase db diff",
    ["db", "diff", "--linked"],
    ["db", "diff", "--db-url", dbUrl ?? ""],
    dbUrl
  );

  console.log("[db-check] completed");
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
