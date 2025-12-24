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

  // Calculate statiegeld (deposit) for tray products
  const totalStatiegeld = cartItems.reduce((sum, item) => {
    if (item.tray && item.statiegeld && item.quantityInBox) {
      // Statiegeld per doos = statiegeld per stuk * quantityInBox
      const statiegeldPerDoos = item.statiegeld * item.quantityInBox;
      return sum + (statiegeldPerDoos * item.quantity);
    }
    return sum;
  }, 0);

  // Calculate VAT at 21%
  const VAT = totalPrice * 0.21;
  const totalPriceWithVAT = totalPrice + VAT + totalStatiegeld;

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
      {totalStatiegeld > 0 && (
        <div className="mb-8 flex justify-between text-muted-foreground">
          <h3> Statiegeld: </h3>
          <h3 className="mr-2 tracking-wide"> € {formatNumberWithCommaDecimalSeparator(totalStatiegeld)} </h3>
        </div>
      )}
      <div className="flex justify-between text-muted-foreground">
        <h3> Totaalbedrag incl. BTW: </h3>
        <h3 className="mr-2 tracking-wide"> € {formatNumberWithCommaDecimalSeparator(totalPriceWithVAT)} </h3>
      </div>
      
      {/* Warning alert for orders under €1200 excl. VAT */}
      {totalPrice < 1200 && (
        <div className="mt-8 rounded-lg border-2 border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                LET OP! Minimale bestelwaarde voor levering is € 1.200,00 excl. BTW
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  Bestellingen onder <strong>€ 1.200,00 excl. BTW</strong> worden <strong>NIET</strong> geleverd. 
                  Uw bestelling bedraagt momenteel <strong>€ {formatNumberWithCommaDecimalSeparator(totalPrice)} excl. BTW</strong>.
                </p>
                <p className="mt-2">
                  Voeg meer producten toe aan uw winkelwagen om de minimale bestelwaarde te bereiken.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

        <Button 
          type="button" 
          className="btn" 
          onClick={handleCheckout} 
          disabled={!session?.user?.email || isLoading || totalPrice < 1200}
        >
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.logo className="mr-2 h-4 w-4" />}
          Bestelling Plaatsen
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
