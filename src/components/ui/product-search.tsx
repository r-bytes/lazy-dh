"use client";

import { Input } from "@/components/ui/input";
import { useProductSearch } from "@/hooks/useProductSearch";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./button";

export interface ProductSearchProps {
  /**
   * Products array to search through
   */
  products: Product[];

  /**
   * Placeholder text
   * @default "Zoek producten..."
   */
  placeholder?: string;

  /**
   * Whether to show suggestions dropdown
   * @default true
   */
  showSuggestions?: boolean;

  /**
   * Maximum number of suggestions
   * @default 5
   */
  maxSuggestions?: number;

  /**
   * Callback when search is submitted (Enter or button click)
   */
  onSearch?: (query: string) => void;

  /**
   * Whether to navigate to search results page on submit
   * @default true
   */
  navigateOnSubmit?: boolean;

  /**
   * Search results page path
   * @default "/search-results"
   */
  resultsPath?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Variant: inline (for header) or standalone
   * @default "inline"
   */
  variant?: "inline" | "standalone";
}

/**
 * ProductSearch Component
 *
 * A unified, modern search component with debounced search,
 * suggestions dropdown, keyboard navigation, and mobile-friendly design.
 *
 * @example
 * ```tsx
 * <ProductSearch
 *   products={products}
 *   placeholder="Zoek producten..."
 *   showSuggestions={true}
 *   onSearch={(query) => console.log(query)}
 * />
 * ```
 */
export function ProductSearch({
  products,
  placeholder = "Zoek producten...",
  showSuggestions = true,
  maxSuggestions = 5,
  onSearch,
  navigateOnSubmit = true,
  resultsPath = "/search-results",
  className,
  variant = "inline",
}: ProductSearchProps) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    isSearching,
    clearSearch,
  } = useProductSearch({
    products,
    maxSuggestions,
    minChars: 2,
  });

  // Handle search submission
  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const finalQuery = searchQuery || query;
      if (!finalQuery.trim()) return;

      if (onSearch) {
        onSearch(finalQuery);
      }

      if (navigateOnSubmit) {
        router.push(`${resultsPath}?product=${encodeURIComponent(finalQuery)}`);
      }

      setIsFocused(false);
      setSelectedIndex(-1);
    },
    [query, onSearch, navigateOnSubmit, router, resultsPath]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) {
        if (e.key === "Enter") {
          handleSearch();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            const selectedProduct = suggestions[selectedIndex];
            handleSearch(selectedProduct.name);
          } else {
            handleSearch();
          }
          break;
        case "Escape":
          setIsFocused(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSearch]
  );

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const hasSuggestions = showSuggestions && isSearching && suggestions.length > 0 && isFocused;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Search Input Container */}
      <div
        className={cn(
          "relative flex items-center",
          variant === "standalone" && "rounded-lg border border-input bg-background shadow-sm"
        )}
      >
        {/* Search Icon */}
        <div className={cn(
          "absolute left-3 flex items-center",
          variant === "inline" ? "text-text-secondary" : "text-muted-foreground"
        )}>
          <Search className="h-4 w-4" />
        </div>

        {/* Input */}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          className={cn(
            "w-full",
            variant === "inline" && "border pl-10 bg-transparent text-text-primary placeholder:text-text-secondary shadow-none focus-visible:ring-0",
            variant === "standalone" && "pl-10 pr-10",
            query && "pr-10"
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className={cn(
              "absolute right-3 flex items-center transition-colors",
              variant === "inline" 
                ? "text-text-secondary hover:text-text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search Button (for standalone variant) */}
        {variant === "standalone" && (
          <Button
            type="button"
            onClick={() => handleSearch()}
            className="ml-2"
            size="sm"
          >
            Zoeken
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {hasSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border bg-popover shadow-lg"
          onMouseDown={(e) => e.preventDefault()} // Prevent input blur
        >
          {suggestions.map((product, index) => (
            <button
              key={product._id}
              type="button"
              onClick={() => handleSearch(product.name)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                index === selectedIndex && "bg-accent text-accent-foreground"
              )}
            >
              <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{product.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

