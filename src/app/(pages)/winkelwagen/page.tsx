"use client";

import { useState } from "react";

import Header from "@/components/navigation/header";
import ShoppingCart from "@/components/shopping-cart/shopping-cart";
import { Section } from "@/components/ui/section";
import { Product } from "@/lib/types/product";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

// Note: This is a client component, so metadata must be exported from a parent layout or page
// For now, we'll add it via a parent layout if needed

export default function Page() {
  return (
    <>
      {/* Header */}
      <div className="bg-hero-light dark:bg-hero-dark">
        <Header />
      </div>
      <Section variant="default" spacing="lg">
        <ShoppingCart />
      </Section>
    </>
  );
}
