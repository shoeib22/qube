/**
 * Optimize product images in Supabase Storage:
 *  - trims empty/uniform padding around the product
 *  - sharpens + upscales (capped, so it doesn't invent fake detail)
 *  - composites the product centered onto a uniform square canvas
 *    (so every product renders at a consistent size/position in its container)
 *  - re-uploads to the same Storage path (same format/extension, no DB changes)
 *
 * Safety:
 *  - Defaults to DRY RUN (reports what it would do, writes nothing).
 *  - Pass --apply to actually overwrite images in Storage.
 *  - Every processed original is backed up locally before being overwritten,
 *    to scripts/.image-backups/<storage-path> (timestamped).
 *
 * Usage:
 *   node scripts/optimize-product-images.js                  # dry run, all products
 *   node scripts/optimize-product-images.js --apply           # actually process + upload
 *   node scripts/optimize-product-images.js --only=red-smart-remote,hd-plug-16a-v2
 *   node scripts/optimize-product-images.js --apply --canvas=1600
 *   node scripts/optimize-product-images.js --apply --concurrency=2
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name, def = undefined) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return def;
  const eq = hit.indexOf('=');
  return eq === -1 ? true : hit.slice(eq + 1);
};

const APPLY = Boolean(flag('apply', false));
const ONLY = flag('only', null);
const ONLY_IDS = ONLY ? String(ONLY).split(',').map((s) => s.trim()).filter(Boolean) : null;
const LIMIT = flag('limit') ? Number(flag('limit')) : null;
const CONCURRENCY = flag('concurrency') ? Number(flag('concurrency')) : 4;
const PADDING_RATIO = flag('padding') ? Number(flag('padding')) : 0.08; // 8% breathing room around the product
// Site-measured display sizes this needs to cover: shop grid renders at ~242px
// CSS, the product detail page at ~465px CSS (verified live on xerovolt.in).
// Native product photos run as low as ~100px, so hitting that floor requires a
// large upscale ceiling — plain resampling can't invent detail, but matching
// (rather than falling short of) the real display size avoids the browser's
// own uncontrolled stretch on top of an already-soft image.
const MAX_UPSCALE = flag('max-upscale') ? Number(flag('max-upscale')) : 6; // allow tiny sources to reach the quality floor
const MIN_QUALITY_PX = flag('min-quality-px') ? Number(flag('min-quality-px')) : 700; // >= largest on-site display size
const MAX_CANVAS = flag('max-canvas') ? Number(flag('max-canvas')) : 1400; // cap oversized source photos so files stay light
const BACKUP_DIR = path.join(__dirname, '.image-backups');

// ---------------------------------------------------------------------------
// Load .env.local (scripts run outside Next, which normally loads this for us)
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;

    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

// ---------------------------------------------------------------------------
// Supabase Admin init (mirrors lib/supabaseAdmin.ts)
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const IMAGE_BUCKET = 'product-images';

// ---------------------------------------------------------------------------
// Image pipeline
// ---------------------------------------------------------------------------

const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function formatFromExt(ext) {
  if (ext === '.jpg' || ext === '.jpeg') return 'jpeg';
  if (ext === '.webp') return 'webp';
  return 'png';
}

/**
 * Trim uniform padding, sharpen, upscale ONLY if the source is small/pixelated
 * (capped, so it doesn't invent fake detail or bloat already-good images),
 * then center the product on a square canvas sized to that image's own
 * content (+ fixed padding %) — so the container always fits its product
 * with consistent breathing room, without forcing every product onto one
 * arbitrary oversized canvas.
 */
