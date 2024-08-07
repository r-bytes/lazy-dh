"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import withAuth from "@/hoc/withAuth";
import Link from "next/link";

const AdminPage: React.FC = () => {
  return (
    <MaxWidthWrapper className="mx-auto flex flex-col">
      <Title name="Beheer pagina" />
      <div className="mt-12 flex list-disc flex-col items-center justify-center space-y-4 text-left">
        <div>
          <Link href="/admin/accounts" className="text-2xl hover:underline">
            Accounts beheren
          </Link>
        </div>
        <div>
          <Link href="/admin/bestellingen" className="text-2xl hover:underline">
            Bestellingen beheren
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default withAuth(AdminPage);
