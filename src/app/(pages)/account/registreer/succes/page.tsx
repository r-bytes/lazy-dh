"use client";

import { Button } from "@/components/ui/button";
import { navigateTo } from "@/lib/utils";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center min-h-full my-24">
      <Mail />
      <h1 className="text-lg font-bold">Check je email</h1>
      <h3 className="text-muted-foreground">We hebben een bevestigings email gestuurd naar {}</h3>
      <Button onClick={() => navigateTo(router, "/")}> Ga naar home </Button>
    </div>
  );
};

export default page;
