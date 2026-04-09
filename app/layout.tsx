import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PI-HUB Web Services - Melbourne Web Development Agency",
  description: "Melbourne-based web development agency specializing in custom websites, e-commerce stores, and portfolio sites for local businesses.",
  keywords: ["web development", "Melbourne", "website design", "e-commerce", "portfolio", "Next.js", "Supabase"],
  authors: [{ name: "PI-HUB Web Services" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://pihubwebservices.com",
    title: "PI-HUB Web Services",
    description: "Melbourne-based web development agency",
    siteName: "PI-HUB Web Services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
