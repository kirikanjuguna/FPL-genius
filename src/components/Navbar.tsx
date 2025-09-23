"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Players", href: "/players" },
  { name: "Teams", href: "/teams" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">⚽ FPL_genius</h1>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-green-400 transition ${
              pathname === link.href ? "text-green-400 font-semibold" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
