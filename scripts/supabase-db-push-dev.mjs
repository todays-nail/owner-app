import { spawnSync } from "node:child_process";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function assertNotShared(url) {
  const sharedStaging = process.env.SUPABASE_DB_URL_SHARED_STAGING;
  const sharedProd = process.env.SUPABASE_DB_URL_SHARED_PROD;

  if (sharedStaging && url === sharedStaging) {
    throw new Error("SUPABASE_DB_URL_WEB_DEV must not point to shared staging DB.");
  }

  if (sharedProd && url === sharedProd) {
    throw new Error("SUPABASE_DB_URL_WEB_DEV must not point to shared prod DB.");
  }

  if (url.includes("twahqxjhyocyqrmtjbdf")) {
    throw new Error(
      "SUPABASE_DB_URL_WEB_DEV points to shared-staging project(ref: twahqxjhyocyqrmtjbdf). Shared DB direct push is forbidden."
    );
  }
}

function main() {
  const dbUrl = requireEnv("SUPABASE_DB_URL_WEB_DEV");
  assertNotShared(dbUrl);

  const lint = spawnSync("node", ["scripts/supabase-migrations-lint.mjs"], {
    stdio: "inherit",
  });
  if (lint.error) throw lint.error;
  if ((lint.status ?? 1) !== 0) {
    throw new Error("migration lint failed.");
  }

  const result = spawnSync(
    "supabase",
    ["db", "push", "--db-url", dbUrl, "--yes"],
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
