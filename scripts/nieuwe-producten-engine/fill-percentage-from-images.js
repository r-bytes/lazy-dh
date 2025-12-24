import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

/* ================= CONFIG ================= */

const IMAGES_DIR = "./images";
const INPUT_CSV = "./products.csv";
const OUTPUT_CSV = "./products.with-percentage.csv";

/* ================= HELPERS ================= */

const normalize = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");

const normalizeNumber = (v) =>
  v === "" || v === undefined
    ? null
    : Number(String(v).replace(",", "."));

const makeKey = (name, volume, box) =>
  `${normalize(name)}-${volume}-${box}`;

/* ================= LOAD CSV ================= */

const csvRaw = fs.readFileSync(INPUT_CSV, "utf-8");

const rows = parse(csvRaw, {
  columns: true,
  skip_empty_lines: true,
});

/* ================= PARSE IMAGES ================= */

const imageFiles = fs
  .readdirSync(IMAGES_DIR)
  .filter((f) => /\.(png|webp)$/i.test(f));

const imagePercentageMap = new Map();

for (const file of imageFiles) {
  const match = file.match(
    /^(.+?)\s+([\d.]+)-(\d+)[-.]([\d.,]+)\.(png|webp)$/i
  );

  if (!match) continue;

  const [, rawName, volumeStr, boxStr, percentageStr] = match;

  const name = rawName.trim();
  const volume = normalizeNumber(volumeStr);
  const quantityInBox = normalizeNumber(boxStr);
  const percentage = normalizeNumber(percentageStr);

  const key = makeKey(name, volume, quantityInBox);

  imagePercentageMap.set(key, percentage);
}

/* ================= FILL / VALIDATE ================= */

for (const row of rows) {
  const volume = normalizeNumber(row.volume);
  const quantityInBox = normalizeNumber(row.quantityInBox);
  const csvPercentage = normalizeNumber(row.percentage);

  const key = makeKey(row.name, volume, quantityInBox);

  if (!imagePercentageMap.has(key)) {
    throw new Error(
      `❌ Geen image gevonden voor ${row.name} (${volume}L)`
    );
  }

  const imagePercentage = imagePercentageMap.get(key);

  if (csvPercentage === null) {
    // 🟢 automatisch invullen
    row.percentage = imagePercentage;
  } else if (csvPercentage !== imagePercentage) {
    // 🔴 conflict
    throw new Error(
      `❌ Percentage mismatch voor ${row.name} ${volume}L (CSV: ${csvPercentage}, Image: ${imagePercentage})`
    );
  }
}

/* ================= OUTPUT ================= */

const output = stringify(rows, {
  header: true,
  columns: Object.keys(rows[0]),
});

fs.writeFileSync(OUTPUT_CSV, output);

console.log(
  `✅ Percentages ingevuld/gevalideerd → ${OUTPUT_CSV}`
);