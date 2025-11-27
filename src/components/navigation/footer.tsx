import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

type FooterProps = {
  year?: number;
};

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="bg-surface text-text-primary">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LAZO DEN HAAG SPIRITS</h3>
            <p className="text-sm text-text-secondary">
              Authentieke smaken uit Griekenland & Bulgarije. Premium spirits direct geïmporteerd voor de beste kwaliteit.
            </p>
            <div className="flex justify-center space-x-4 md:justify-start">
              <Facebook className="h-5 w-5 cursor-pointer text-text-secondary transition-colors hover:text-text-primary" />
              <Instagram className="h-5 w-5 cursor-pointer text-text-secondary transition-colors hover:text-text-primary" />
              <Twitter className="h-5 w-5 cursor-pointer text-text-secondary transition-colors hover:text-text-primary" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Snelle Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categorieen" className="text-text-secondary transition-colors hover:text-text-primary">
                  Categorieën
                </Link>
              </li>
              <li>
                <Link href="/nieuwe-producten" className="text-text-secondary transition-colors hover:text-text-primary">
                  Nieuwe Producten
                </Link>
              </li>
              <li>
                <Link href="/promoties" className="text-text-secondary transition-colors hover:text-text-primary">
                  Aanbiedingen
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-text-secondary transition-colors hover:text-text-primary">
                  Over Ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Klantenservice</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-text-secondary transition-colors hover:text-text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="text-text-secondary transition-colors hover:text-text-primary">
                  Veelgestelde Vragen
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-text-secondary transition-colors hover:text-text-primary">
                  Mijn Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Mail className="h-4 w-4 flex-shrink-0 text-text-secondary" />
                <span className="text-text-secondary">info@lazo-spirits.nl</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Phone className="h-4 w-4 flex-shrink-0 text-text-secondary" />
                <span className="text-text-secondary">+31 70 123 4567</span>
              </div>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <MapPin className="h-4 w-4 flex-shrink-0 text-text-secondary" />
                <span className="text-text-secondary">Den Haag, Nederland</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center md:flex-row md:justify-between md:space-y-0 md:text-left">
            <div className="flex flex-wrap justify-center gap-4 text-sm md:gap-6">
              <Link href="/algemene-voorwaarden" className="text-text-secondary transition-colors hover:text-text-primary">
                Algemene Voorwaarden
              </Link>
              <Link href="/privacy-beleid" className="text-text-secondary transition-colors hover:text-text-primary">
                Privacy Beleid
              </Link>
              <Link href="/cookies" className="text-text-secondary transition-colors hover:text-text-primary">
                Cookie Beleid
              </Link>
            </div>
            <p className="text-sm text-text-secondary">© {year} Lazo Den Haag Spirits B.V. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
