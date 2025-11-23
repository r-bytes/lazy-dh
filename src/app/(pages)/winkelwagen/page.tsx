"use client";

import { useState } from "react";

import Header from "@/components/navigation/header";
import ShoppingCart from "@/components/shopping-cart/shopping-cart";
import { Section } from "@/components/ui/section";
import { Product } from "@/lib/types/product";

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
