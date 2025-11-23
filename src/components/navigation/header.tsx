"use client";
import { ProductSearch } from "@/components/ui/product-search";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product } from "@/lib/types/product";
import { cn, navigateTo } from "@/lib/utils";
import { CircleX, Fingerprint, MenuIcon, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Title from "../ui/title";
import { ModeToggle } from "../ui/toggle-mode";
import TopHeader from "./top-header";

// Fonts
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"],
});

// Types
type NavigationItem = {
  order: number;
  title: string;
  requiresAuth?: boolean;
};

// Props
type Props = {
  navigationList?: NavigationItem[];
};

// Variables
const NAVIGATION_LIST: NavigationItem[] = [
  { title: "Categorieën", order: 0 },
  { title: "Account", order: 1, requiresAuth: false },
  { title: "Acties", order: 2 },
  // { title: "Winkelwagen", order: 3 },
];

const Header = (props: Props) => {
  // Hooks
  const { data: session, status } = useSession();
  const { isAdminApproved } = useAuthContext();
  const { totalQuantities } = useCartContext();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();

  // States
  const [currentPath, setCurrentPath] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const pathName = usePathname();

  // Determine which logo to use
  const isDarkMode = resolvedTheme === "dark" || (resolvedTheme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const logoSrc = isDarkMode ? "/logo-darkmode.png" : "/logo.png";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPath(pathName.replace("/", ""));
  }, [pathName]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    fetchData();
  }, []);

  // Functions
  const ShoppingCart = ({ cn }: { cn?: string }) => {
    return (
      <button
        type="button"
        className={`${cn} relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface/10`}
        onClick={() => navigateTo(router, "/winkelwagen")}
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
        {totalQuantities > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white sm:h-6 sm:w-6 sm:text-xs">
            {totalQuantities}
          </span>
        )}
      </button>
    );
  };

  const AdminPage = ({ cn }: { cn?: string }) => {
    return (
      <button
        type="button"
        className={`${cn} flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-surface/10`}
        onClick={() => navigateTo(router, "/admin")}
        aria-label="Admin panel"
      >
        <Fingerprint className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    );
  };


  return (
    <>
      <TopHeader text="Let op! Alle prijzen op de website zijn exclusief BTW." />
      <header className="w-full bg-transparent py-3 sm:py-4 md:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between gap-3 sm:hidden">
            {/* Logo */}
            <Link href={"/"} className="flex-shrink-0">
              {mounted && (
                <Image
                  className={cn("h-auto max-h-[50px] w-auto")}
                  src={logoSrc}
                  alt="Lazy Den Haag Logo"
                  width={120}
                  height={50}
                  priority
                />
              )}
            </Link>
            {/* Hamburger Menu & Cart */}
            <div className="flex items-center gap-3">
              <ShoppingCart cn="text-text-primary hover:text-text-secondary" />
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-surface/10 hover:text-text-secondary"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <MenuIcon size={20} />
              </button>
            </div>
          </div>

          {/* Tablet/Desktop Layout */}
          <div className="hidden items-center justify-between gap-4 sm:flex lg:gap-6 xl:gap-8">
            {/* Logo */}
            <Link href={"/"} className="flex-shrink-0">
              {mounted && (
                <Image
                  className={cn("h-auto w-24 transition-opacity sm:w-28 lg:w-32", !isDarkMode && "opacity-80 brightness-110")}
                  src={logoSrc}
                  alt="Lazy Den Haag Logo"
                  width={128}
                  height={64}
                  priority
                />
              )}
            </Link>

            {/* Search Bar - Vertically Centered */}
            <div className="flex-1 max-w-xl lg:max-w-2xl">
              <ProductSearch products={products} variant="inline" />
            </div>

            {/* Desktop Navigation & Actions */}
            <div className="hidden items-center gap-3 lg:flex lg:gap-4">
              <div className="flex items-center gap-4 xl:gap-6">
                {NAVIGATION_LIST.map((item, index, arr) =>
                  item.requiresAuth && !session && item.title.toLowerCase() === "account" ? null : (
                    <Link
                      key={item.order}
                      href={`/${item.title.replace("ë", "e").toLowerCase() === "acties" ? "promoties" : item.title.replace("ë", "e").toLowerCase()}`}
                      className={`${roboto.className} whitespace-nowrap text-sm font-semibold tracking-wide text-text-primary transition-colors hover:text-text-secondary xl:text-base
                        ${
                          index === arr.length - 2
                            ? "rounded-md bg-accent-yellow px-3 py-2 text-text-primary transition-colors hover:bg-accent-yellow-dark"
                            : currentPath.toLowerCase() === item.title.replace("ë", "e").toLowerCase()
                              ? "border-b-2 border-border pb-2"
                              : item.requiresAuth && !session
                                ? "text-text-secondary hover:cursor-not-allowed"
                                : ""
                        }
                      `}
                    >
                      {item.requiresAuth && !session ? "" : item.title}
                    </Link>
                  )
                )}
              </div>
              {session && status === "authenticated" && isAdminApproved && (
                <AdminPage cn="text-text-primary hover:text-text-secondary" />
              )}
              <ModeToggle cn="" />
              <ShoppingCart cn="text-text-primary hover:text-text-secondary" />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-3 w-full sm:hidden">
            <ProductSearch products={products} variant="inline" />
          </div>
          <div className="hidden w-full sm:block lg:hidden">
            <ProductSearch products={products} variant="inline" />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-[9999] min-h-screen bg-background-alt sm:hidden">
            <div className="flex h-screen flex-col">
              {/* Close Button */}
              <div className="flex items-center justify-end p-4">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface/10 text-text-primary transition-colors hover:bg-surface/20"
                  aria-label="Close menu"
                >
                  <CircleX size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-1 flex-col items-center justify-center gap-6">
                {session && status === "authenticated" && isAdminApproved && (
                  <Link
                    className={`${roboto.className} font-semibold tracking-wide text-text-primary transition-colors hover:text-text-secondary`}
                    onClick={() => setMenuOpen(false)}
                    href="/admin"
                  >
                    Admin
                  </Link>
                )}
                {NAVIGATION_LIST.map((item) => (
                  <Link
                    key={item.order}
                    className={`${roboto.className} font-semibold tracking-wide text-text-primary transition-colors hover:text-text-secondary`}
                    onClick={() => setMenuOpen(false)}
                    href={`/${item.title.replace("ë", "e").toLowerCase() === "acties" ? "promoties" : item.title.replace("ë", "e").toLowerCase()}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Mode Toggle */}
              <div className="border-t border-border p-4">
                <ModeToggle cn="w-full" />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
