"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AgeVerificationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (!ageVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    setIsOpen(false);
  };

  const handleDeny = () => {
    alert("U moet 18 jaar of ouder zijn om deze site te bezoeken.");
    setIsOpen(false);
    router.push("https://duckduckgo.com")
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <DialogContent className="fixed flex items-center justify-center border-none bg-transparent">
        <div className="w-full max-w-md rounded bg-surface p-6 shadow-lg text-text-primary">
          <DialogTitle className="text-2xl font-bold">Leeftijdsverificatie</DialogTitle>
          <DialogDescription className="mt-2">
            U moet 18 jaar of ouder zijn om deze site te bezoeken. Bevestig dat u 18 jaar of ouder bent.
          </DialogDescription>
          <div className="mt-4 flex justify-end space-x-4">
            <Button onClick={handleDeny} className="rounded border-none bg-red-600 px-4 py-2 text-text-primary hover:bg-red-700">
              Nee
            </Button>
            <Button onClick={handleConfirm} className="rounded bg-green-500 px-4 py-2 text-text-primary hover:bg-green-600">
              Ja
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeVerificationModal;
