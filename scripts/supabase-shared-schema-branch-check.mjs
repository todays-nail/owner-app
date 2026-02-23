import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const SHARED_SCHEMA_REPO_URL =
  process.env.SHARED_SCHEMA_REPO_URL ??
  "https://github.com/todays-nail/shared-schema.git";
const SHARED_SCHEMA_REF =
  process.env.SHARED_SCHEMA_REF ??
  "1c1a08472bd9f0ef0f77e730ec7557bd0ac4a829";

function runGit(cwd, args) {
  const result = spawnSync("git", args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf-8",
  });
  if (result.error) throw result.error;
  return result;
}

function runOrThrow(cwd, args, label) {
  const result = runGit(cwd, args);
  if ((result.status ?? 1) !== 0) {
    const stderr = (result.stderr ?? "").trim();
    throw new Error(`[shared-branch-check] ${label} failed: ${stderr || "unknown error"}`);
  }
  return (result.stdout ?? "").trim();
}

function main() {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "owner-shared-schema-check-"));
  const checkoutDir = path.join(tempDir, "repo");

  try {
    mkdirSync(checkoutDir, { recursive: true });
    runOrThrow(checkoutDir, ["init", "-q"], "git init");
    runOrThrow(
      checkoutDir,
      ["remote", "add", "origin", SHARED_SCHEMA_REPO_URL],
      "git remote add"
    );
    runOrThrow(
      checkoutDir,
      ["fetch", "--depth", "1", "origin", SHARED_SCHEMA_REF],
      "git fetch"
    );

    const resolved = runOrThrow(
      checkoutDir,
      ["rev-parse", "FETCH_HEAD"],
      "resolve FETCH_HEAD"
    );

    console.log(
      `[shared-branch-check] passed: shared-schema ref ${SHARED_SCHEMA_REF} resolved to ${resolved}`
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
