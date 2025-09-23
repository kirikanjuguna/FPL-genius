"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/" className="font-bold text-xl">FPL_genius</Link>
        <Link href="/players">Players</Link>
        <Link href="/teams">Teams</Link>
      </div>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-3 py-1 rounded-lg border dark:border-gray-700"
      >
        {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}
