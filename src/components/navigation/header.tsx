"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
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
  { title: "Winkelwagen", order: 3 },
];

const Header = (props: Props) => {
  // Hooks
  const { data: session, status } = useSession();
  const { totalQuantities } = useCartContext();
  const { authorizedEmails } = useAuthContext();
  const router = useRouter();

  // States
  const [currentPath, setCurrentPath] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    setCurrentPath(pathName.replace("/", ""));
  }, [pathName]);

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
      <div className={`z-10 mx-auto w-full max-w-7xl items-center justify-between text-sm tracking-wide sm:flex sm:flex-col lg:flex-row`}>
        <div className="mx-auto mt-0 flex w-full items-center justify-between p-8 sm:mx-16">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              className="mx-auto w-full dark:invert sm:h-52 lg:h-60"
              src="/logo.svg"
              alt="Lazy Den Haag Logo"
              width={300}
              height={20}
              priority
            />
          </Link>
          {/* Hamburger Menu for Small Screens */}
          <button className="flex w-full items-end justify-end pr-4 sm:pr-8 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon size={24} /> {/* Use MenuIcon from Lucid */}
          </button>
          {/* Shopping Cart */}
          <ShoppingCart cn={"lg:hidden hover:text-primary"} />
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden ${menuOpen ? "fixed inset-0 z-50 min-h-screen bg-zinc-100 dark:bg-black" : "hidden"}`}>
          <div className="flex h-screen flex-col items-center justify-between gap-4">
            <div className="w-screen hover:bg-zinc-200 dark:hover:bg-zinc-900">
              <CircleX onClick={() => setMenuOpen(false)} className="h-12 w-full p-2 text-right text-muted-foreground hover:cursor-pointer" />
            </div>
            <ul className="flex w-screen flex-1 flex-col items-center justify-center gap-8">
              {session && status === "authenticated" && authorizedEmails.includes(session.user?.email!) && <AdminPageNoIcon cn={session.user?.id} />}
              {NAVIGATION_LIST.map((item, index, arr) => (
                <li key={item.order} className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary`}>
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
                        ? "text-tertiary mr-8 rounded-md bg-primary px-3 py-2 hover:scale-105 hover:text-secondary-foreground dark:text-background dark:hover:bg-primary-foreground/30 dark:hover:text-primary"
                        : currentPath.toLowerCase() === item.title.replace("ë", "e").toLowerCase()
                          ? "border-b-2 border-primary pb-2"
                          : item.requiresAuth && !session
                            ? "text-gray-500 hover:cursor-not-allowed"
                            : ""
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
          {session && status === "authenticated" && authorizedEmails.includes(session.user?.email!) && <AdminPage cn="hover:text-primary mr-4" />}
          <ModeToggle cn="mr-4" />
          <ShoppingCart cn="mr-10" />
        </div>
      </div>
    </>
  );
};

export default Header;
