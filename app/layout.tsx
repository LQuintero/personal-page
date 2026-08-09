import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Oswald } from "next/font/google";
import siteConfig from '@/client/site.config';
import ThemeToggle from '@/client/components/ThemeToggle';
import { THEME_INIT_SCRIPT } from '@/client/lib/theme';
import '@/client/styles/globals.css';

const oswald = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${oswald.className} min-h-screen flex flex-col`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div className="flex flex-col flex-1 min-h-screen relative">
          <div className="flex-1 relative flex flex-col">
            {children}
          </div>
        </div>
        <ThemeToggle />
        <Analytics/>
      </body>
    </html>
  );
}
