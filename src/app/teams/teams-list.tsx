"use client";

import { useState } from "react";
import TeamCard from "./team-card";

export default function TeamsList({ initialTeams }: { initialTeams: any[] }) {
  const [search, setSearch] = useState("");

  const filteredTeams = initialTeams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase()) ||
    team.short_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 🔍 Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* 🧩 Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No teams found.</p>
      )}
    </div>
  );
}
