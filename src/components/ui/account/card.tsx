import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollText, HeartIcon, UserIcon } from "lucide-react";
import React, { ComponentType, createElement } from "react";

type AccountOptions = {
  title: string;
  description: string;
  image: string;
};

type IconProps = {
  className?: string;
};

const ACCOUNT: AccountOptions[] = [
  {
    title: "Bestellingen",
    description: "Vorige bestellingen weergeven",
    image: "ScrollText",
  },
  {
    title: "Favorieten",
    description: "Favorieten producten weergeven",
    image: "HeartIcon",
  },
  {
    title: "Wachtwoord reset",
    description: "Wachtwoord veranderen",
    image: "UserIcon",
  },
];

const iconMap: Record<string, ComponentType<IconProps>> = {
  ScrollText: ScrollText,
  HeartIcon: HeartIcon,
  UserIcon: UserIcon,
};

type CardProps = React.ComponentProps<typeof Card>;

export function AccountCard({ className, ...props }: CardProps) {
  return (
    <Card className={cn("h-screen w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        {/* Todo: should be dynamic */}
        <CardTitle className="mt-12">Account</CardTitle>
        {/* Todo: should be dynamic */}
        <CardDescription>Kies een categorie</CardDescription>
      </CardHeader>
      <CardContent className="mt-12 grid place-content-center gap-4">
        {ACCOUNT.map((item, index) => (
          <div key={index} className="grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            <a
              href=""
              className="group w-screen max-w-5xl rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                <div className="h-24 mr-6">{createElement(iconMap[item.image], { className: "h-24 w-16 object-contain" })}</div>
                <div className="mx-12 flex flex-1 flex-col">
                  <h2 className="mb-3 text-2xl font-semibold">{item.title}</h2>
                  <p className="m-0 max-w-[30ch] text-sm opacity-50">{item.description} producten </p>
                </div>
                <span className="inline-block text-3xl transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  &#x279C;
                </span>
              </div>
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
