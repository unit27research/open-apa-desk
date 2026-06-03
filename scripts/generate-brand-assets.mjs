import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

const OUT_DIR = 'assets/branding';

const COLORS = {
  ink: [23, 32, 38, 255],
  teal: [21, 94, 117, 255],
  tealLight: [14, 165, 166, 255],
  blueGray: [226, 237, 241, 255],
  gold: [217, 145, 35, 255],
  muted: [73, 88, 101, 255],
  paper: [255, 255, 255, 255],
  rule: [177, 204, 211, 255],
  transparent: [0, 0, 0, 0]
};

await mkdir(OUT_DIR, { recursive: true });

await writePng(`${OUT_DIR}/open-apa-desk-icon-32.png`, drawIcon(32));
await writePng(`${OUT_DIR}/open-apa-desk-icon-128.png`, drawIcon(128));
await writePng(`${OUT_DIR}/open-apa-desk-card-banner-220x140.png`, drawBanner());

function drawIcon(size) {
  const image = createImage(size, size);
  const scale = size / 128;
  const page = rectForScale(scale, 31, 15, 66, 92);
  const border = Math.max(2, Math.round(5 * scale));

  fillRoundRect(image, page.x, page.y, page.w, page.h, 9 * scale, COLORS.teal);
  fillRoundRect(
    image,
    page.x + border,
    page.y + border,
    page.w - border * 2,
    page.h - border * 2,
    Math.max(0, 9 * scale - border),
    COLORS.paper
  );
  fillRect(image, page.x + page.w - 23 * scale, page.y, 23 * scale, 23 * scale, COLORS.tealLight);
  fillTriangle(
    image,
    page.x + page.w - 23 * scale,
    page.y,
    page.x + page.w,
    page.y + 23 * scale,
    page.x + page.w - 23 * scale,
    page.y + 23 * scale,
    COLORS.paper
  );

  drawReferenceLines(image, page.x + 17 * scale, page.y + 38 * scale, scale);
  strokeRect(image, page.x + 18 * scale, page.y + 63 * scale, 30 * scale, 18 * scale, COLORS.teal, Math.max(2, Math.round(4 * scale)));
  fillRect(image, page.x + 55 * scale, page.y + 69 * scale, 15 * scale, 4 * scale, COLORS.tealLight);
  return image;
}

function drawBanner() {
  const image = createImage(220, 140);
  fillRect(image, 0, 0, 220, 140, COLORS.blueGray);
  fillRect(image, 0, 0, 220, 10, COLORS.teal);
  fillRect(image, 0, 126, 220, 14, COLORS.ink);
  fillTriangle(image, 152, 10, 220, 10, 220, 84, [207, 226, 232, 255]);

  fillRoundRect(image, 16, 23, 76, 92, 9, [197, 215, 221, 255]);
  const icon = drawIcon(74);
  blit(image, icon, 18, 18);

  fillRoundRect(image, 103, 24, 78, 39, 7, COLORS.paper);
  fillRect(image, 116, 34, 52, 4, COLORS.teal);
  fillRect(image, 124, 44, 36, 3, COLORS.rule);
  fillRect(image, 132, 53, 20, 3, COLORS.rule);

  fillRoundRect(image, 98, 72, 94, 25, 7, COLORS.teal);
  fillRect(image, 113, 82, 45, 4, COLORS.paper);
  fillRect(image, 164, 82, 16, 4, COLORS.tealLight);
  fillRect(image, 106, 78, 4, 15, COLORS.paper);
  fillRect(image, 184, 78, 4, 15, COLORS.paper);

  fillRoundRect(image, 108, 105, 76, 17, 4, COLORS.paper);
  fillRect(image, 118, 110, 52, 3, COLORS.muted);
  fillRect(image, 118, 116, 36, 3, COLORS.rule);
  fillRect(image, 188, 108, 6, 6, COLORS.gold);
  return image;
}

function drawWordmark(image, x, y, scale) {
  // Abstract wordmark: O A D built from simple strokes, readable at banner size.
  strokeRect(image, x, y, 20 * scale, 20 * scale, COLORS.paper, 3 * scale);
  strokeLine(image, x + 28 * scale, y + 20 * scale, x + 38 * scale, y, COLORS.paper, 3 * scale);
  strokeLine(image, x + 38 * scale, y, x + 48 * scale, y + 20 * scale, COLORS.paper, 3 * scale);
  strokeLine(image, x + 32 * scale, y + 12 * scale, x + 44 * scale, y + 12 * scale, COLORS.paper, 3 * scale);
  strokeRect(image, x + 58 * scale, y, 17 * scale, 20 * scale, COLORS.paper, 3 * scale);
}

function drawReferenceLines(image, x, y, scale) {
  fillRect(image, x, y, 35 * scale, 4 * scale, COLORS.teal);
  fillRect(image, x, y + 12 * scale, 47 * scale, 4 * scale, COLORS.rule);
  fillRect(image, x, y + 24 * scale, 38 * scale, 4 * scale, COLORS.rule);
}

