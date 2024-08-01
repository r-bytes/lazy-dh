"use client";
import { updateUserActivity } from "@/actions/users/user.actions";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HeartIcon, LogOutIcon, ScrollText, UserIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ComponentType, createElement, useCallback } from "react";
import Title from "../title";

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

interface AccountCardProps extends React.ComponentProps<typeof Card> {
  className?: string;
  session?: Session;
}

export function AccountCard({ className, session, ...props }: AccountCardProps) {
  const router = useRouter();

  const handleLogoff = useCallback(() => {
    if (session) {
      updateUserActivity(session.user!.email!, "logoff", "successfully");
    }

    signOut();
  }, [session]);

  return (
    <Card className={cn("w-full text-muted-foreground", className)} {...props}>
      <CardHeader className="mb-4 text-center">
        <span className="text-center text-xs text-muted-foreground sm:text-right"> Ingelogd als: {session?.user?.email}</span>
        <Title name="Account" cn="pt-6" />
        <CardDescription className="md:text-base"> Kies een categorie </CardDescription>
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
                href={`/account/${item.slug}`}
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
