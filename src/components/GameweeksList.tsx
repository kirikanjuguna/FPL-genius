"use client";

import { useState } from "react";

interface Event {
  id: number;
  name: string;
  finished: boolean;
  average_entry_score: number;
  highest_score: number;
  is_current: boolean;
  deadline_time: string;
}

interface Player {
  id: number;
  web_name: string;
  total_points: number;
  team: number;
}

interface Team {
  id: number;
  name: string;
}

interface GameweeksListProps {
  events: Event[];
  players: Player[];
  teams: Team[];
}

export default function GameweeksList({ events, players, teams }: GameweeksListProps) {
  const [selectedGW, setSelectedGW] = useState<Event | null>(
    events.find((e) => e.is_current) || null
  );

  const handleSelect = (gw: Event) => setSelectedGW(gw);

  const getTopPlayers = (count: number = 5) => {
    // Sort players by total points for now (API doesn’t give GW-specific points)
    return players
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, count)
      .map((p) => ({
        ...p,
        teamName: teams.find((t) => t.id === p.team)?.name || "Unknown",
      }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">FPL Gameweeks Summary</h1>

      {/* Gameweek Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => handleSelect(event)}
            className={`px-4 py-2 rounded-lg text-white transition ${
              selectedGW?.id === event.id
                ? "bg-blue-600"
                : event.finished
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {event.name}
          </button>
        ))}
      </div>

      {/* Gameweek Info */}
      {selectedGW && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-2">{selectedGW.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Deadline: {new Date(selectedGW.deadline_time).toLocaleString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {selectedGW.finished ? "✅ Completed" : "🕒 Ongoing or Upcoming"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <InfoCard title="Average Points" value={selectedGW.average_entry_score} />
            <InfoCard title="Highest Points" value={selectedGW.highest_score} />
            <InfoCard
              title="Status"
              value={selectedGW.is_current ? "Current Gameweek" : selectedGW.finished ? "Finished" : "Upcoming"}
            />
          </div>
        </div>
      )}

      {/* Top Players Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Players Overall</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getTopPlayers().map((player) => (
            <div
              key={player.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-1">{player.web_name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">{player.teamName}</p>
              <p className="font-medium">Total Points: {player.total_points}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
