import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {Navbar}from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "پارس کالا | فروشگاه اینترنتی",
  description: "فروشگاه اینترنتی پارس کالا",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}


