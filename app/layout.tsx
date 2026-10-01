import type { Metadata } from "next";
import { getCurrentUser } from "@/auth/session";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import CartStatus from "@/components/cart/CartStatus";
import {Navbar} from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "پارس‌کالا",
  description: "فروشگاه اینترنتی پارس‌کالا",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading the session cookie here makes pages render per request,
  // which is what lets the header show who is logged in.
  const user = await getCurrentUser();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          <Header userName={user?.name ?? null} />
          <Navbar />
            <CartStatus />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}