import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const TARGET_REF = process.env.SHARED_SCHEMA_CANONICAL_REF ?? "origin/main";

function runGit(sharedDir, args) {
  const result = spawnSync("git", ["-C", sharedDir, ...args], {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf-8",
  });
  if (result.error) throw result.error;
  return result;
}

function runOrThrow(sharedDir, args, label) {
  const result = runGit(sharedDir, args);
  if ((result.status ?? 1) !== 0) {
    const stderr = (result.stderr ?? "").trim();
    throw new Error(`[shared-branch-check] ${label} failed: ${stderr || "unknown error"}`);
  }
  return (result.stdout ?? "").trim();
}

function main() {
  const repoRoot = process.cwd();
  const sharedDir = path.resolve(repoRoot, "shared-schema");

  if (!existsSync(sharedDir)) {
    throw new Error("[shared-branch-check] missing shared-schema submodule. run: git submodule update --init --recursive");
  }

  const remoteBranch = TARGET_REF.startsWith("origin/") ? TARGET_REF.slice("origin/".length) : TARGET_REF;
  runOrThrow(sharedDir, ["fetch", "origin", remoteBranch, "--quiet"], `git fetch origin ${remoteBranch}`);
  runOrThrow(sharedDir, ["rev-parse", "--verify", TARGET_REF], `resolve ${TARGET_REF}`);

  const head = runOrThrow(sharedDir, ["rev-parse", "HEAD"], "resolve HEAD");
  const currentBranch = runGit(sharedDir, ["symbolic-ref", "--short", "-q", "HEAD"]);
  const branchText =
    (currentBranch.status ?? 1) === 0 ? (currentBranch.stdout ?? "").trim() : "detached-head";

  const ancestry = runGit(sharedDir, ["merge-base", "--is-ancestor", "HEAD", TARGET_REF]);
  if ((ancestry.status ?? 1) !== 0) {
    throw new Error(
      `[shared-branch-check] shared-schema HEAD ${head} is not based on ${TARGET_REF}. checkout merged commit from ${TARGET_REF} first.`
    );
  }

  console.log(
    `[shared-branch-check] passed: shared-schema HEAD ${head} (branch: ${branchText}) is on ${TARGET_REF}`
  );
}

try {
  main();
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
