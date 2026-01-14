import type { Metadata } from "next";
import { Alegreya_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const alegreyaSC = Alegreya_SC({
  weight: ['400', '500', '700', '800', '900'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BA12 Automotive | Quality Used Cars",
  description: "Premium quality used cars in excellent condition. Browse our showroom for the perfect vehicle.",
  keywords: "used cars, quality cars, BA12 Automotive, car dealership",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={alegreyaSC.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
