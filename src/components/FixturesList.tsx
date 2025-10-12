"use client";

import { useState, useMemo } from "react";

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

interface Team {
  id: number;
  name: string;
  short_name: string;
}

interface FixturesListProps {
  fixtures: Fixture[];
  teams: Team[];
}

export default function FixturesList({ fixtures, teams }: FixturesListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const groupedFixtures = useMemo(() => {
    const grouped: Record<number, Fixture[]> = {};
    fixtures.forEach((fixture) => {
      if (!fixture.event) return;
      if (filter === "upcoming" && fixture.finished) return;
      if (filter === "past" && !fixture.finished) return;

      if (!grouped[fixture.event]) grouped[fixture.event] = [];
      grouped[fixture.event].push(fixture);
    });
    return grouped;
  }, [fixtures, filter]);

  const getTeamName = (id: number) =>
    teams.find((t) => t.id === id)?.short_name || "Unknown";

  // ✅ Safe date formatting (same result on server & client)
  const formatKickoffTime = (kickoff: string | null) => {
    if (!kickoff) return "TBD";
    try {
      return new Date(kickoff).toISOString().replace("T", " ").slice(0, 16);
    } catch {
      return "TBD";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">FPL Fixtures</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["all", "upcoming", "past"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option as any)}
            className={`px-5 py-2 rounded-lg text-white transition ${
              filter === option
                ? "bg-blue-600"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Fixtures grouped by Gameweek */}
      {Object.keys(groupedFixtures).length === 0 ? (
        <p className="text-center text-gray-500">No fixtures found.</p>
      ) : (
        Object.entries(groupedFixtures).map(([event, eventFixtures]) => (
          <div key={event} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Gameweek {event}
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y">
              {eventFixtures.map((fixture) => (
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
                    ) : (
                      <p className="text-gray-500 text-sm">
                        {formatKickoffTime(fixture.kickoff_time)}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-medium">{getTeamName(fixture.team_a)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
