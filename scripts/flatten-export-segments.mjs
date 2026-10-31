/**
 * Renames the static export's prefetch files to the names the router asks for.
 *
 * Written because a build made on Windows 404s every client-side prefetch.
 * Next names each segment file by turning the segment path's slashes into
 * dots — `/about/__PAGE__` becomes `__next.about.__PAGE__.txt` — but it reads
 * those paths off the disk, and on Windows they come back with backslashes,
 * which the slash-to-dot step leaves alone. The export ends up with
 * `about/__next.about/__PAGE__.txt`, a folder, while the browser requests
 * `about/__next.about.__PAGE__.txt`. Every link on the page prefetches one of
 * these, so every page logged a string of 404s, and site crawlers (Ahrefs)
 * reported them as broken internal pages.
 *
 * This moves each file inside a `__next.*` folder up to its flattened name and
 * removes the emptied folder. A build made on macOS or Linux already has the
 * flat names, so there is nothing to move and this does nothing.
 *
 * npm runs this automatically as the "postbuild" script. It only touches
 * `out/`, which exists only for the static export (STATIC_EXPORT=true).
 */

import { existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

/** Every file under `dir`, at any depth. */
function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

/** Every `__next.*` folder under `dir`, without descending into them. */
function segmentFolders(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const path = join(dir, entry.name);
    if (entry.name === "_next") return [];
    return entry.name.startsWith("__next.") ? [path] : segmentFolders(path);
  });
}

if (!existsSync(outDir)) {
  process.exit(0);
}

let moved = 0;
for (const folder of segmentFolders(outDir)) {
  for (const file of filesIn(folder)) {
    // `__next.about` + `__PAGE__.txt` -> `__next.about.__PAGE__.txt`, and
    // deeper paths the same way: `$d$slug/__PAGE__.txt` -> `$d$slug.__PAGE__.txt`.
    const flatName = `${folder}.${relative(folder, file).split(sep).join(".")}`;
    renameSync(file, flatName);
    moved++;
  }
  rmSync(folder, { recursive: true });
}

if (moved > 0) {
  console.log(`Flattened ${moved} prefetch file${moved === 1 ? "" : "s"} in out/`);
}
