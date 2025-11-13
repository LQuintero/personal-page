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
    <html lang="en" className="h-full">
      <body className={`${oswald.className} min-h-screen flex flex-col`}>
        <ErrorBoundaryWrapper>
          <div className="flex flex-col min-h-screen relative">
            <div className="flex-grow relative">
              {children}
            </div>
            <Footer />
          </div>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
