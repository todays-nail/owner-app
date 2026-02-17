import { spawnSync } from "node:child_process";

const res = spawnSync("node", ["scripts/supabase-db-push-dev.mjs"], {
  stdio: "inherit",
});

if (res.error) {
  console.error(res.error.message ?? res.error);
  process.exit(1);
}

process.exit(res.status ?? 1);
