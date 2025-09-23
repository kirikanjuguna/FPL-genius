// src/components/PlayersList.tsx
"use client";

import { useState } from "react";

type Player = {
  id: number;
  web_name: string;
  now_cost: number;
  total_points: number;
  element_type: number;
  team: number;
};

export default function PlayersList({ players, teams }: { players: Player[]; teams: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const getPosition = (type: number) => {
    switch (type) {
      case 1:
        return "Goalkeeper";
      case 2:
        return "Defender";
      case 3:
        return "Midfielder";
      case 4:
        return "Forward";
      default:
        return "Unknown";
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.web_name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || player.element_type === Number(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Positions</option>
          <option value="1">Goalkeepers</option>
          <option value="2">Defenders</option>
          <option value="3">Midfielders</option>
          <option value="4">Forwards</option>
        </select>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.slice(0, 30).map((player) => {
          const team = teams.find((t: any) => t.id === player.team);
          return (
            <div
              key={player.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{player.web_name}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {getPosition(player.element_type)} – {team?.name}
              </p>
              <p className="mt-2">
                <span className="font-medium">Price:</span> £
                {(player.now_cost / 10).toFixed(1)}m
              </p>
              <p>
                <span className="font-medium">Points:</span> {player.total_points}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
