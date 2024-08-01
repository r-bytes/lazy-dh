import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mt-48">Hartelijk dank! Uw bestelling is geplaatst!</p>
      <Link href={"/"}>
        <Button type="button" className="mt-16">
          Ga door met winkelen
        </Button>
      </Link>
    </div>
  );
};

export default page;
