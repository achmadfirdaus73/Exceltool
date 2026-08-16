import fs from 'fs';
import zlib from 'zlib';

// Minimal PNG encoder with pure JS and Node zlib
function createPng(width, height, drawFn) {
  // RGBA buffer with filter byte per row
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowBytes + 1);
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header: 89 50 4E 47 0D 0A 1A 0A
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = crc32(typeAndData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([len, typeAndData, crcBuf]);
}

function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

// Icon design: dark navy background (#0f172a / #1e3a8a gradient) with rounded emerald/cyan Excel sheet & grid
function iconPainter(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Background circle / rounded squircle
  const cx = 0.5;
  const cy = 0.5;
  const dx = Math.abs(nx - cx);
  const dy = Math.abs(ny - cy);
  const dist = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);

  // Background color gradient (Dark slate to dark blue)
  let r = Math.round(15 + 15 * ny);
  let g = Math.round(23 + 35 * nx);
  let b = Math.round(42 + 90 * ny);
  let a = 255;

  // Inner card (Green excel style card in center)
  if (nx >= 0.18 && nx <= 0.82 && ny >= 0.18 && ny <= 0.82) {
    // Card background: emerald green gradient
    r = Math.round(16 + 20 * nx);
    g = Math.round(185 - 40 * ny);
    b = Math.round(129 - 30 * nx);

    // Inner grid / lines
    if (
      (Math.abs(ny - 0.40) < 0.015 && nx > 0.28 && nx < 0.72) ||
      (Math.abs(ny - 0.55) < 0.015 && nx > 0.28 && nx < 0.72) ||
      (Math.abs(ny - 0.70) < 0.015 && nx > 0.28 && nx < 0.72) ||
      (Math.abs(nx - 0.45) < 0.015 && ny > 0.30 && ny < 0.72) ||
      (Math.abs(nx - 0.60) < 0.015 && ny > 0.30 && ny < 0.72)
    ) {
      r = 255;
      g = 255;
      b = 255;
      a = 220;
    }

    // Top bar of sheet
    if (ny < 0.30 && nx > 0.22 && nx < 0.78) {
      r = 5;
      g = 150;
      b = 105;
    }
  }

  // Large 'X' symbol badge on bottom-left / center-left
  if (nx >= 0.12 && nx <= 0.42 && ny >= 0.35 && ny <= 0.75) {
    const lx = (nx - 0.12) / 0.30;
    const ly = (ny - 0.35) / 0.40;
    // Badge background: dark green
    if (lx >= 0.05 && lx <= 0.95 && ly >= 0.05 && ly <= 0.95) {
      r = 4;
      g = 120;
      b = 87;

      // Draw letter 'X'
      const dist1 = Math.abs(lx - ly);
      const dist2 = Math.abs(lx - (1 - ly));
      if ((dist1 < 0.14 || dist2 < 0.14) && lx > 0.2 && lx < 0.8 && ly > 0.2 && ly < 0.8) {
        r = 255;
        g = 255;
        b = 255;
      }
    }
  }

  return [r, g, b, a];
}

// Generate icons
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/icon-192.png', createPng(192, 192, iconPainter));
fs.writeFileSync('public/icon-512.png', createPng(512, 512, iconPainter));
fs.writeFileSync('public/icon-maskable-512.png', createPng(512, 512, iconPainter));
console.log('Successfully generated public/icon-192.png and public/icon-512.png!');
