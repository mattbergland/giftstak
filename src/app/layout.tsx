import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Giftstak — Curated Gift Baskets, Revealed",
  description:
    "AI-curated gift baskets with a cinematic interactive reveal experience.",
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
