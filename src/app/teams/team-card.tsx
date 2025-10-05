"use client";

import Link from "next/link";
import { useState } from "react";

export default function TeamCard({ team }: { team: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition">
      {/* Team Logo */}
      <div className="flex items-center gap-4 mb-4">
        {!imgError ? (
          <img
            src={`https://resources.premierleague.com/premierleague/badges/70/t${team.code}.png`}
            alt={team.name}
            className="w-12 h-12"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{team.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Short: {team.short_name}
          </p>
        </div>
      </div>

      {/* Extra Stats */}
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium">Overall Strength:</span> {team.strength}
        </p>
        <p>
          <span className="font-medium">Attack (H/A):</span>{" "}
          {team.strength_attack_home} / {team.strength_attack_away}
        </p>
        <p>
          <span className="font-medium">Defence (H/A):</span>{" "}
          {team.strength_defence_home} / {team.strength_defence_away}
        </p>
      </div>

      {/* Link */}
      <Link
        href={`/teams/${team.id}`}
        className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
      >
        View Players →
      </Link>
    </div>
  );
}
