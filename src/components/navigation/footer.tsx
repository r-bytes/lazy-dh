import React from "react";

type FooterProps = {
  year?: number;
};

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="bg-zinc-900/20 p-4 text-center text-white mt-44">
      <div className="container mx-auto px-4">
        <p className="text-sm sm:text-base">&copy; {year} Lazo Den Haag. All rights reserved.</p>
        <div className="mt-2 flex flex-col justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <a href="/about" className="text-sm hover:underline sm:text-base">
            About Us
          </a>
          <a href="/terms" className="text-sm hover:underline sm:text-base">
            Terms of Service
          </a>
          <a href="/privacy" className="text-sm hover:underline sm:text-base">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
