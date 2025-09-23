// src/app/players/page.tsx
import React from "react";

type Player = {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  now_cost: number;
  total_points: number;
  element_type: number; // Position (1 = GK, 2 = DEF, 3 = MID, 4 = FWD)
  team: number;
};

export default async function PlayersPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 60 }, // cache for 60s
  });

  const data = await res.json();

  const players: Player[] = data.elements;
  const teams = data.teams;

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Players</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.slice(0, 30).map((player) => {
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
