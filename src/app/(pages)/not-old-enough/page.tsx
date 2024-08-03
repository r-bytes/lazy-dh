"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotOldEnough: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("https://www.duckduckgo.com"); // Verwijs naar de gewenste URL
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded bg-zinc-800 p-6 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Leeftijdsverificatie</h1>
        <p className="mb-4">U moet 18 jaar of ouder zijn om deze site te bezoeken.</p>
        <p className="mb-4">U wordt doorgestuurd naar een andere site...</p>
        <Button onClick={() => router.push("https://www.duckduckgo.com")} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
          Direct doorsturen
        </Button>
      </div>
    </div>
  );
};

export default NotOldEnough;
