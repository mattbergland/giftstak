import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giftstak — Locally Curated Gift Baskets",
  description:
    "Premium gift baskets filled with artisan ingredients from local producers. Choose from city-inspired collections and send the perfect gift.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-parchment text-warmgray-800 font-sans antialiased paper-grain">
        {children}
      </body>
    </html>
  );
}
