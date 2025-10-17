"use client";

import { useEffect, useState } from "react";

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
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // ✅ Fetch Fixtures for selected gameweek
  useEffect(() => {
    if (!selectedGW) return;

    const loadFixtures = async () => {
      try {
        setLoadingFixtures(true);
        const res = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${selectedGW.id}`);
        let data = await res.json();

        // fallback if API returns empty
        if (!Array.isArray(data) || data.length === 0) {
          const allRes = await fetch("https://fantasy.premierleague.com/api/fixtures/");
          const allData = await allRes.json();
          data = allData.filter((f: any) => f.event === selectedGW.id);
        }

        setFixtures(data);
      } catch (err) {
        console.error("Could not load fixtures:", err);
        setFixtures([]);
      } finally {
        setLoadingFixtures(false);
      }
    };

    loadFixtures();
  }, [selectedGW]);

  // ✅ Fetch top players per gameweek
  useEffect(() => {
    if (!selectedGW) return;

    const loadTopPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const res = await fetch(`https://fantasy.premierleague.com/api/event/${selectedGW.id}/live/`);
        if (!res.ok) throw new Error("Failed to load event live data");
        const data = await res.json();

        const elements = data.elements || [];

        // sort players by total GW points (descending)
        const sorted = elements
          .sort((a: any, b: any) => b.stats.total_points - a.stats.total_points)
          .slice(0, 5)
          .map((e: any) => {
            const p = players.find((p) => p.id === e.id);
            const team = teams.find((t) => t.id === p?.team);
            return {
              id: e.id,
              name: p?.web_name || "Unknown",
              teamName: team?.name || "Unknown",
              points: e.stats.total_points,
            };
          });

        setTopPlayers(sorted);
      } catch (err) {
        console.error("Could not load top players:", err);
        setTopPlayers([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    loadTopPlayers();
  }, [selectedGW, players, teams]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">FPL Gameweeks Summary</h1>

      {/* Gameweek Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedGW(event)}
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

      {/* Selected Gameweek Info */}
      {selectedGW && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-2">{selectedGW.name}</h2>
          <ClientDateFormatter isoDate={selectedGW.deadline_time} />
          <p className="text-gray-600 dark:text-gray-300">
            {selectedGW.finished ? "✅ Completed" : "🕒 Ongoing or Upcoming"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <InfoCard title="Average Points" value={selectedGW.average_entry_score} />
            <InfoCard title="Highest Points" value={selectedGW.highest_score} />
            <InfoCard
              title="Status"
              value={
                selectedGW.is_current
                  ? "Current Gameweek"
                  : selectedGW.finished
                  ? "Finished"
                  : "Upcoming"
              }
            />
          </div>
        </div>
      )}

      {/* Fixtures */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Fixtures</h2>
        {loadingFixtures ? (
          <p>Loading fixtures...</p>
        ) : fixtures.length > 0 ? (
          <ul className="space-y-2">
            {fixtures.map((f) => (
              <li key={f.id} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 shadow-sm">
                {teams.find((t) => t.id === f.team_h)?.name} vs{" "}
                {teams.find((t) => t.id === f.team_a)?.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No fixtures for this gameweek.</p>
        )}
      </section>

      {/* Top Players for this GW */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Players This GW</h2>
        {loadingPlayers ? (
          <p>Loading player stats...</p>
        ) : topPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPlayers.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">{p.teamName}</p>
                <p className="font-medium">Points: {p.points}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No stats available for this week.</p>
        )}
      </section>
    </div>
  );
}

// Small subcomponents
function InfoCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}

function ClientDateFormatter({ isoDate }: { isoDate: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const date = new Date(isoDate);
    setFormatted(
      date.toLocaleString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [isoDate]);

  return (
    <p className="text-gray-600 dark:text-gray-300 mb-2">
      Deadline: {formatted || "Loading date..."}
    </p>
  );
}
