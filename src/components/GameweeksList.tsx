"use client";

import { useEffect, useState, useMemo } from "react";

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
  first_name?: string;
  second_name?: string;
  team: number;
  total_points: number;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
}

interface Fixture {
  id: number;
  event: number | null;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  kickoff_time: string | null;
  finished: boolean;
}

interface GameweeksListProps {
  events: Event[];
  players: Player[];
  teams: Team[];
  fixtures: Fixture[];
}

interface TopPlayer {
  id: number;
  name: string;
  teamName: string;
  points: number;
}

export default function GameweeksList({ events, players, teams, fixtures }: GameweeksListProps) {
  const [selectedGW, setSelectedGW] = useState<Event | null>(
    events.find((e) => e.is_current) || events[0] || null
  );
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // ✅ Get fixtures for selected GW (from props)
  const currentFixtures = useMemo(() => {
    if (!selectedGW) return [];
    return fixtures.filter((f: Fixture) => f.event === selectedGW.id);
  }, [fixtures, selectedGW]);

  // ✅ Fetch top players dynamically for selected GW
  useEffect(() => {
    if (!selectedGW) return;

    const loadTopPlayers = async () => {
      try {
        setLoadingPlayers(true);

        // Fetch live GW data
        const res = await fetch(`https://fantasy.premierleague.com/api/event/${selectedGW.id}/live/`);
        if (!res.ok) throw new Error("Failed to load event live data");

        const data = await res.json();
        const elements = data.elements || [];

        // ✅ Combine live points with static player info
        const mergedPlayers: TopPlayer[] = elements
          .map((e: any) => {
            const base = players.find((p: Player) => p.id === e.id);
            const team = teams.find((t: Team) => t.id === base?.team);

            return {
              id: e.id,
              name: base
                ? `${base.first_name || ""} ${base.second_name || base.web_name}`
                : "Unknown",
              teamName: team?.name || "Unknown",
              points: e.stats.total_points || 0,
            };
          })
          .filter((p: TopPlayer) => p.points > 0)
          .sort((a: TopPlayer, b: TopPlayer) => b.points - a.points)
          .slice(0, 5);

        setTopPlayers(mergedPlayers);
      } catch (err) {
        console.error("Could not load top players:", err);
        setTopPlayers([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    loadTopPlayers();
  }, [selectedGW, players, teams]);

  const getTeamName = (id: number) =>
    teams.find((t: Team) => t.id === id)?.short_name || "Unknown";

  const formatKickoff = (kickoff: string | null) => {
    if (!kickoff) return "TBD";
    try {
      const d = new Date(kickoff);
      return d.toLocaleString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "TBD";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">FPL Gameweeks Summary</h1>

      {/* Gameweek Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {events.map((event: Event) => (
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
        {currentFixtures.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y">
            {currentFixtures.map((f: Fixture) => (
              <div key={f.id} className="flex justify-between items-center p-4">
                <div className="flex-1 text-right">
                  <p className="font-medium">{getTeamName(f.team_h)}</p>
                </div>

                <div className="w-40 text-center">
                  {f.finished ? (
                    <p className="font-semibold">
                      {f.team_h_score} - {f.team_a_score}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {formatKickoff(f.kickoff_time)}
                    </p>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-medium">{getTeamName(f.team_a)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No fixtures for this gameweek.</p>
        )}
      </section>

      {/* Top Players */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Top Players This GW</h2>
        {loadingPlayers ? (
          <p>Loading player stats...</p>
        ) : topPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPlayers.map((p: TopPlayer) => (
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

// Small reusable UI components
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
