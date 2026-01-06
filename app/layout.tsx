import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build a Life - Stoic Practice",
  description: "A daily practice for self-mastery, reflection, and inner peace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}


