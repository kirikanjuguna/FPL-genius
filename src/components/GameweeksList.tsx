"use client";

import { useState, useEffect } from "react";

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

interface Fixture {
  id: number;
  team_h: number;
  team_a: number;
  kickoff_time: string | null;
  finished: boolean;
  team_h_score: number | null;
  team_a_score: number | null;
}

interface LiveElement {
  element: number; // player id
  stats: {
    total_points: number;
  };
}

interface GameweeksListProps {
  events: Event[];
  players: Player[];
  teams: Team[];
}

export default function GameweeksList({ events, players, teams }: GameweeksListProps) {
  const [selectedGW, setSelectedGW] = useState<Event | null>(
    events.find((e) => e.is_current) || events[0] || null
  );
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [topScorers, setTopScorers] = useState<
    { id: number; web_name: string; teamName: string; points: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTeamName = (id: number) => teams.find((t) => t.id === id)?.name || "Unknown";

  // When selectedGW changes, fetch fixtures and live/top data
  useEffect(() => {
    if (!selectedGW) return;
    setLoading(true);
    setError(null);

    // fetch fixtures for that GW
    const fetchGWFixtures = async () => {
      try {
        const res = await fetch(
          `https://fantasy.premierleague.com/api/fixtures/?event=${selectedGW.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch GW fixtures");
        const fx: Fixture[] = await res.json();
        setFixtures(fx);
      } catch (err: any) {
        console.error("Error fetching fixtures:", err);
        setError("Could not load fixtures for this gameweek");
        setFixtures([]);
      }
    };

    // fetch live/top data
    const fetchTopScorers = async () => {
      try {
        const res = await fetch(
          `https://fantasy.premierleague.com/api/event/${selectedGW.id}/live/`
        );
        if (!res.ok) throw new Error("Failed to fetch live GW data");
        const data = await res.json();
        const elements: LiveElement[] = data.elements;

        // sort by total_points descending
        const sorted = elements
          .map((el) => ({
            id: el.element,
            points: el.stats.total_points,
          }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);

        const enriched = sorted.map((e) => ({
          id: e.id,
          points: e.points,
          web_name: players.find((p) => p.id === e.id)?.web_name || "Unknown",
          teamName:
            teams.find((t) => t.id === players.find((p) => p.id === e.id)?.team)?.name ||
            "Unknown",
        }));

        setTopScorers(enriched);
      } catch (err: any) {
        console.error("Error fetching live data:", err);
        // it’s okay if live fails, we can fallback
        setTopScorers([]);
      }
    };

    Promise.all([fetchGWFixtures(), fetchTopScorers()])
      .catch((e) => {
        console.error("GW data error:", e);
      })
      .finally(() => {
        setLoading(false);
      });
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
            className={`relative px-4 py-2 rounded-lg text-white transition ${
              selectedGW?.id === event.id
                ? "bg-blue-600 ring-2 ring-blue-300"
                : event.finished
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {event.name}
            {event.is_current && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full text-black font-semibold">
                LIVE
              </span>
            )}
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
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {selectedGW.finished ? "✅ Completed" : "🕒 Ongoing or Upcoming"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoCard title="Average Points" value={selectedGW.average_entry_score} />
            <InfoCard title="Highest Points" value={selectedGW.highest_score} />
            <InfoCard
              title="Status"
              value={
                selectedGW.is_current
                  ? "Current GW"
                  : selectedGW.finished
                  ? "Finished"
                  : "Upcoming"
              }
            />
          </div>
        </div>
      )}

      {/* Fixtures */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Fixtures</h2>
        {loading ? (
          <p>Loading fixtures...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : fixtures.length === 0 ? (
          <p>No fixtures for this gameweek.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow divide-y">
            {fixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="flex justify-between items-center p-4"
              >
                <div className="flex-1 text-right">
                  <p className="font-medium">{getTeamName(fixture.team_h)}</p>
                </div>
                <div className="w-32 text-center">
                  {fixture.finished ? (
                    <p className="text-lg font-bold">
                      {fixture.team_h_score} - {fixture.team_a_score}
                    </p>
                  ) : fixture.kickoff_time ? (
                    <p className="text-gray-500 text-sm">
                      {new Date(fixture.kickoff_time).toLocaleString()}
                    </p>
                  ) : (
                    <p>TBD</p>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{getTeamName(fixture.team_a)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Scorers */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Players This GW</h2>
        {loading ? (
          <p>Loading top players...</p>
        ) : topScorers.length === 0 ? (
          <p>No stats available for this week.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topScorers.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-1">{p.web_name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  {p.teamName}
                </p>
                <p className="font-medium">GW Points: {p.points}</p>
              </div>
            ))}
          </div>
        )}
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
