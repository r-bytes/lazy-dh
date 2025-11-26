import AgeVerificationModal from "@/components/age-verification-modal";
import CookieBanner from "@/components/navigation/cookie-banner";
import Footer from "@/components/navigation/footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazo Spirits Den Haag",
  description: "Welkom bij Lazo Spirits Den Haag",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AgeVerificationModal />
      <body className={`${montserrat.className} flex min-h-screen flex-col text-muted-foreground`}>
        <SessionProvider>
          <CartProvider>
            <ProductProvider type="">
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <AuthProvider>
                  <CookieBanner />
                  <Toaster />
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
