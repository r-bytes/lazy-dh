import Header from "@/components/navigation/header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { auth } from "../../auth";
import CheckAuth from "./check-auth.server";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazo Den Haag",
  description: "Welkom bij Lazo Den Haag",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // const session = await auth();
  const isAuthenticated = await auth();

  // Conditionally render children based on authentication status
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} flex min-h-screen flex-col`}>
        {!isAuthenticated && <CheckAuth />}
        <div>
          <CartProvider>
            <ProductProvider type="">
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <Toaster />
                {isAuthenticated && <Header />}
                <main>{children}</main>
              </ThemeProvider>
            </ProductProvider>
          </CartProvider>
        </div>
      </body>
    </html>
  );
  // return (
  //   <html lang="en" suppressHydrationWarning>
  //     <body className={`${montserrat.className} flex min-h-screen flex-col`}>
  //       {/* Ensure body takes up full height */}
  //       {/* Todo: delete later? */}
  //       {/* <AuthProvider> */}
  //       <CartProvider>
  //         <ProductProvider type="">
  //           <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  //             <Toaster />

  //             {/* <Header /> */}
  //             <main>{children}</main>
  //           </ThemeProvider>
  //         </ProductProvider>
  //       </CartProvider>
  //       {/* </AuthProvider> */}
  //     </body>
  //   </html>
  // );
}
