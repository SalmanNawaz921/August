import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For Amnaaaa 🖤🌹",
  description: "A special gift — made with love",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
