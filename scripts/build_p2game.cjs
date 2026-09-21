'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('=== [p2game build pipeline] Starting build for tai-kingdom ===');

// 1. Run Vite production build
console.log('1. Running vite production build...');
execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });

// 2. Ensure p2game.json is present in dist/ root
console.log('2. Placing p2game.json in dist/ root...');
const manifestSrc = path.join(ROOT_DIR, 'p2game.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, path.join(DIST_DIR, 'p2game.json'));
} else {
  console.error('ERROR: p2game.json not found in root!');
  process.exit(1);
}

// 3. Ensure store assets are copied to dist/assets/store/
console.log('3. Ensuring store assets in dist/assets/store/...');
const distStoreDir = path.join(DIST_DIR, 'assets', 'store');
const srcStoreDir = path.join(ROOT_DIR, 'public', 'assets', 'store');
fs.mkdirSync(distStoreDir, { recursive: true });
['icon-512.png', 'cover-1280x720.png', 'screenshot-1.png'].forEach((file) => {
  const src = path.join(srcStoreDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distStoreDir, file));
  } else {
    console.warn(`WARNING: Store asset missing: ${file}`);
  }
});

// 4. Normalize paths in dist/index.html (no root slash, relative ./)
const indexPath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html
    .replaceAll('"/favicon.png"', '"./favicon.png"')
    .replace(/\?v=[0-9.]+/g, '');
  fs.writeFileSync(indexPath, html, 'utf8');
}

// 5. Calculate statistics
function calculateDirStats(dir) {
  let totalBytes = 0;
  let fileCount = 0;
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(current, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile()) {
        fileCount++;
        totalBytes += fs.statSync(p).size;
      }
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return { totalBytes, fileCount };
}

const stats = calculateDirStats(DIST_DIR);
const sizeMB = (stats.totalBytes / (1024 * 1024)).toFixed(2);
console.log('\n=== [p2game build summary] ===');
console.log(`- Output Directory   : ${DIST_DIR}`);
console.log(`- Total Files        : ${stats.fileCount} (Limit: 6,000)`);
console.log(`- Uncompressed Size  : ${sizeMB} MB (Limit: 600 MB)`);

// 6. Create ready-to-upload zip package
const manifest = JSON.parse(fs.readFileSync(path.join(DIST_DIR, 'p2game.json'), 'utf8'));
const slug = manifest.id || 'tai-kingdom';
const zipOutPath = path.join(DIST_DIR, `${slug}.zip`);
console.log(`\n4. Creating upload-ready ZIP archive: dist/${slug}.zip...`);
try {
  if (fs.existsSync(zipOutPath)) fs.unlinkSync(zipOutPath);
  try {
    execSync(`tar -a -c -f "${slug}.zip" *`, { cwd: DIST_DIR, stdio: 'inherit' });
  } catch (_) {
    const psZipCmd = `powershell -Command "Get-ChildItem -Path '${DIST_DIR}' -Exclude '*.zip' | Compress-Archive -DestinationPath '${zipOutPath}' -Force"`;
    execSync(psZipCmd, { stdio: 'inherit' });
  }
  const zipSizeMB = (fs.statSync(zipOutPath).size / (1024 * 1024)).toFixed(2);
  console.log(`- ZIP Archive Created: ${zipOutPath}`);
  console.log(`- ZIP Archive Size   : ${zipSizeMB} MB (Limit: 200 MB)`);
} catch (zipErr) {
  console.warn('Notice: Manual zip recommended if archive creation encountered issues.');
}

console.log('\n>>> SUCCESS: tai-kingdom p2game build completed successfully! <<<');
