import TestForm from "@/components/common/Form";
import Services from "@/components/services/Services";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gov-light">
      <main className="container mx-auto px-4 py-12">
        <Services />
      </main>
    </div>
  );
}