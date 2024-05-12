import { Montserrat, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../ui/toggle-mode";

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
  { title: "Winkelwagen", order: 2 },
  { title: "Acties", order: 3 },
];

const Header = (props: Props) => {
  return (
    <div className={"z-10 mx-auto w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex"}>
      <div className="before:bg-gradient-radial relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image className="relative dark:invert" src="/logo.svg" alt="Next.js Logo" width={300} height={20} priority />
      </div>

      <div className="w-full">
        <ul className="mr-8 flex items-baseline justify-end space-x-12 py-12">
          {NAVIGATION_LIST.map((item, index, arr) => (
            <li
              key={item.order}
              className={`font-semibold tracking-wide hover:cursor-pointer hover:text-primary ${index === arr.length - 1 ? "mr-8 rounded-md bg-primary px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-muted-foreground dark:hover:text-primary dark:text-background" : ""}`}
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
      <ModeToggle />
    </div>
  );
};

export default Header;
