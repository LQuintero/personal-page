import Footer from '@/client/components/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 h-dvh overflow-hidden">
      {children}
      <div className="relative z-10 shrink-0 pointer-events-none">
        <Footer />
      </div>
    </div>
  );
}
