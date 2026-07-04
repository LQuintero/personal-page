import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href="/contact" 
          className="text-gray-500 hover:text-white transition-colors duration-200"
        >
          Contact Me
        </Link>
        <div className="group relative">
          <Link 
            href="https://codepen.io/soulwire/pen/DPMBjA" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors duration-200 text-xs"
          >
            Particles
          </Link>
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap text-gray-500 text-sm">
            These fancy particles? Not my magic. That&apos;s Soulwire&apos;s wizardry.
          </div>
        </div>
      </div>
    </footer>
  );
}

