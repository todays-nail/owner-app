import { spawnSync } from "node:child_process";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function resolveTargetDbUrl() {
  const sharedStaging = process.env.SUPABASE_DB_URL_SHARED_STAGING;
  const legacyWebDev = process.env.SUPABASE_DB_URL_WEB_DEV;
  return sharedStaging || legacyWebDev || requireEnv("SUPABASE_DB_URL_SHARED_STAGING");
}

function main() {
  const dbUrl = resolveTargetDbUrl();
  const sharedProd = process.env.SUPABASE_DB_URL_SHARED_PROD;
  if (sharedProd && dbUrl === sharedProd) {
    throw new Error("Push target must not be shared-prod DB.");
  }

  const lint = spawnSync("node", ["scripts/supabase-migrations-lint.mjs"], {
    stdio: "inherit",
  });
  if (lint.error) throw lint.error;
  if ((lint.status ?? 1) !== 0) {
    throw new Error("migration lint failed.");
  }

  const result = spawnSync(
    "supabase",
    ["db", "push", "--db-url", dbUrl],
    { stdio: "inherit" }
  );

  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
