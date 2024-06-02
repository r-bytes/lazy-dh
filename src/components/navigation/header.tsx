"use client";

import { useCartContext } from "@/context/CartContext";
import { navigateTo } from "@/lib/utils";
import { MenuIcon, ShoppingBag } from "lucide-react";
import { Montserrat, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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

// Functions

const Header = (props: Props) => {
  // Hooks
  const pathName = usePathname();
  const { totalPrice, totalQuantities, cartItems, showCart, setShowCart, incQty, decQty, toggleCartItemQuantity, onRemove } = useCartContext();

  // States
  const [currentPath, setCurrentPath] = useState();
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <div className="z-10 mx-auto w-full max-w-7xl items-center justify-between font-mono text-sm sm:flex sm:flex-col lg:flex-row">
      <div className="mx-8 mt-12 flex w-full items-center justify-between sm:mx-16">
        {/* Logo */}
        <Link href={"/"}>
          <Image className="mx-auto dark:invert" src="/logo.svg" alt="Lazy Den Haag Logo" width={300} height={20} priority />
        </Link>

        {/* Hamburger Menu for Small Screens */}
        <button className="flex w-full items-end justify-end pr-4 sm:pr-8 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <MenuIcon size={24} /> {/* Use MenuIcon from Lucid */}
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden ${menuOpen ? "block" : "hidden"}`}>
        <ul className="flex flex-col items-start space-y-4 p-4">
          {NAVIGATION_LIST.map((item, index, arr) => (
            <li
              key={item.order}
              className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary ${index === arr.length - 2 ? "rounded-md bg-primary px-3 py-2 text-muted-foreground hover:bg-primary-foreground/30 hover:text-muted-foreground dark:text-background dark:hover:text-primary" : currentPath === item.title.toLocaleLowerCase().replace("/", "") ? "text-secondary" : ""}`}
            >
              <Link className={roboto.className} href={`/${item.title.toLowerCase() === "acties" ? "promoties" : item.title.toLowerCase()}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
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
        <ModeToggle cn="mr-10" />
      </div>
      
      {/* Shopping Cart */}
      <button
        type="button"
        className="cart-icon duration-400 relative cursor-pointer border-none bg-transparent text-6xl text-gray-500 transition-transform ease-in-out"
        onClick={() => navigateTo(router, "/winkelwagen")}
      >
        <ShoppingBag />
        <span className="absolute right-[-16px] top-[-10px] h-5 w-5 rounded-full bg-red-500 text-center text-xs font-semibold text-gray-300">
          {totalQuantities}
        </span>
      </button>
    </div>
  );
};

export default Header;
