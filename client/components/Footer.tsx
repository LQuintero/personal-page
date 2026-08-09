import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-3 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="group relative">
          <Link
            href="https://codepen.io/soulwire/pen/DPMBjA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Particles background credit"
            className="pointer-events-auto font-mono text-xs leading-tight text-black/50 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            ✦
          </Link>
          <div className="absolute bottom-full left-0 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap font-mono text-[10px] leading-tight text-black/50 dark:text-white/50">
            These fancy particles? Not my magic. That&apos;s Soulwire&apos;s wizardry.
          </div>
        </div>
      </div>
    </footer>
  );
}
