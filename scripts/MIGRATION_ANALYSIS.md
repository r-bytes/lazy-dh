# Product Migration Analysis

## FASE 1 — Analyse

### Bestaande Scripts
- **`scripts/migrate-images.ts`**: Bestaand script voor image uploads
  - Herbruikbaar: Image upload logica
  - Herbruikbaar: Sanity client setup
  - Herbruikbaar: Draft creation pattern

### Sanity Schema Analyse
- **Product schema** (`sanity/lazo-dh/schemas/product.ts`):
  - `percentage`: STRING type (niet number, niet reference) - waarden zoals "40%", "12.5%"
  - `volume`: STRING type (niet number) - waarden zoals "70cl", "20cl"
  - `category`: STRING type (niet reference) - vaste lijst: Gin, Likeur, Ouzo, Rakia, Whisky, Wijn, Wodka
  - `image`: Image asset reference
  - Alle andere velden: number of boolean

### Wat Ontbreekt
- ✅ Geen percentage reference schema nodig (percentage is string)
- ✅ Geen category reference schema nodig (category is string)
- ⚠️ CSV heeft "Lavish" als category - niet in valid list, maar script accepteert het met warning
- ✅ Image upload helpers bestaan al in `migrate-images.ts`

## FASE 2 — Datamodel Mapping

### CSV → Sanity Mapping
| CSV Field | CSV Type | Sanity Field | Sanity Type | Transformation |
|-----------|----------|--------------|-------------|----------------|
| productId | string (empty) | _id | string | Generated deterministically |
| name | string | name | string | Trim |
| volume | number (0.7) | volume | string | Convert to "70cl" |
| quantityInBox | number | quantityInBox | number | Parse int |
| percentage | number (40) | percentage | string | Convert to "40%" |
| price | number | price | number | Parse float |
| category | string | category | string | Validate against list |
| description | string (empty) | description | string | Optional |
| inStock | string (empty) | inStock | boolean | Parse boolean |
| inSale | string (empty) | inSale | boolean | Parse boolean |
| isNew | string (empty) | isNew | boolean | Parse boolean |
| quantity | string (empty) | quantity | number | Default to 0 |
| imageFile | string (./images/...) | image.asset._ref | reference | Upload & reference |

## FASE 3 — Referenties

**Geen referenties nodig:**
- Percentage is een string, geen reference
- Category is een string, geen reference

## FASE 4 — Draft-only Import

✅ **Geïmplementeerd:**
- Alle producten krijgen `drafts.` prefix in `_id`
- Script gebruikt `drafts.${productId}` als document ID
- Nooit direct publish - alle producten zijn drafts

## FASE 5 — Images

✅ **Geïmplementeerd:**
- Lokale image paths uit CSV worden gebruikt
- Images worden geüpload via Sanity asset pipeline
- Duplicate check: controleert op bestaande assets via `originalFilename`
- Image asset wordt gekoppeld aan product via reference

## FASE 6 — Idempotentie

✅ **Geïmplementeerd:**
- Deterministische product IDs: `product-{name-slug}-{volume}-{percentage}`
- Draft existence check: controleert of draft al bestaat
- Update i.p.v. create als draft bestaat
- Image duplicate check: voorkomt duplicate uploads

## FASE 7 — Output

✅ **Geïmplementeerd:**
- Gedetailleerde console logging
- JSON report in `backup/product-migration-{timestamp}.json`
- Summary met:
  - Totaal aantal producten
  - Aantal created
  - Aantal updated
  - Aantal failed
  - Lijst van failures

## Gebruik

```bash
# Set environment variables
export NEXT_PUBLIC_SANITY_PROJECT_ID="rx2p8wni"
export NEXT_PUBLIC_SANITY_DATASET="production"
export SANITY_API_TOKEN="your-write-token"

# Run migration
tsx scripts/migrate-products.ts
```

## Opmerkingen

1. **Category "Lavish"**: CSV bevat "Lavish" als category, wat niet in de valid list staat. Script accepteert dit met een warning.

2. **Volume conversie**: CSV heeft volumes als decimaal (0.7, 0.25), script converteert naar "70cl", "25cl" format.

3. **Percentage conversie**: CSV heeft percentages als getal (40, 12.5), script converteert naar "40%", "12.5%" format.

4. **Empty fields**: Lege velden in CSV worden behandeld:
   - `inStock`, `inSale`, `isNew`: default naar `false`
   - `quantity`: default naar `0`
   - `description`: optional (undefined als leeg)

5. **Image paths**: CSV heeft relatieve paths (`./images/...`), script converteert naar absolute paths.



