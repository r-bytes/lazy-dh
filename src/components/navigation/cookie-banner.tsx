"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    // Code om cookies te plaatsen
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
    // Code om cookies niet te plaatsen
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-secondary p-4 text-white">
      <div className="">
        <p>Wij gebruiken cookies om uw ervaring te verbeteren en te analyseren.</p>
        <p>
          Door op &quot;Accepteren&quot; te klikken, gaat u akkoord met ons gebruik van cookies. Voor meer informatie, bekijk ons:
          <a href="/privacy-beleid" className="underline">
            privacybeleid
          </a>
        </p>
      </div>
      <div>
        <Button onClick={handleAccept} className="mr-2 w-32 rounded bg-green-500 px-4 py-2 text-white">
          Accepteren
        </Button>
        <Button onClick={handleDecline} className="w-32 rounded bg-red-500 px-4 py-2 text-white">
          Weigeren
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
