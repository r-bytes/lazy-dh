import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

/* ================= CONFIG ================= */

const IMAGES_DIR = "./images";
const INPUT_CSV = "./products.csv";
const OUTPUT_CSV = "./products.validated.csv";

/* ================= HELPERS ================= */

const normalize = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");

const normalizeNumber = (value) =>
  Number(String(value).replace(",", "."));

const makeKey = (name, volume, box, percentage) =>
  `${normalize(name)}-${volume}-${box}-${percentage}`;

/* ================= LOAD CSV ================= */

if (!fs.existsSync(INPUT_CSV)) {
  throw new Error("❌ products.csv niet gevonden");
}

const csvRaw = fs.readFileSync(INPUT_CSV, "utf-8");

const rows = parse(csvRaw, {
  columns: true,
  skip_empty_lines: true,
});

/* ================= PARSE IMAGES ================= */

if (!fs.existsSync(IMAGES_DIR)) {
  throw new Error("❌ images map niet gevonden");
}

const imageFiles = fs
  .readdirSync(IMAGES_DIR)
  .filter((f) => f.toLowerCase().endsWith(".png"));

const imageMap = new Map();

for (const file of imageFiles) {
  const match = file.match(
    /^(.+?)\s+([\d.]+)-(\d+)-([\d.,]+)\.png$/i
  );

  if (!match) {
    throw new Error(`❌ Ongeldig image formaat: ${file}`);
  }

  const [, rawName, volumeStr, boxStr, percentageStr] = match;

  const name = rawName.trim();
  const volume = normalizeNumber(volumeStr);
  const quantityInBox = normalizeNumber(boxStr);
  const percentage = normalizeNumber(percentageStr);

  if (
    !Number.isFinite(volume) ||
    !Number.isFinite(quantityInBox) ||
    !Number.isFinite(percentage)
  ) {
    throw new Error(`❌ Numerieke parsing fout in image: ${file}`);
  }

  const key = makeKey(name, volume, quantityInBox, percentage);

  if (imageMap.has(key)) {
    throw new Error(`❌ Dubbele image gevonden voor: ${key}`);
  }

  imageMap.set(key, file);
}

/* ================= VALIDATE & LINK ================= */

for (const row of rows) {
  const volume = normalizeNumber(row.volume);
  const quantityInBox = normalizeNumber(row.quantityInBox);
  const percentage = normalizeNumber(row.percentage);

  if (
    !Number.isFinite(volume) ||
    !Number.isFinite(quantityInBox) ||
    !Number.isFinite(percentage)
  ) {
    throw new Error(
      `❌ Ongeldige numerieke waarde in CSV voor productId ${row.productId}`
    );
  }

  const key = makeKey(
    row.name,
    volume,
    quantityInBox,
    percentage
  );

  if (!imageMap.has(key)) {
    throw new Error(
      `❌ Geen image gevonden voor: ${row.name} ${volume}L ${percentage}%`
    );
  }

  row.imageFile = imageMap.get(key);
}

/* ================= OUTPUT ================= */

const outputCsv = stringify(rows, {
  header: true,
  columns: Object.keys(rows[0]),
});

fs.writeFileSync(OUTPUT_CSV, outputCsv);

console.log(
  `✅ ${rows.length} producten gevalideerd → ${OUTPUT_CSV}`
);