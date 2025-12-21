"use client";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import withAuth from "@/hoc/withAuth";
import { BarChart3, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

const AdminPage: React.FC = () => {
  return (
    <MaxWidthWrapper className="mx-auto flex flex-col p-8 md:p-12 lg:p-20">
      <Title name="Beheer pagina" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/dashboard"
          className="group flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center transition-all hover:shadow-lg"
        >
          <BarChart3 className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold">Dashboard</h3>
          <p className="mt-2 text-sm text-muted-foreground">Overzicht van klanten, bestellingen en statistieken</p>
        </Link>
        <Link
          href="/admin/accounts"
          className="group flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center transition-all hover:shadow-lg"
        >
          <Users className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold">Accounts beheren</h3>
          <p className="mt-2 text-sm text-muted-foreground">Beheer gebruikersaccounts en goedkeuringen</p>
        </Link>
        <Link
          href="/admin/bestellingen"
          className="group flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center transition-all hover:shadow-lg"
        >
          <ShoppingCart className="mb-4 h-12 w-12 text-primary transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold">Bestellingen beheren</h3>
          <p className="mt-2 text-sm text-muted-foreground">Bekijk en beheer alle bestellingen</p>
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default withAuth(AdminPage);
