'use client'

import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-end">
        <Link 
          href="/contact" 
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;

