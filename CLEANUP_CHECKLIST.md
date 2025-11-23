# FASE 8 — Cleanup Checklist

## 📋 Cleanup Taken

### ✅ Bestanden die VERWIJDERD kunnen worden (na migraties):

#### Oude Carousel Componenten
- [ ] `src/components/products/modern-carousel.tsx`
  - **Vervangen door:** `ProductCarousel` variant="default"
  - **Gebruikt in:** `src/app/page.tsx` (regel 1, 103)

- [ ] `src/components/products/slide-carousel.tsx`
  - **Vervangen door:** `ProductCarousel` variant="minimal"
  - **Gebruikt in:** `src/app/page.tsx` (regel 2, 130)

#### Oude Product Component
- [ ] `src/components/products/product.tsx`
  - **Vervangen door:** `ProductCard` + `ProductDialog`
  - **Gebruikt in:** Alleen in oude carousels

#### Oude Product List Component
- [ ] `src/components/products/product-list.tsx`
  - **Vervangen door:** `ProductGrid`
  - **Status:** Al gemigreerd, kan verwijderd worden

#### Oude Search Componenten
- [ ] `src/components/home/search-bar.tsx`
  - **Vervangen door:** `ProductSearch`
  - **Gebruikt in:** `src/components/navigation/header.tsx`

- [ ] `src/components/ui/category/search-input.tsx`
  - **Vervangen door:** `ProductSearch`
  - **Gebruikt in:** `category-card.tsx`, `products-with-filter.tsx`

#### Oude Category Componenten
- [ ] `src/components/ui/category/category-card.tsx`
  - **Vervangen door:** `CategoryGrid`
  - **Gebruikt in:** `page.tsx`, `categorieen/page.tsx`

- [ ] `src/components/products/category-skeleton.tsx`
  - **Vervangen door:** `CategoryGridSkeleton`
  - **Gebruikt in:** `category-card.tsx`

- [ ] `src/components/products/input-form-skeleton.tsx`
  - **Niet meer nodig**
  - **Gebruikt in:** `category-skeleton.tsx`

#### Oude Skeleton Component
- [ ] `src/components/products/product-skeleton.tsx`
  - **Vervangen door:** `ProductCardSkeleton`
  - **Gebruikt in:** `product-list.tsx`

---

### 🔄 Imports die GEÜPDATET moeten worden:

#### `src/app/page.tsx`
- [ ] Verwijder: `ModernCarousel`, `SlideCarousel`, `CategoryCard`
- [ ] Toevoegen: `ProductCarousel`, `CategoryGrid`, `HeroSection`, `Section`, `SectionHeader`
- [ ] **Actie:** Vervang met `page-refactored.tsx` inhoud

#### `src/components/navigation/header.tsx`
- [ ] Verwijder: `SearchBar` import
- [ ] Toevoegen: `ProductSearch` import
- [ ] Update search bar implementatie

#### `src/components/ui/category/products-with-filter.tsx`
- [ ] Verwijder: `InputForm` import
- [ ] Toevoegen: `ProductSearch` import
- [ ] Update search implementatie

---

### 🧹 CSS & Styling Cleanup

- [ ] Check `globals.css` voor unused classes
- [ ] Verwijder duplicate utility classes
- [ ] Verifieer alle design tokens worden gebruikt
- [ ] Check voor inline styles die Tailwind kunnen worden

---

### ✅ TypeScript Validation

- [ ] Run `npm run build` of `yarn build`
- [ ] Check voor type errors
- [ ] Verifieer alle imports
- [ ] Check voor unused imports
- [ ] Run linter: `npm run lint`

---

## 📊 Cleanup Volgorde

1. ✅ **Cleanup plan gemaakt**
2. ⏳ **Wacht op toestemming om cleanup uit te voeren**

---

## ⚠️ Belangrijk

- **NIET verwijderen** voordat alle migraties zijn voltooid
- **Test** elke verwijdering in development
- **Commit** na elke stap voor rollback mogelijkheid

