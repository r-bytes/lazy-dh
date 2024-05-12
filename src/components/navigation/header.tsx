import { ModeToggle } from "../ui/toggle-mode";

type NavigationItem = {
  order: number;
  title: string;
};

type Props = {
  navigationList: NavigationItem[];
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
      <div className="border p-12 w-96"> LOGO </div>
      <div className="border w-full">
        <ul className="flex space-x-12 border justify-end py-12">
          {NAVIGATION_LIST.map((item, index, arr) => (
            <li key={item.order} className={`hover:cursor-pointer font-bold tracking-wide ${index === arr.length - 1 ? "pr-8" : ""}`}>
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
