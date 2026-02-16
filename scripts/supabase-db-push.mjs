import { spawnSync } from "node:child_process";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function main() {
  const password = requireEnv("SUPABASE_DB_PASSWORD");

  const res = spawnSync(
    "supabase",
    ["db", "push", "--password", password, "--yes"],
    { stdio: "inherit" }
  );

  if (res.error) throw res.error;
  process.exit(res.status ?? 1);
}

try {
  main();
} catch (e) {
  console.error(e?.message || e);
  process.exit(1);
}

