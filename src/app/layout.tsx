import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import './styles/globals.css';  // Import global styles here

const oswald = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laura Quintero",
  description: "More about me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={oswald.className}>{children}</body>
    </html>
  );
}
