'use client';

import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-gray-500 hover:text-white transition-colors duration-200"
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;