async function processImage(inputBuffer, ext) {
  const format = formatFromExt(ext);
  const hasAlpha = format !== 'jpeg';

  // 1. Trim uniform-color / transparent padding around the product.
  const { data: trimmed, info: trimmedInfo } = await sharp(inputBuffer)
    .rotate() // normalize EXIF orientation first
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true });

  const { width, height } = trimmedInfo;
  const nativeMax = Math.max(width, height);

  // 2. Decide the product's target size: only upscale if it's smaller than
  //    MIN_QUALITY_PX (fixes small/pixelated sources); otherwise leave native
  //    resolution alone (capped at MAX_CANVAS so oversized photos don't bloat).
  const desiredMax = Math.min(Math.max(nativeMax, MIN_QUALITY_PX), MAX_CANVAS);
  const scale = Math.min(desiredMax / nativeMax, MAX_UPSCALE);

  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));
  const isUpscaling = scale > 1.001;

  // 3. Resize with a high-quality kernel (only when actually resizing), then
  //    sharpen to counter softness/blur from upscaling or the original
  //    compression. Heavier upscales get a stronger unsharp mask since
  //    interpolation softens the image more the further it stretches.
  let pipeline = sharp(trimmed);
  if (targetWidth !== width || targetHeight !== height) {
    pipeline = pipeline.resize(targetWidth, targetHeight, { kernel: sharp.kernel.lanczos3 });
  }
  const sharpenSigma = isUpscaling ? Math.min(0.8 + scale * 0.35, 2.5) : 0.5;
  const resized = await pipeline.sharpen({ sigma: sharpenSigma }).toBuffer();

  // 4. Canvas = product size + fixed padding %, so it adapts per-image while
  //    keeping consistent breathing room and staying square for grid layout.
  const canvasSize = Math.round(Math.max(targetWidth, targetHeight) / (1 - PADDING_RATIO * 2));

  const canvas = sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 },
    },
  }).composite([{ input: resized, gravity: 'center' }]);

  let buffer;
  if (format === 'jpeg') buffer = await canvas.flatten({ background: '#ffffff' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  else if (format === 'webp') buffer = await canvas.webp({ quality: 88 }).toBuffer();
  else buffer = await canvas.png({ compressionLevel: 9, effort: 10, palette: true }).toBuffer();

  return { buffer, canvasSize, isUpscaling };
}

// ---------------------------------------------------------------------------
// Backup helper
// ---------------------------------------------------------------------------

function backupOriginal(storagePath, buffer) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(BACKUP_DIR, `${stamp}__${storagePath.replace(/\//g, '__')}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buffer);
  return dest;
}

/**
 * If this path was already processed by a previous run, its true original is
 * in the backup dir (earliest timestamp = first time we touched it). Re-running
 * against the *current* Storage object would upscale an already-upscaled
 * image, compounding softness — so always prefer the oldest backup as source.
 */
function findEarliestBackup(storagePath) {
  if (!fs.existsSync(BACKUP_DIR)) return null;
  const suffix = `__${storagePath.replace(/\//g, '__')}`;
  const matches = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(suffix))
    .sort(); // ISO timestamp prefix sorts chronologically
  if (matches.length === 0) return null;
  return path.join(BACKUP_DIR, matches[0]);
}

// ---------------------------------------------------------------------------
// Simple async pool (no extra dependency)
// ---------------------------------------------------------------------------

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runOne() {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await worker(items[idx], idx);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runOne));
  return results;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🖼️  Product image optimizer  ${APPLY ? '(APPLY MODE — will overwrite Storage)' : '(DRY RUN — no writes)'}`);
  console.log(`   canvas=adaptive (min-quality=${MIN_QUALITY_PX}px, max=${MAX_CANVAS}px)  padding=${Math.round(PADDING_RATIO * 100)}%  maxUpscale=${MAX_UPSCALE}x  concurrency=${CONCURRENCY}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const { data: products, error: fetchError } = await supabase.from('products').select('id, image_path');
  if (fetchError) {
    console.error(`❌ Failed to fetch products: ${fetchError.message}`);
    process.exit(1);
  }
  if (!products || products.length === 0) {
    console.log('No products found.');
    return;
  }

  let docs = products;
  if (ONLY_IDS) docs = docs.filter((d) => ONLY_IDS.includes(d.id));
  if (LIMIT) docs = docs.slice(0, LIMIT);

  console.log(`Found ${products.length} products; processing ${docs.length}.\n`);

  const summary = { processed: 0, skipped: 0, failed: 0, bytesBefore: 0, bytesAfter: 0 };

  await runPool(
    docs,
    async (doc) => {
      const storagePath = typeof doc.image_path === 'string' ? doc.image_path.replace(/^\/+/, '') : '';

      if (!storagePath) {
        console.log(`⏭️  [${doc.id}] no image_path set — skipping`);
        summary.skipped++;
        return;
      }

      const ext = path.extname(storagePath).toLowerCase();
      if (!RASTER_EXT.has(ext)) {
        console.log(`⏭️  [${doc.id}] "${storagePath}" is not a supported raster format — skipping`);
        summary.skipped++;
        return;
      }

      const { data: blob, error: downloadError } = await supabase.storage.from(IMAGE_BUCKET).download(storagePath);
      if (downloadError || !blob) {
        console.log(`⚠️  [${doc.id}] "${storagePath}" not found in Storage — skipping`);
        summary.skipped++;
        return;
      }

      try {
        const liveBuffer = Buffer.from(await blob.arrayBuffer());

        const earliestBackup = findEarliestBackup(storagePath);
        const reprocessing = Boolean(earliestBackup);
        const original = reprocessing ? fs.readFileSync(earliestBackup) : liveBuffer;
        if (reprocessing) {
          console.log(`   ↩️  [${doc.id}] previously processed — reprocessing from original backup, not the live (already-processed) file`);
        }

        const { buffer: processed, canvasSize, isUpscaling } = await processImage(original, ext);

        const before = original.length;
        const after = processed.length;
        summary.bytesBefore += before;
        summary.bytesAfter += after;

        const pct = (((after - before) / before) * 100).toFixed(1);
        console.log(
          `✅ [${doc.id}] "${storagePath}" — ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (${pct > 0 ? '+' : ''}${pct}%), centered on ${canvasSize}x${canvasSize}${isUpscaling ? ' [upscaled]' : ''}`
        );

        if (APPLY) {
          // Back up whatever is currently live (pre-this-run) before overwriting,
          // so there's always a restore path back to the immediately-prior state.
          const backupPath = backupOriginal(storagePath, liveBuffer);
          const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(storagePath, processed, {
            contentType: `image/${formatFromExt(ext)}`,
            cacheControl: '31536000',
            upsert: true,
          });
          if (uploadError) throw new Error(uploadError.message);
          console.log(`   💾 backed up pre-run state → ${path.relative(process.cwd(), backupPath)}`);
        }

        summary.processed++;
      } catch (err) {
        console.error(`❌ [${doc.id}] "${storagePath}" failed: ${err.message}`);
        summary.failed++;
      }
    },
    CONCURRENCY
  );

  const savedKB = (summary.bytesBefore - summary.bytesAfter) / 1024;
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary');
  console.log(`   Processed: ${summary.processed}`);
  console.log(`   Skipped:   ${summary.skipped}`);
  console.log(`   Failed:    ${summary.failed}`);
  if (summary.processed > 0) {
    console.log(`   Size delta: ${savedKB >= 0 ? '-' : '+'}${Math.abs(savedKB).toFixed(0)}KB total`);
  }
  if (!APPLY) {
    console.log('\n   This was a DRY RUN — nothing was uploaded. Re-run with --apply to write changes.');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
