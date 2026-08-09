import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${oswald.className} h-full flex flex-col`}>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div className="flex flex-col flex-1 h-full min-h-0 relative">
          <div className="flex-1 relative flex flex-col min-h-0">
            {children}
          </div>
        </div>
        <ThemeToggle />
        <Analytics/>
      </body>
    </html>
  );
}
