import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const source = path.join(publicDir, 'icon-source.png');

const THEME_BLUE = { r: 2, g: 132, b: 199, alpha: 1 };

async function resizeIcon(filename, size) {
  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, filename));
}

/** Ícone maskable com margem de segurança (~80% do conteúdo central). */
async function createMaskableIcon(filename, size) {
  const inner = Math.round(size * 0.82);
  const icon = await sharp(source).resize(inner, inner, { fit: 'cover' }).toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: THEME_BLUE,
    },
  })
    .composite([{ input: icon, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, filename));
}

await resizeIcon('pwa-192x192.png', 192);
await resizeIcon('pwa-512x512.png', 512);
await resizeIcon('apple-touch-icon.png', 180);
await createMaskableIcon('maskable-icon-512x512.png', 512);

console.log('PWA icons generated in frontend/public/');
