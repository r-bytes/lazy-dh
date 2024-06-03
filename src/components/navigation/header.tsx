"use client";

import { useCartContext } from "@/context/CartContext";
import { navigateTo } from "@/lib/utils";
import { CircleX, MenuIcon, ShoppingBag } from "lucide-react";
import { Montserrat, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Title from "../ui/title";
import { ModeToggle } from "../ui/toggle-mode";

// Fonts
const montserrat = Montserrat({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"],
});

// Types
type NavigationItem = {
  order: number;
  title: string;
};

// Props
type Props = {
  navigationList?: NavigationItem[];
};

// Variables
const NAVIGATION_LIST: NavigationItem[] = [
  { title: "Assortiment", order: 0 },
  { title: "Account", order: 1 },
  { title: "Acties", order: 2 },
  { title: "Winkelwagen", order: 3 },
];

const Header = (props: Props) => {
  // Hooks
  const pathName = usePathname();
  const { totalPrice, totalQuantities, cartItems, showCart, setShowCart, incQty, decQty, toggleCartItemQuantity, onRemove } = useCartContext();

  // States
  const [currentPath, setCurrentPath] = useState();
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  // Functions
  const ShoppingCart = ({ cn }: { cn?: string }) => {
    return (
      <button
        type="button"
        className={`${cn} cart-icon duration-400 relative cursor-pointer border-none bg-transparent text-6xl text-muted-foreground transition-transform ease-in-out`}
        onClick={() => navigateTo(router, "/winkelwagen")}
      >
        <ShoppingBag />
        <span className="absolute right-[-16px] top-[-10px] h-5 w-5 rounded-full bg-red-500 text-center text-xs font-semibold text-gray-300">
          {totalQuantities}
        </span>
      </button>
    );
  };
  return (
    <div className="z-10 mx-auto w-full max-w-7xl items-center justify-between font-mono text-sm sm:flex sm:flex-col lg:flex-row">
      <div className="mx-auto mt-0 flex w-full items-center justify-between p-8 sm:mx-16">
        {/* Logo */}
        <Link href={"/"}>
          <Image className="mx-auto dark:invert" src="/logo.svg" alt="Lazy Den Haag Logo" width={300} height={20} priority />
        </Link>
        {/* Hamburger Menu for Small Screens */}
        <button className="flex w-full items-end justify-end pr-4 sm:pr-8 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon size={24} /> {/* Use MenuIcon from Lucid */}
        </button>
        {/* Shopping Cart */}
        <ShoppingCart cn={""} />
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden ${menuOpen ? "fixed inset-0 z-50 bg-zinc-100 dark:bg-black" : "hidden"}`}>
        <div className="flex flex-col gap-4 h-screen justify-between items-center">
          <CircleX
            onClick={() => setMenuOpen(false)}
            className="h-12 w-full border p-2 text-right text-muted-foreground hover:cursor-pointer hover:bg-secondary"
          />
          <ul>
            {NAVIGATION_LIST.map((item, index, arr) => (
              <li key={item.order} className={`hover:text-primary} font-semibold tracking-wide hover:cursor-pointer`}>
                <Link className={roboto.className} onClick={() => setMenuOpen(false)} href={`/${item.title.toLowerCase() === "acties" ? "promoties" : item.title.toLowerCase()}`}>
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
            {NAVIGATION_LIST.map((item, index, arr) => (
              <li
                key={item.order}
                className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary ${index === arr.length - 2 ? "mr-8 rounded-md bg-primary px-3 py-2 text-muted-foreground hover:bg-primary-foreground/30 hover:text-muted-foreground dark:text-background dark:hover:text-primary" : currentPath === item.title.toLocaleLowerCase().replace("/", "") ? "text-secondary" : ""}`}
              >
                <Link className={roboto.className} href={`/${item.title.toLowerCase() === "acties" ? "promoties" : item.title.toLowerCase()}`}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ModeToggle cn="mr-4" />
        <ShoppingCart cn="mr-10" />
      </div>
    </div>
  );
};

export default Header;
