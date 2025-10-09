"use client";
import SearchBar from "@/components/home/search-bar";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product } from "@/lib/types/product";
import { navigateTo } from "@/lib/utils";
import { CircleX, Fingerprint, MenuIcon, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
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

  // States
  const [currentPath, setCurrentPath] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const pathName = usePathname();

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
        className={`${cn} cart-icon duration-400 relative cursor-pointer border-none bg-transparent text-6xl text-muted-foreground transition-transform ease-in-out`}
        onClick={() => navigateTo(router, "/winkelwagen")}
      >
        <ShoppingBag className="" />
        <span className="absolute right-[-16px] top-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-center text-xs font-semibold text-gray-300">
          <h4>{totalQuantities}</h4>
        </span>
      </button>
    );
  };

  const AdminPage = ({ cn }: { cn?: string }) => {
    return (
      <button
        type="button"
        className={`${cn} cart-icon duration-400 relative cursor-pointer border-none bg-transparent text-6xl text-muted-foreground transition-transform ease-in-out`}
        onClick={() => navigateTo(router, "/admin")}
      >
        <Fingerprint />
      </button>
    );
  };

  const AdminPageNoIcon = ({ cn }: { cn?: string }) => {
    return (
      <li key={cn} className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary`}>
        <Link className={`${roboto.className} tracking-wider`} onClick={() => setMenuOpen(false)} href={"/admin"}>
          <Title name={"Admin"} />
        </Link>
      </li>
    );
  };

  return (
    <>
      <TopHeader text="Let op! Alle prijzen op de website zijn exclusief BTW." />
      <div className={`z-10 w-full items-center justify-between bg-gray-50 text-sm tracking-wide dark:bg-gray-900 sm:flex sm:flex-col lg:flex-row`}>
        <div className="mx-auto mt-0 flex w-full items-center justify-between p-8 sm:mx-16">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              className="mx-auto w-full dark:invert sm:h-36 lg:h-44"
              src="/logo.svg"
              alt="Lazy Den Haag Logo"
              width={300}
              height={300}
              priority
            />
          </Link>
          {/* Hamburger Menu for Small Screens */}
          <button className="flex w-full items-end justify-end pr-4 sm:pr-8 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon size={24} />
          </button>
          {/* Shopping Cart */}
          <ShoppingCart cn={"lg:hidden hover:text-primary"} />
        </div>
        <SearchBar products={products} />

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden ${menuOpen ? "fixed inset-0 z-50 min-h-screen bg-gray-50 dark:bg-gray-900" : "hidden"}`}>
          <div className="flex h-screen flex-col items-center justify-between gap-4">
            <div className="w-screen hover:bg-gray-100 dark:hover:bg-gray-800">
              <CircleX
                onClick={() => setMenuOpen(false)}
                className="h-12 w-full p-2 text-right text-slate-600 hover:cursor-pointer dark:text-gray-400"
              />
            </div>
            <ul className="flex w-screen flex-1 flex-col items-center justify-center gap-8">
              {session && status === "authenticated" && isAdminApproved && <AdminPageNoIcon cn={session.user?.id} />}
              {NAVIGATION_LIST.map((item, index, arr) => (
                <li
                  key={item.order}
                  className={`font-semibold tracking-wide text-slate-700 transition-colors hover:cursor-pointer hover:text-slate-900 dark:text-gray-300 dark:hover:text-white`}
                >
                  <Link
                    className={`${roboto.className} tracking-wider`}
                    onClick={() => setMenuOpen(false)}
                    href={`/${item.title.replace("ë", "e").toLowerCase() === "acties" ? "promoties" : item.title.replace("ë", "e").toLowerCase()}`}
                  >
                    <Title name={item.title} />
                  </Link>
                </li>
              ))}
            </ul>
            <ModeToggle cn="w-full h-12" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="mx-auto hidden items-center justify-center sm:w-full sm:max-w-2xl lg:mr-10 lg:flex">
          <div className="w-full">
            <ul className="mr-8 flex items-baseline justify-end space-x-6 py-12">
              {NAVIGATION_LIST.map((item, index, arr) =>
                item.requiresAuth && !session && item.title.toLowerCase() === "account" ? null : (
                  <li
                    key={item.order}
                    className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary
                    ${
                      index === arr.length - 2
                        ? "mr-8 rounded-md bg-yellow-400 px-3 py-2 text-black transition-colors hover:bg-yellow-500 hover:text-black"
                        : currentPath.toLowerCase() === item.title.replace("ë", "e").toLowerCase()
                          ? "border-b-2 border-slate-900 pb-2 dark:border-white"
                          : item.requiresAuth && !session
                            ? "text-gray-500 hover:cursor-not-allowed"
                            : "text-slate-700 transition-colors hover:text-slate-900 dark:text-gray-300 dark:hover:text-white"
                    }
                  `}
                  >
                    {item.requiresAuth && !session && item.title.toLowerCase() === "account" ? null : (
                      <Link
                        className={`${roboto.className} tracking-wider`}
                        href={`/${item.title.replace("ë", "e").toLowerCase() === "acties" ? "promoties" : item.title.replace("ë", "e").toLowerCase()}`}
                      >
                        {item.requiresAuth && !session ? "" : item.title}
                      </Link>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
          {session && status === "authenticated" && isAdminApproved && <AdminPage cn="hover:text-primary mr-4" />}
          <ModeToggle cn="mr-4" />
          <ShoppingCart cn="mr-10" />
        </div>
      </div>
    </>
  );
};

export default Header;