function createImage(width, height) {
  return {
    width,
    height,
    data: new Uint8Array(width * height * 4)
  };
}

function rectForScale(scale, x, y, w, h) {
  return {
    x: Math.round(x * scale),
    y: Math.round(y * scale),
    w: Math.round(w * scale),
    h: Math.round(h * scale)
  };
}

function fillRect(image, x, y, width, height, color) {
  const startX = Math.max(0, Math.round(x));
  const startY = Math.max(0, Math.round(y));
  const endX = Math.min(image.width, Math.round(x + width));
  const endY = Math.min(image.height, Math.round(y + height));
  for (let yy = startY; yy < endY; yy += 1) {
    for (let xx = startX; xx < endX; xx += 1) {
      setPixel(image, xx, yy, color);
    }
  }
}

function fillRoundRect(image, x, y, width, height, radius, color) {
  const r = Math.round(radius);
  for (let yy = Math.round(y); yy < Math.round(y + height); yy += 1) {
    for (let xx = Math.round(x); xx < Math.round(x + width); xx += 1) {
      const cx = xx < x + r ? x + r : xx >= x + width - r ? x + width - r - 1 : xx;
      const cy = yy < y + r ? y + r : yy >= y + height - r ? y + height - r - 1 : yy;
      if ((xx - cx) ** 2 + (yy - cy) ** 2 <= r ** 2) {
        setPixel(image, xx, yy, color);
      }
    }
  }
}

function strokeRoundRect(image, x, y, width, height, radius, color, lineWidth) {
  fillRoundRect(image, x, y, width, height, radius, color);
  fillRoundRect(
    image,
    x + lineWidth,
    y + lineWidth,
    width - lineWidth * 2,
    height - lineWidth * 2,
    Math.max(0, radius - lineWidth),
    COLORS.transparent
  );
}

function strokeRect(image, x, y, width, height, color, lineWidth) {
  fillRect(image, x, y, width, lineWidth, color);
  fillRect(image, x, y + height - lineWidth, width, lineWidth, color);
  fillRect(image, x, y, lineWidth, height, color);
  fillRect(image, x + width - lineWidth, y, lineWidth, height, color);
}

function strokeLine(image, x1, y1, x2, y2, color, lineWidth) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let step = 0; step <= steps; step += 1) {
    const t = steps === 0 ? 0 : step / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    fillRect(image, x - lineWidth / 2, y - lineWidth / 2, lineWidth, lineWidth, color);
  }
}

function fillTriangle(image, x1, y1, x2, y2, x3, y3, color) {
  const minX = Math.floor(Math.min(x1, x2, x3));
  const maxX = Math.ceil(Math.max(x1, x2, x3));
  const minY = Math.floor(Math.min(y1, y2, y3));
  const maxY = Math.ceil(Math.max(y1, y2, y3));
  const area = edge(x1, y1, x2, y2, x3, y3);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const w1 = edge(x2, y2, x3, y3, x, y);
      const w2 = edge(x3, y3, x1, y1, x, y);
      const w3 = edge(x1, y1, x2, y2, x, y);
      if (
        (area >= 0 && w1 >= 0 && w2 >= 0 && w3 >= 0) ||
        (area < 0 && w1 <= 0 && w2 <= 0 && w3 <= 0)
      ) {
        setPixel(image, x, y, color);
      }
    }
  }
}

function edge(x1, y1, x2, y2, x, y) {
  return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
}

function blit(target, source, offsetX, offsetY) {
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const index = (y * source.width + x) * 4;
      const alpha = source.data[index + 3];
      if (alpha > 0) {
        setPixel(target, offsetX + x, offsetY + y, source.data.slice(index, index + 4));
      }
    }
  }
}

function setPixel(image, x, y, color) {
  if (x < 0 || y < 0 || x >= image.width || y >= image.height) {
    return;
  }
  const index = (y * image.width + x) * 4;
  image.data[index] = color[0];
  image.data[index + 1] = color[1];
  image.data[index + 2] = color[2];
  image.data[index + 3] = color[3];
}

async function writePng(path, image) {
  const scanlineLength = image.width * 4 + 1;
  const raw = new Uint8Array(scanlineLength * image.height);
  for (let y = 0; y < image.height; y += 1) {
    raw[y * scanlineLength] = 0;
    raw.set(
      image.data.slice(y * image.width * 4, (y + 1) * image.width * 4),
      y * scanlineLength + 1
    );
  }

  const chunks = [
    chunk('IHDR', concatUint8(uint32(image.width), uint32(image.height), new Uint8Array([8, 6, 0, 0, 0]))),
    // Stable bytes matter more than compression here; GitHub Actions may run
    // a different zlib than local development.
    chunk('IDAT', deflateSync(raw, { level: 0 })),
    chunk('IEND', new Uint8Array())
  ];

  await writeFile(path, concatUint8(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), ...chunks));
}

function chunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  return concatUint8(uint32(data.length), typeBytes, data, uint32(crc32(concatUint8(typeBytes, data))));
}

function uint32(value) {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value >>> 0);
  return bytes;
}

function concatUint8(...parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
