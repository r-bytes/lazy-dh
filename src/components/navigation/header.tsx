import Image from "next/image";
import { ModeToggle } from "../ui/toggle-mode";

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
    <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:invert"
          src="/logo.svg"
          alt="Next.js Logo"
          width={300}
          height={20}
          priority
        />
      </div>
      <div className="w-full">
        <ul className="flex space-x-12 justify-end py-12">
          {NAVIGATION_LIST.map((item, index, arr) => (
            <li key={item.order} className={`hover:cursor-pointer hover:text-primary font-bold tracking-wide ${index === arr.length - 1 ? "pr-8" : ""}`}>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="w-4"></div> */}
      <ModeToggle />
    </div>
  );
};

export default Header;
