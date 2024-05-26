"use client";
import { usePathname } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollText, HeartIcon, UserIcon } from "lucide-react";
import React, { ComponentType, createElement, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type AccountOptions = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

type IconProps = {
  className?: string;
};

const ACCOUNT: AccountOptions[] = [
  {
    title: "Bestellingen",
    description: "Vorige bestellingen weergeven",
    image: "ScrollText",
    slug: "bestellingen"
  },
  {
    title: "Favorieten",
    description: "Favorieten producten weergeven",
    image: "HeartIcon",
    slug: "favorieten"
  },
  {
    title: "Wachtwoord reset",
    description: "Wachtwoord veranderen",
    image: "UserIcon",
    slug: "wachtwoord-reset"
  },
];

const iconMap: Record<string, ComponentType<IconProps>> = {
  ScrollText: ScrollText,
  HeartIcon: HeartIcon,
  UserIcon: UserIcon,
};

type CardProps = React.ComponentProps<typeof Card>;

export function AccountCard({ className, ...props }: CardProps) {
  const pathname = usePathname();
  return (
      <Card className={cn("flex h-screen w-full flex-col items-center", className)} {...props}>
        <CardHeader className="mb-4 text-center">
          {/* Todo: should be dynamic */}
          <CardTitle className="mt-12">Account</CardTitle>
          {/* Todo: should be dynamic */}
          <CardDescription>Kies een categorie</CardDescription>
        </CardHeader>
        <CardContent className="mt-44 sm:mt-12">
          {ACCOUNT.map((item, index) => (
            <div key={index} className="flex text-center lg:text-left">
              <a
                href={`${pathname}/${item.slug}`}
                className="group w-full rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  <div className="hidden h-24 w-24 object-contain sm:block">
                    {createElement(iconMap[item.image], { className: "h-24 w-16 object-contain" })}
                  </div>
                  <div className="mx-12 flex flex-1 flex-col">
                    <h2 className="mb-3 text-2xl font-semibold">{item.title}</h2>
                    <p className="m-0 text-sm opacity-50">{item.description} producten </p>
                  </div>
                  <span className="hidden text-3xl transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:inline-block">
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
