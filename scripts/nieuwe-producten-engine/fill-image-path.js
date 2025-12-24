import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

/* CONFIG */
const IMAGES_DIR = "./images";
const INPUT_CSV = "./products.with-percentage.csv";
const OUTPUT_CSV = "./products.final.csv";

/* HELPERS */
const normalizeName = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")   // apostrof weg
    .replace(/\bs\b/g, "")  // trailing s
    .replace(/\s+/g, " ")
    .trim();

const normalizePlain = (v) => String(v).replace(",", ".");

const volumeVariants = (v) => {
  const n = Number(String(v).replace(",", "."));
  return [n.toFixed(2), String(n)];
};

const exts = ["webp", "png"];

/* LOAD CSV */
const csvRaw = fs.readFileSync(INPUT_CSV, "utf-8");
const rows = parse(csvRaw, { columns: true, skip_empty_lines: true });

/* LOAD IMAGES */
const imageFiles = fs.readdirSync(IMAGES_DIR);

/* FIND IMAGE */
const findImage = (row) => {
  const name = normalizeName(row.name);
  const box = normalizePlain(row.quantityInBox);
  const volumes = volumeVariants(row.volume);

  for (const file of imageFiles) {
    const f = normalizeName(file);
    if (!exts.some((e) => file.endsWith(`.${e}`))) continue;
    if (!f.includes(name)) continue;

    for (const vol of volumes) {
      if (f.includes(`${vol}-${box}-`)) {
        return file;
      }
    }
  }
  return null;
};

/* FILL imageFile */
for (const row of rows) {
  let filename = row.imageFile?.trim();
  if (!filename) filename = findImage(row);

  if (!filename) {
    throw new Error(
      `❌ Image niet gevonden voor "${row.name}" (volume ${row.volume})`
    );
  }

  row.imageFile = `${IMAGES_DIR}/${filename}`;
}

/* OUTPUT */
const output = stringify(rows, {
  header: true,
  columns: Object.keys(rows[0]),
});
fs.writeFileSync(OUTPUT_CSV, output);

console.log(`✅ Klaar → ${OUTPUT_CSV}`);