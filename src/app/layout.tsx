import Header from "@/components/navigation/header";
import MobileNavbar from "@/components/navigation/mobileNavbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazo Den Haag",
  description: "Welkom bij Lazo Den Haag",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} flex min-h-screen flex-col`}>
        {/* Ensure body takes up full height */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          {/* mobile nav */}
          {/* <main className="flex-grow overflow-auto"> */}
          <main>
            {/* mobile nav */}
            {/* Make main content scrollable */}
            {children}
          </main>
          {/* mobile nav */}
          {/* <MobileNavbar cn={`fixed bottom-0 h-16 bg-black w-full sm:hidden sm:h-auto`} />{" "} */}
          
          {/* mobile nav */}
          {/* Stick to bottom on small screens, otherwise behave normally */}
        </ThemeProvider>
      </body>
    </html>
  );
}
