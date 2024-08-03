import React from "react";

type FooterProps = {
  year?: number;
};

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="mt-24 bg-zinc-900/90 pt-4 text-center font-normal tracking-wide text-primary">
      <div className="mx-auto px-1">
        <div className="pt-4 grid grid-cols-2 grid-rows-2 sm:grid-cols-3 md:grid-cols-4 justify-center max-w-4xl mx-auto">
          <a href="/algemene-voorwaarden" className="text-sm hover:underline sm:text-base min-w-fit">
            Algemene voorwaarden
          </a>
          <a href="/privacy-beleid" className="text-sm hover:underline sm:text-base">
            Privacy Beleid
          </a>
          <a href="/over-ons" className="text-sm hover:underline sm:text-base">
            Over ons
          </a>
          <a href="/contact" className="text-sm hover:underline sm:text-base">
            Contact
          </a>
        </div>
        <p className="text-sm sm:text-xs pb-6 pt-4">
          &copy; {year} {process.env.COMPANY_NAME!}. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
