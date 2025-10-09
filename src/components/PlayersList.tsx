"use client";

import Link from "next/link";
import { useState } from "react";

interface Player {
  id: number;
  web_name: string;
  team: number;
  now_cost: number;
  total_points: number;
  goals_scored: number;
  assists: number;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
}

interface PlayersListProps {
  players: Player[];
  teams: Team[];
}

export default function PlayersList({ players, teams }: PlayersListProps) {
  const [visibleCount, setVisibleCount] = useState(30);

  const visiblePlayers = players.slice(0, visibleCount);

  const loadMore = () => setVisibleCount((prev) => prev + 30);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePlayers.map((player) => {
          const team = teams.find((t) => t.id === player.team);
          return (
            <Link key={player.id} href={`/players/${player.id}`}>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-1">{player.web_name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {team?.name || "Unknown Team"}
                </p>

                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p>
                    <span className="font-medium">Price:</span> £
                    {(player.now_cost / 10).toFixed(1)}m
                  </p>
                  <p>
                    <span className="font-medium">Points:</span>{" "}
                    {player.total_points}
                  </p>
                  <p>
                    <span className="font-medium">Goals:</span>{" "}
                    {player.goals_scored}
                  </p>
                  <p>
                    <span className="font-medium">Assists:</span>{" "}
                    {player.assists}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More Button */}
      {visibleCount < players.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
