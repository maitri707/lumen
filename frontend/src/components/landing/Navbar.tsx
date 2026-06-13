import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2">
        <img
          src="/assets/logo.png"
          alt="LUMEN Logo"
          className="h-6 object-contain"
        />
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 absolute left-1/2 -translate-x-1/2">
        <Link href="#agents" className="hover:text-black transition-colors">
          Agents
        </Link>
        <Link
          href="#how-it-works"
          className="hover:text-black transition-colors"
        >
          How it works
        </Link>
        <Link
          href="#architecture"
          className="hover:text-black transition-colors"
        >
          Architecture
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/console"
          className="px-6 py-2.5 rounded-full bg-sky-100/50 text-sky-800 text-sm font-bold hover:bg-sky-100 transition-colors"
        >
          Access Console ↗
        </Link>
      </div>
    </nav>
  );
}
