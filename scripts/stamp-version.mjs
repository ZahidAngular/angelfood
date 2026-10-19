/**
 * Stamps the build into public/version.json before every build.
 *
 * Written because "is my change live yet?" has been an expensive question
 * on this project. Fetch /version.json and the answer is in front of you,
 * rather than being inferred from whether a page looks different — which
 * is exactly the thing a cache makes unreliable.
 *
 * npm runs this automatically as the "prebuild" script.
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The commit, when there is one. A build from a tarball has no git. */
function commit() {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
}

const built = new Date();

const version = {
  commit: commit(),
  built: built.toISOString(),
  // The same moment in the timezone the people reading this work in, so
  // nobody has to do UTC arithmetic to answer "did that deploy go out?".
  builtNZ: built.toLocaleString("en-NZ", { timeZone: "Pacific/Auckland" }),
};

mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(
  join(root, "public", "version.json"),
  JSON.stringify(version, null, 2) + "\n"
);

console.log(`  stamped build ${version.commit} (${version.builtNZ})`);
