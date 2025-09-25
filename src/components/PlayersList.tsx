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
  const [positionFilter, setPositionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [sortBy, setSortBy] = useState("points");

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

  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch = player.web_name.toLowerCase().includes(search.toLowerCase());
      const matchesPosition = positionFilter === "all" || player.element_type === Number(positionFilter);
      const matchesTeam = teamFilter === "all" || player.team === Number(teamFilter);
      return matchesSearch && matchesPosition && matchesTeam;
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return b.now_cost - a.now_cost;
      } else if (sortBy === "points") {
        return b.total_points - a.total_points;
      } else {
        return a.web_name.localeCompare(b.web_name);
      }
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      {/* 🔍 Search + Filters + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1"
        />

        {/* Position Filter */}
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Positions</option>
          <option value="1">Goalkeepers</option>
          <option value="2">Defenders</option>
          <option value="3">Midfielders</option>
          <option value="4">Forwards</option>
        </select>

        {/* Team Filter */}
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="points">Sort by Points</option>
          <option value="price">Sort by Price</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.slice(0, 60).map((player) => {
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
