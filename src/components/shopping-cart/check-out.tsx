import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator, navigateTo } from "@/lib/utils";

const Checkout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [invoicePdf, setInvoicePdf] = useState<string | null>(null);
  const [invoiceFilename, setInvoiceFilename] = useState<string | null>(null);

  const { totalPrice, cartItems, emptyCartItems } = useCartContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  // Calculate VAT at 21%
  const VAT = totalPrice * 0.21;
  const totalPriceWithVAT = totalPrice + VAT;

  const generateInvoice = async () => {
    if (!user?.email) {
      toast.error("Gebruiker niet ingelogd");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, email: user.email }),
      });

      const data = await response.json();

      if (data.success) {
        setInvoicePdf(data.pdfContent);
        setInvoiceFilename(data.filename);
        toast.success("Concept factuur gegenereerd");
      } else {
        console.error("Failed to generate invoice:", data.message);
        toast.error("Fout bij het genereren van de factuur");
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Er is iets misgegaan");
    }
  };

  const viewInvoice = () => {
    if (invoicePdf) {
      const blob = new Blob([Buffer.from(invoicePdf, "base64")], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const downloadInvoice = () => {
    if (invoicePdf && invoiceFilename) {
      const blob = new Blob([Buffer.from(invoicePdf, "base64")], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = invoiceFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCheckout = async () => {
    if (!user?.email) {
      toast.error("Gebruiker niet ingelogd");
      return;
    }

    setIsLoading(true);
    toast.loading("Bestelling plaatsen...");

    try {
      // Fetch user ID by email
      const userIdResponse = await fetch("/api/getUserIdByEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (!userIdResponse.ok) {
        toast.dismiss();
        navigateTo(router, "/winkelwagen/account");
        setIsLoading(false);
        return;
      }

      const { success, userId, adminApprovalStatus } = await userIdResponse.json();

      if (!success) {
        toast.dismiss();
        toast.error("Gebruiker onbekend");
        setIsLoading(false);
        return;
      }

      if (!adminApprovalStatus) {
        toast.dismiss();
        toast.error("Account is nog niet geactiveerd, neem contact op met Lazo");
        setIsLoading(false);
        return;
      }

      // If user is found, attempt to checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cartItems,
          totalPrice: totalPriceWithVAT,
          email: user.email,
        }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.success) {
        toast.success(data.message);
        emptyCartItems();
        navigateTo(router, "/winkelwagen/succes");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Er is iets misgegaan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-[-2rem] w-full max-w-7xl p-8 xl:p-0">
      <div className="flex justify-between text-muted-foreground">
        <h3> Totaalbedrag excl. BTW: </h3>
        <h3 className="mr-2 tracking-wide"> € {formatNumberWithCommaDecimalSeparator(totalPrice)} </h3>
      </div>
      <div className="mb-8 flex justify-between text-muted-foreground">
        <h3> BTW (21%): </h3>
        <h3 className="mr-2 tracking-wide"> € {formatNumberWithCommaDecimalSeparator(VAT)} </h3>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <h3> Totaalbedrag incl. BTW: </h3>
        <h3 className="mr-2 tracking-wide"> € {formatNumberWithCommaDecimalSeparator(totalPriceWithVAT)} </h3>
      </div>
      <div className="mx-auto mt-16 flex w-full items-center justify-center space-x-4">
        {/* Admin only */}
        <Button onClick={generateInvoice} disabled={invoicePdf !== null || !user?.email}>
          Genereer Concept Factuur
        </Button>
        
        {invoicePdf && (
          <>
            <Button onClick={viewInvoice}>Bekijk Factuur</Button>
            <Button onClick={downloadInvoice}>Download Factuur</Button>
          </>
        )}

        <Button type="button" className="btn" onClick={handleCheckout} disabled={!invoicePdf || !user?.email}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Bestelling Plaatsen
        </Button>
      </div>
    </div>
  );
};

export default Checkout;