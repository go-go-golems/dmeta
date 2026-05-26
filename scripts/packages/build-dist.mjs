#!/usr/bin/env node
/**
 * build-dist.mjs — Compile the package TypeScript source to JS in dist/.
 *
 * Usage (from a package directory):
 *   node ../../scripts/packages/build-dist.mjs
 *
 * What it does:
 *  1. Runs `tsc --build` (uses the package's tsconfig.json).
 *  2. Copies *.css files from src/ → dist/ preserving directory structure.
 */

import { execSync } from "node:child_process";
import { cpSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const pkgRoot = process.cwd();

// 1. Compile TypeScript
console.log(`[build-dist] Compiling TypeScript in ${pkgRoot} …`);
execSync("tsc --build", { stdio: "inherit", cwd: pkgRoot });

// 2. Copy CSS files (Tailwind tokens, etc.)
const srcDir = resolve(pkgRoot, "src");
const distDir = resolve(pkgRoot, "dist");

if (existsSync(srcDir) && existsSync(distDir)) {
  console.log("[build-dist] Copying CSS files …");
  cpSync(srcDir, distDir, {
    recursive: true,
    filter: (src) => {
      // Always allow directories so the recursive copy can traverse
      try {
        if (statSync(src).isDirectory()) return true;
      } catch {
        return false;
      }
      // Only copy .css files
      return src.endsWith(".css");
    },
  });
}

console.log("[build-dist] Done.");
