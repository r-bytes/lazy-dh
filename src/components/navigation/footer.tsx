import Image from "next/image";
import React from "react";

type FooterProps = {
  year?: number;
};

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="mt-24 relative h-48">
        <Image
          src="/image.webp"
          alt="Hero image"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div className="bg-black bg-opacity-70 backdrop-blur-3xl h-48 flex items-center flex-col justify-center text-white/70">
          <div className="flex gap-4 max-w-5xl w-full justify-evenly flex-wrap">
            <a href="/algemene-voorwaarden" className="text-sm hover:text-primary-hover transition-colors duration-200 hover:underline hover:scale-105 transform">
              Algemene voorwaarden
            </a>
            <a href="/privacy-beleid" className="text-sm hover:text-primary-hover transition-colors duration-200 hover:underline hover:scale-105 transform">
              Privacy Beleid
            </a>
            <a href="/over-ons" className="text-sm hover:text-primary-hover transition-colors duration-200 hover:underline hover:scale-105 transform">
              Over ons
            </a>
            <a href="/contact" className="text-sm hover:text-primary-hover transition-colors duration-200 hover:underline hover:scale-105 transform">
              Contact
            </a>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm">
              &copy; {year} {process.env.COMPANY_NAME}. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
