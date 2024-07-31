"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="my-24 flex flex-col items-center justify-center space-y-4 text-center">
      <Mail />
      <h1 className="text-lg font-bold">Check je email</h1>
      <h3 className="text-muted-foreground">We hebben een bevestigings email gestuurd naar {}</h3>
      <Button>
        <Link href={"/"}>Ga naar home</Link>
      </Button>
    </div>
  );
};

export default page;
