import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

type FooterProps = {
  year?: number;
};

const Footer: React.FC<FooterProps> = ({ year = new Date().getFullYear() }) => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">LAZO DEN HAAG SPIRITS</h3>
            <p className="text-sm text-slate-300">
              Authentieke smaken uit Griekenland & Bulgarije. Premium spirits direct geïmporteerd voor de beste kwaliteit.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-white" />
              <Instagram className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-white" />
              <Twitter className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-white" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Snelle Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categorieen" className="text-slate-300 transition-colors hover:text-white">
                  Categorieën
                </Link>
              </li>
              <li>
                <Link href="/nieuwe-producten" className="text-slate-300 transition-colors hover:text-white">
                  Nieuwe Producten
                </Link>
              </li>
              <li>
                <Link href="/promoties" className="text-slate-300 transition-colors hover:text-white">
                  Aanbiedingen
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="text-slate-300 transition-colors hover:text-white">
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
                <Link href="/contact" className="text-slate-300 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="text-slate-300 transition-colors hover:text-white">
                  Veelgestelde Vragen
                </Link>
              </li>
              <li>
                <Link href="/verzending" className="text-slate-300 transition-colors hover:text-white">
                  Verzending & Retour
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-300 transition-colors hover:text-white">
                  Mijn Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">info@lazo-spirits.nl</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">+31 70 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">Den Haag, Nederland</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex space-x-6 text-sm">
              <Link href="/algemene-voorwaarden" className="text-slate-400 transition-colors hover:text-white">
                Algemene Voorwaarden
              </Link>
              <Link href="/privacy-beleid" className="text-slate-400 transition-colors hover:text-white">
                Privacy Beleid
              </Link>
              <Link href="/cookies" className="text-slate-400 transition-colors hover:text-white">
                Cookie Beleid
              </Link>
            </div>
            <p className="text-sm text-slate-400">© {year} Lazo Den Haag Spirits B.V. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
