"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ProductFilters, ProductFiltersProps } from "./product-filters";
import { Button } from "@/components/ui/button";

export interface FilterDrawerProps extends Omit<ProductFiltersProps, "inDrawer" | "onClose"> {
  /**
   * Whether drawer is open
   */
  open: boolean;

  /**
   * Callback when drawer should close
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * FilterDrawer Component
 *
 * Mobile-friendly drawer wrapper for ProductFilters.
 */
export function FilterDrawer({
  open,
  onOpenChange,
  ...filterProps
}: FilterDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <ProductFilters
            {...filterProps}
            inDrawer={true}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

