"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Player {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  total_points: number;
}

interface Team {
  id: number;
  name: string;
}

interface PlayersListProps {
  players: Player[];
  teams: Team[];
}

const positions: Record<number, string> = {
  1: "Goalkeeper",
  2: "Defender",
  3: "Midfielder",
  4: "Forward",
};

export default function PlayersList({ players, teams }: PlayersListProps) {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState<number | "">("");
  const [positionFilter, setPositionFilter] = useState<number | "">("");
  const [visibleCount, setVisibleCount] = useState(30);

  // 🔍 Filter + search logic
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        p.web_name.toLowerCase().includes(search.toLowerCase()) ||
        p.first_name.toLowerCase().includes(search.toLowerCase()) ||
        p.second_name.toLowerCase().includes(search.toLowerCase());
      const matchesTeam = teamFilter ? p.team === teamFilter : true;
      const matchesPosition = positionFilter
        ? p.element_type === positionFilter
        : true;
      return matchesSearch && matchesTeam && matchesPosition;
    });
  }, [players, search, teamFilter, positionFilter]);

  const visiblePlayers = filteredPlayers.slice(0, visibleCount);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        FPL Player Stats
      </h1>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
        />

        <select
          value={teamFilter}
          onChange={(e) =>
            setTeamFilter(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          value={positionFilter}
          onChange={(e) =>
            setPositionFilter(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">All Positions</option>
          {Object.entries(positions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* 🧍 Players Grid */}
      {visiblePlayers.length === 0 ? (
        <p className="text-center text-gray-500">No players found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePlayers.map((player) => (
            <Link key={player.id} href={`/players/${player.id}`}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-lg font-semibold mb-2">
                  {player.web_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Team:</span>{" "}
                  {teams.find((t) => t.id === player.team)?.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Position:</span>{" "}
                  {positions[player.element_type]}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Cost:</span> £
                  {(player.now_cost / 10).toFixed(1)}m
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Total Points:</span>{" "}
                  {player.total_points}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 🔽 Load More */}
      {visibleCount < filteredPlayers.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 30)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Load More Players
          </button>
        </div>
      )}
    </div>
  );
}
