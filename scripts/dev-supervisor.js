import { spawn, exec } from "node:child_process";
import fs from "node:fs";

const BRANCH = process.env.PREVIEW_BRANCH || "main";
const REPO_URL = process.env.REPO_URL;
const PORT = process.env.PORT || "3000";
const nextDevRaw = process.env.NEXT_DEV;

function parseBoolean(value, defaultValue) {
  if (value === undefined) return defaultValue;
  return !["false", "0", "no", "off"].includes(String(value).toLowerCase());
}

const NEXT_DEV = parseBoolean(nextDevRaw, true);

function run(name, cmd, args, envOverrides = {}) {
  const p = spawn(cmd, args, {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, ...envOverrides },
  });

  p.on("exit", (code) => {
    console.error(`[supervisor] ${name} exited with code ${code}`);
    process.exit(code ?? 1);
  });

  return p;
}

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stderr || err.message));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function bootstrapGit() {
  if (fs.existsSync(".git")) return;

  if (!REPO_URL) {
    console.warn("[supervisor] no .git and no REPO_URL; skipping git bootstrap");
    return;
  }

  console.log("[supervisor] bootstrapping git repo");
  const cmds = [
    "git init",
    `git remote add origin ${REPO_URL}`,
    "git fetch origin --depth=1",
    `git reset --hard origin/${BRANCH}`,
    "git clean -fd",
  ];

  for (const cmd of cmds) {
    await execAsync(cmd);
  }
  console.log("[supervisor] git bootstrap complete");
}

async function warmup() {
  const url = `http://localhost:${PORT}/api/health`;
  for (let i = 0; i < 90; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(`[supervisor] warmup complete (${((i + 1) * 500 / 1000).toFixed(1)}s)`);
        return;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.warn("[supervisor] warmup timed out after 45s");
}

// --- Start Next.js immediately ---

if (NEXT_DEV) {
  console.log("[supervisor] starting Next.js dev server (turbo)");
  run("next-dev", "./node_modules/.bin/next", ["dev", "--turbo", "-p", PORT], {
    NODE_ENV: "development",
  });
} else {
  console.log("[supervisor] starting Next.js production server");
  run("next-start", "./node_modules/.bin/next", ["start", "-p", PORT]);
}

// --- Async tasks: warmup, git bootstrap, deferred git-poll ---

warmup().catch((err) => console.error("[supervisor] warmup error:", err));

bootstrapGit().catch((err) =>
  console.error("[supervisor] git bootstrap failed:", err)
);

setTimeout(() => {
  console.log("[supervisor] starting git poller");
  run("git-poll", "node", ["scripts/git-poll.js"]);
}, 30_000);
