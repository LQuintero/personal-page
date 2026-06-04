import Link from 'next/link';

export default function NavBar() {
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
}

