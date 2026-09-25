import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import {Navbar} from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "پارس‌کالا",
  description: "فروشگاه اینترنتی پارس‌کالا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          <Header />

          {children}

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}



