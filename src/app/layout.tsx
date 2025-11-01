import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DroneControl Pro - Remote Control Panel",
  description: "Professional drone remote control web interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#1E1E1E] text-white overflow-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
