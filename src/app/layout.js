import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Chatbot from "@/components/chatbot/ChatbotWrapper";
import Navbar from "@/components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "संयुक्तPortal",
  description: "Your one-stop portal for all government services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gov-light`}
      >
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}
