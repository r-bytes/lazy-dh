import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      Hartelijk dank! Uw bestelling is geplaatst!
      <Link href={"/"}>
        <Button type="button" className="mt-16">
          Ga door met winkelen
        </Button>
      </Link>
    </div>
  );
};

export default page;
