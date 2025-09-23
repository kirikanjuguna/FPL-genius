import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4">🚀 MyFPL-Genius</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Your Fantasy Premier League companion — stats, insights, and tools.
      </p>
      <div className="flex gap-4">
        <Link href="/players" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Explore Players
        </Link>
        <Link href="/teams" className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-700">
          View Teams
        </Link>
      </div>
    </div>
  );
}
