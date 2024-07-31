"use client";
import React, { ComponentType, createElement, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HeartIcon, ScrollText, UserIcon, LogOutIcon } from "lucide-react";

type AccountOptions = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

type IconProps = {
  className?: string;
};

// todo: make dynamic + implement favorite
const ACCOUNT: AccountOptions[] = [
  // {
  //   title: "Bestellingen",
  //   description: "Vorige bestellingen weergeven",
  //   image: "ScrollText",
  //   slug: "bestellingen",
  // },
  // {
  //   title: "Favorieten",
  //   description: "Favorieten producten weergeven",
  //   image: "HeartIcon",
  //   slug: "favorieten",
  // },
  {
    title: "Wachtwoord reset",
    description: "Wachtwoord veranderen",
    image: "UserIcon",
    slug: "reset-password",
  },
  {
    title: "Uitloggen",
    description: "Gebruiker uitloggen",
    image: "LogOutIcon",
    slug: "uitloggen",
  },
];

const iconMap: Record<string, ComponentType<IconProps>> = {
  ScrollText: ScrollText,
  HeartIcon: HeartIcon,
  UserIcon: UserIcon,
  LogOutIcon: LogOutIcon,
};

type CardProps = React.ComponentProps<typeof Card>;

export function AccountCard({ className, ...props }: CardProps) {
  const router = useRouter();

  const handleLogoff = useCallback(() => {
    signOut(); // or whatever function you use for logging out
  }, []);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <CardTitle className="mt-12 text-4xl md:text-5xl"> Account </CardTitle>
        <CardDescription> Kies een categorie </CardDescription>
      </CardHeader>
      <CardContent className="mt-12 flex flex-col justify-center sm:mx-16 lg:mx-2">
        {ACCOUNT.map((item, index) => (
          <div key={index} className="flex text-center lg:text-left">
            {item.slug === "uitloggen" ? (
              <button
                onClick={handleLogoff}
                className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              >
                <AccountOptionContent item={item} />
              </button>
            ) : (
              <a
                href={`/${item.slug}`}
                className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              >
                <AccountOptionContent item={item} />
              </a>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AccountOptionContent({ item }: { item: AccountOptions }) {
  return (
    <div className="flex items-center p-4">
      <div className="hidden h-24 w-24 object-contain sm:block">
        {createElement(iconMap[item.image], { className: "h-24 w-16 object-contain" })}
      </div>
      <div className="flex flex-1 flex-col text-left sm:text-center">
        <h2 className="text-md mb-3 font-semibold sm:text-lg md:text-2xl">{item.title}</h2>
        <p className="m-0 text-sm opacity-50">{item.description}</p>
      </div>
      <span className="inline-block text-3xl transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&#x279C;</span>
    </div>
  );
}