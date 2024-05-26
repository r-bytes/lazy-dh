"use client"

import { Montserrat, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../ui/toggle-mode";
import { useState } from "react";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"],
});

type NavigationItem = {
  order: number;
  title: string;
};

type Props = {
  navigationList?: NavigationItem[];
};

const NAVIGATION_LIST: NavigationItem[] = [
  { title: "Assortiment", order: 0 },
  { title: "Account", order: 1 },
  { title: "Acties", order: 2 },
  { title: "Winkelwagen", order: 3 },
];

const Header = (props: Props) => {
  const [currentPath, setCurrentPath] = useState()
  const pathName = usePathname()
  
  return (
    <div className="z-10 mx-auto hidden w-full max-w-7xl items-center justify-between font-mono text-sm sm:flex sm:flex-col lg:flex-row">
      <Image className="dark:invert" src="/logo.svg" alt="Next.js Logo" width={300} height={20} priority />

      <div className="flex items-center justify-center sm:w-full sm:max-w-2xl mx-auto lg:mr-10">
        <div className="w-full">
          <ul className="mr-8 flex items-baseline justify-end space-x-6 py-12">
            {NAVIGATION_LIST.map((item, index, arr) => (
              <li
                key={item.order}
                className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary ${index === arr.length - 2 ? "mr-8 rounded-md bg-primary px-3 py-2 text-muted-foreground hover:bg-primary-foreground/30 hover:text-muted-foreground dark:text-background dark:hover:text-primary" : currentPath === item.title.toLocaleLowerCase().replace("/", "") ? "text-secondary" : ""}`}
              >
                <Link
                  className={roboto.className}
                  href={`/${item.title.toLowerCase() === "acties" ? "promoties" : item.title.toLowerCase()}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ModeToggle cn="mr-10" />
      </div>
    </div>
  );
};

export default Header;
