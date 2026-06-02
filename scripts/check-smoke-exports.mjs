import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';
import { deflateRawSync, inflateRawSync } from 'node:zlib';

const MARKER = '[[OPEN_APA_DESK';
const DEFAULT_EXPORT_DIR = 'private/smoke-evidence/exports';
const argv = process.argv.slice(2);
const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

if (argv.includes('--self-test')) {
  await runSelfTest();
  process.exit(0);
}

const targets = argv.length > 0 ? argv : [DEFAULT_EXPORT_DIR];
const files = await collectExportFiles(targets);

if (files.length === 0) {
  console.error(
    `No PDF or DOCX exports found. Pass export files as arguments, or place them under ${DEFAULT_EXPORT_DIR}.`
  );
  process.exit(1);
}

const findings = [];
const warnings = [];

for (const file of files) {
  const result = await scanExport(file);
  findings.push(...result.findings);
  warnings.push(...result.warnings);
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (findings.length > 0) {
  console.error('Smoke export marker scan failed:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Smoke export marker scan passed for ${files.length} file(s).`);
console.log(
  'PDF scanning is byte-level only. Keep the human visual PDF/DOCX export check in the final smoke evidence.'
);

async function scanExport(file) {
  const extension = extname(file).toLowerCase();
  if (extension === '.docx') {
    return scanDocx(file);
  }
  if (extension === '.pdf') {
    return scanPdf(file);
  }
  return {
    findings: [],
    warnings: [`Skipped unsupported export type: ${file}`]
  };
}

async function scanDocx(file) {
  const buffer = await readFile(file);
  const findings = [];
  const warnings = [];

  let entries;
  try {
    entries = extractZipEntries(buffer);
  } catch (error) {
    return {
      findings: [`Unable to read DOCX zip structure in ${file}: ${error.message}`],
      warnings
    };
  }

  const textEntries = entries.filter(
    (entry) => entry.name.startsWith('word/') && entry.name.endsWith('.xml')
  );

  for (const entry of textEntries) {
    if (bufferContainsMarker(entry.content)) {
      findings.push(`${file}: marker text found in ${entry.name}`);
    }
  }

  if (textEntries.length === 0) {
    warnings.push(`${file}: no word/*.xml entries found in DOCX export.`);
  }

  return { findings, warnings };
}

async function scanPdf(file) {
  const buffer = await readFile(file);
  return {
    findings: bufferContainsMarker(buffer)
      ? [`${file}: marker text found in PDF bytes`]
      : [],
    warnings: [
      `${file}: PDF scan is byte-level and may not detect compressed or encoded visible text.`
    ]
  };
}

function extractZipEntries(buffer) {
  const eocdOffset = findEndOfCentralDirectory(buffer);
  if (eocdOffset < 0) {
    throw new Error('end of central directory not found');
  }

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  const centralDirectoryEnd = centralDirectoryOffset + centralDirectorySize;
  const entries = [];
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount && offset < centralDirectoryEnd; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error('central directory header signature mismatch');
    }

    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraFieldLength = buffer.readUInt16LE(offset + 30);
    const fileCommentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer
      .subarray(offset + 46, offset + 46 + fileNameLength)
      .toString('utf8');

    if (compressedSize === 0xffffffff || localHeaderOffset === 0xffffffff) {
      throw new Error('ZIP64 DOCX exports are not supported by this smoke helper');
    }

    entries.push({
      name,
      content: extractZipEntry(buffer, {
        compressionMethod,
        compressedSize,
        localHeaderOffset
      })
    });

    offset += 46 + fileNameLength + extraFieldLength + fileCommentLength;
  }

  return entries;
}

function extractZipEntry(buffer, entry) {
  const offset = entry.localHeaderOffset;
  if (buffer.readUInt32LE(offset) !== 0x04034b50) {
    throw new Error('local file header signature mismatch');
  }

  const fileNameLength = buffer.readUInt16LE(offset + 26);
  const extraFieldLength = buffer.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + fileNameLength + extraFieldLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.compressionMethod === 0) {
    return compressed;
  }
  if (entry.compressionMethod === 8) {
    return inflateRawSync(compressed);
  }

  throw new Error(`unsupported ZIP compression method ${entry.compressionMethod}`);
}

function findEndOfCentralDirectory(buffer) {
  const minOffset = Math.max(0, buffer.length - 22 - 0xffff);
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  return -1;
}

function bufferContainsMarker(buffer) {
  return markerEncodings(MARKER).some((marker) => buffer.includes(marker));
}

function markerEncodings(marker) {
  const utf16be = Buffer.alloc(marker.length * 2);
  for (let index = 0; index < marker.length; index += 1) {
    utf16be.writeUInt16BE(marker.charCodeAt(index), index * 2);
  }
  return [Buffer.from(marker, 'utf8'), Buffer.from(marker, 'utf16le'), utf16be];
}

async function collectExportFiles(targetsToScan) {
  const files = [];
  for (const target of targetsToScan) {
    const resolved = resolve(target);
    let targetStat;
    try {
      targetStat = await stat(resolved);
    } catch {
      continue;
    }

    if (targetStat.isDirectory()) {
      files.push(...(await collectExportFilesInDirectory(resolved)));
    } else if (isExportFile(resolved)) {
      files.push(resolved);
    }
  }
  return files.sort();
}

async function collectExportFilesInDirectory(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectExportFilesInDirectory(entryPath)));
    } else if (entry.isFile() && isExportFile(entryPath)) {
      files.push(entryPath);
    }
  }
  return files;
}

function isExportFile(file) {
  return ['.docx', '.pdf'].includes(extname(file).toLowerCase());
}

async function runSelfTest() {
  const root = await makeSelfTestDirectory();
  try {
    const cleanDocx = join(root, 'clean.docx');
    const markerDocx = join(root, 'marker.docx');
    const markerPdf = join(root, 'marker.pdf');
    await writeFile(cleanDocx, buildMinimalDocx('Clean submission text.'));
    await writeFile(markerDocx, buildMinimalDocx(`Hidden ${MARKER}:title:start marker.`));
    await writeFile(markerPdf, `%PDF-1.4\n${MARKER}:references:start\n%%EOF\n`);

    const cleanResult = await scanExport(cleanDocx);
    const markerDocxResult = await scanExport(markerDocx);
    const markerPdfResult = await scanExport(markerPdf);

    if (cleanResult.findings.length !== 0) {
      throw new Error('self-test clean DOCX produced a false positive');
    }
    if (markerDocxResult.findings.length === 0) {
      throw new Error('self-test marker DOCX was not detected');
    }
    if (markerPdfResult.findings.length === 0) {
      throw new Error('self-test marker PDF was not detected');
    }

    console.log('Smoke export marker scanner self-test passed.');
  } finally {
    await rm(root, { force: true, recursive: true });
  }
}

async function makeSelfTestDirectory() {
  const root = join(
    tmpdir(),
    `open-apa-desk-export-scan-${process.pid}-${Date.now()}`
  );
  await mkdir(root, { recursive: true });
  return root;
}

function buildMinimalDocx(documentText) {
  const files = [
    {
      name: '[Content_Types].xml',
      content: Buffer.from(
        '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>'
      )
    },
    {
      name: 'word/document.xml',
      content: Buffer.from(
        `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${escapeXml(documentText)}</w:t></w:r></w:p></w:body></w:document>`
      )
    }
  ];
  return buildZip(files);
}

function buildZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const name = Buffer.from(file.name, 'utf8');
    const compressed = deflateRawSync(file.content);
    const crc = crc32(file.content);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(file.content.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(file.content.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, name);

    offset += localHeader.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
