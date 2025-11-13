'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const ConditionalFooter: React.FC = () => {
  const pathname = usePathname();
  
  // Hide footer on contact page
  if (pathname === '/contact') {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;

