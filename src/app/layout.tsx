import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazo Spirits Den Haag",
  description: "Welkom bij Lazo Spirits Den Haag",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} flex min-h-screen flex-col`}>
        <div>
          <SessionProvider>
            <CartProvider>
              <ProductProvider type="">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <AuthProvider>
                    <Toaster />
                    <Header />
                    <main>{children}</main>
                    <Footer />
                  </AuthProvider>
                </ThemeProvider>
              </ProductProvider>
            </CartProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
