import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { formatNumberWithCommaDecimalSeparator, navigateTo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../icons";
import { Button } from "../ui/button";

const Checkout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoicePdf, setInvoicePdf] = useState<string | null>(null);
  const [invoiceFilename, setInvoiceFilename] = useState<string | null>(null);

  const { totalPrice, cartItems, emptyCartItems } = useCartContext();
  const { authorizedEmails } = useAuthContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Calculate VAT at 21%
  const VAT = totalPrice * 0.21;
  const totalPriceWithVAT = totalPrice + VAT;

  // Check if current user is admin
  const isAdmin = session?.user?.email && authorizedEmails.includes(session.user.email);

  const generateInvoice = async () => {
    if (!session?.user?.email) {
      toast.error("Gebruiker niet ingelogd");
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, email: session.user.email }),
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
      const binaryString = atob(invoicePdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  const downloadInvoice = () => {
    if (invoicePdf && invoiceFilename) {
      const binaryString = atob(invoicePdf);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
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
    if (!session?.user?.email) {
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
        body: JSON.stringify({ email: session.user.email }),
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
          email: session.user.email,
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
      <div className="mx-auto mt-16 flex w-full items-center justify-center space-x-4 flex-wrap gap-4">
        {/* Admin only - only show for admins */}
        {isAdmin && (
          <>
            <Button onClick={generateInvoice} disabled={invoicePdf !== null || !session?.user?.email}>
              Genereer Concept Factuur
            </Button>

            {invoicePdf && (
              <>
                <Button onClick={viewInvoice}>Bekijk Factuur</Button>
                <Button onClick={downloadInvoice}>Download Factuur</Button>
              </>
            )}
          </>
        )}

        <Button type="button" className="btn" onClick={handleCheckout} disabled={!session?.user?.email || isLoading}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Bestelling Plaatsen
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
