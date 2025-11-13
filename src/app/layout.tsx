import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import ErrorBoundaryWrapper from './components/ErrorBoundaryWrapper';
import Footer from './components/Footer';
import './styles/globals.css';

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
      <body className={oswald.className}>
        <ErrorBoundaryWrapper>
          {children}
          <Footer />
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
