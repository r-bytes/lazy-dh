# FASE 8 — Cleanup Plan

## 📋 Overzicht

Dit document beschrijft alle bestanden en code die verwijderd of geüpdatet moeten worden na de modernisering.

---

## 🗑️ Bestanden die VERWIJDERD kunnen worden

### Oude Carousel Componenten
- ✅ `src/components/products/modern-carousel.tsx` 
  - **Status:** Vervangen door `ProductCarousel` variant="default"
  - **Gebruikt in:** `src/app/page.tsx` (regel 1, 103)
  - **Actie:** Verwijderen na homepage refactor

- ✅ `src/components/products/slide-carousel.tsx`
  - **Status:** Vervangen door `ProductCarousel` variant="minimal"
  - **Gebruikt in:** `src/app/page.tsx` (regel 2, 130)
  - **Actie:** Verwijderen na homepage refactor

### Oude Product Component
- ✅ `src/components/products/product.tsx`
  - **Status:** Vervangen door `ProductCard` + `ProductDialog`
  - **Gebruikt in:** Alleen in oude carousels (die verwijderd worden)
  - **Actie:** Verwijderen na carousel cleanup

### Oude Product List Component
- ✅ `src/components/products/product-list.tsx`
  - **Status:** Vervangen door `ProductGrid`
  - **Gebruikt in:** Alleen in `product-list-favorite.tsx` (al gemigreerd)
  - **Actie:** Verwijderen

### Oude Search Componenten
- ⚠️ `src/components/home/search-bar.tsx`
  - **Status:** Vervangen door `ProductSearch` component
  - **Gebruikt in:** `src/components/navigation/header.tsx` (regel 2, 133)
  - **Actie:** Verwijderen na header upgrade

- ⚠️ `src/components/ui/category/search-input.tsx` (InputForm)
  - **Status:** Vervangen door `ProductSearch` component
  - **Gebruikt in:** 
    - `src/components/ui/category/category-card.tsx` (regel 16, 67)
    - `src/components/ui/category/products-with-filter.tsx` (regel 10, 27)
  - **Actie:** Verwijderen na filter/search upgrade

### Oude Category Componenten
- ⚠️ `src/components/ui/category/category-card.tsx`
  - **Status:** Vervangen door `CategoryGrid`
  - **Gebruikt in:**
    - `src/app/page.tsx` (regel 4, 157)
    - `src/app/(pages)/categorieen/page.tsx` (regel 1, 33)
  - **Actie:** Verwijderen na category pages migratie

- ⚠️ `src/components/products/category-skeleton.tsx`
  - **Status:** Vervangen door `CategoryGridSkeleton`
  - **Gebruikt in:** `category-card.tsx` (regel 3, 58)
  - **Actie:** Verwijderen samen met category-card

- ⚠️ `src/components/products/input-form-skeleton.tsx`
  - **Status:** Niet meer nodig (search heeft eigen skeleton)
  - **Gebruikt in:** `category-skeleton.tsx` (regel 6, 17)
  - **Actie:** Verwijderen

### Oude Product Skeleton
- ⚠️ `src/components/products/product-skeleton.tsx`
  - **Status:** Vervangen door `ProductCardSkeleton`
  - **Gebruikt in:** `product-list.tsx` (regel 6, 37)
  - **Actie:** Verwijderen na product-list cleanup

---

## 🔄 Bestanden die GEÜPDATET moeten worden

### Imports die aangepast moeten worden

1. **`src/app/page.tsx`**
   - ❌ Verwijder: `ModernCarousel`, `SlideCarousel`, `CategoryCard`
   - ✅ Toevoegen: `ProductCarousel`, `CategoryGrid`, `HeroSection`, `Section`, `SectionHeader`
   - **Status:** Nieuwe versie al gemaakt in `page-refactored.tsx`

2. **`src/components/navigation/header.tsx`**
   - ❌ Verwijder: `SearchBar` import
   - ✅ Toevoegen: `ProductSearch` import
   - **Actie:** Update naar nieuwe ProductSearch

3. **`src/components/ui/category/category-card.tsx`**
   - ❌ Verwijder: `InputForm` import
   - ✅ Vervangen door: `ProductSearch` of verwijderen helemaal
   - **Status:** Wordt vervangen door CategoryGrid

4. **`src/components/ui/category/products-with-filter.tsx`**
   - ❌ Verwijder: `InputForm` import
   - ✅ Toevoegen: `ProductSearch` import
   - **Actie:** Update naar nieuwe ProductSearch

---

## 🧹 CSS Cleanup

### Te controleren in `globals.css`:
- ✅ Geen custom CSS classes die niet meer gebruikt worden
- ✅ Alle design tokens zijn correct gedefinieerd
- ✅ Geen overbodige utility classes

### Te controleren in componenten:
- ✅ Geen inline styles die vervangen kunnen worden door Tailwind
- ✅ Geen duplicate className definities
- ✅ Consistente gebruik van design tokens

---

## ✅ TypeScript Validation

### Te controleren:
- ✅ Alle imports zijn correct
- ✅ Geen unused imports
- ✅ Geen type errors
- ✅ Alle exports zijn correct

---

## 📊 Cleanup Volgorde

1. **Stap 1:** Verwijder oude carousels (na homepage refactor)
2. **Stap 2:** Verwijder oude product.tsx (na carousel cleanup)
3. **Stap 3:** Verwijder oude product-list.tsx (al gemigreerd)
4. **Stap 4:** Update search components (na header/search upgrade)
5. **Stap 5:** Verwijder oude search components
6. **Stap 6:** Update category components (na category pages migratie)
7. **Stap 7:** Verwijder oude category components
8. **Stap 8:** Verwijder skeleton components
9. **Stap 9:** Run TypeScript validation
10. **Stap 10:** Run linter en fix warnings

---

## ⚠️ Let op

- **NIET verwijderen** voordat alle migraties zijn voltooid
- **Test** elke verwijdering
- **Backup** belangrijke code indien nodig
- **Documenteer** breaking changes

---

## 📝 Status

- ✅ Cleanup plan gemaakt
- ⏳ Wacht op toestemming om cleanup uit te voeren

