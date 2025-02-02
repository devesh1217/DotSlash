'use client';
import TestForm from "@/components/common/Form";
import Services from "@/components/services/Services";
import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gov-light">
      <main className="container mx-auto px-4 py-12">
        {deferredPrompt && (
          <div className="mb-8 p-4 mx-28 bg-white rounded-lg shadow-md flex flex-col md:flex-row justify-evenly items-center gap-4">
            <div className="flex justify-center items-center">
              <Image src="/logo.png" width={window.innerWidth < 800 ? 32 :100} height={window.innerWidth < 800 ? 32 :100} alt="logo" className="w-[30] h-[30] md:w-[100] md:h-[100]" />
              <h1 className="text-gov-primary-light font-bold text-xl md:text-5xl">संयुक्तPortal</h1>
            </div>
            <div >
              <h2 className="text-xl font-semibold mb-2 text-red-800">Install Our App</h2>
              <p className="mb-4 text-gov-text">Install our app for a better experience!</p>
              <button
                onClick={handleInstallClick}
                className="bg-gov-primary-light text-white px-4 py-2 rounded hover:bg-gov-dark"
              >
                Install App
              </button>
            </div>
          </div>
        )}
        <Services />
      </main>
    </div>
  );
}