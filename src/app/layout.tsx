import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter, Montserrat, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazo Spirits Den Haag",
  description: "Welkom bij Lazo Spirits Den Haag",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} flex min-h-screen flex-col text-muted-foreground`}>
        <SessionProvider>
          <CartProvider>
            <ProductProvider type="">
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <AuthProvider>
                  <Toaster />
                  <Header />
                  {/* Main content area that will grow to push the footer to the bottom */}
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </AuthProvider>
              </ThemeProvider>
            </ProductProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
