export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 h-dvh overflow-hidden">
      {children}
    </div>
  );
}
