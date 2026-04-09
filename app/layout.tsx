import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stroophy Digital Services (SDS) - Melbourne Digital Agency",
  description: "Melbourne-based digital agency specializing in web development, digital infrastructure solutions, and custom software for local businesses.",
  keywords: ["digital agency", "Melbourne", "web development", "digital infrastructure", "cloud solutions", "Next.js", "Supabase", "API development"],
  authors: [{ name: "Stroophy Digital Services" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://stroophydigital.com",
    title: "Stroophy Digital Services",
    description: "Melbourne-based digital agency crafting beautiful, functional solutions for local businesses",
    siteName: "Stroophy Digital Services",
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
