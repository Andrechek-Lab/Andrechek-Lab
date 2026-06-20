/**
 * Downscale oversized source images in place so the repository stays small.
 * Astro re-optimizes images at build time regardless; this just keeps the
 * *source* files (which everyone clones) from being needlessly huge.
 *
 * Run with:  pnpm run optimize:images
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOTS = ['src/content', 'src/assets'];
const MAX_WIDTH = 1600;
const EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let changed = 0;
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    if (!EXTS.has(extname(file).toLowerCase())) continue;
    const meta = await sharp(file).metadata();
    if (!meta.width || meta.width <= MAX_WIDTH) continue;
    const isPng = extname(file).toLowerCase() === '.png';
    const pipeline = sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true });
    const buf = await (isPng
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: 82, mozjpeg: true })
    ).toBuffer();
    await writeFile(file, buf);
    console.log(`resized ${file} (${meta.width}px → ${MAX_WIDTH}px)`);
    changed++;
  }
}
console.log(changed ? `\nOptimized ${changed} image(s).` : 'All images already within size limits.');
