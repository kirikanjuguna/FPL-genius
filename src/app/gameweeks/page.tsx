// src/app/gameweeks/page.tsx
import GameweeksList from "@/components/GameweeksList";

export default async function GameweeksPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    console.error("Failed to fetch bootstrap-static in GameweeksPage");
    // you might render an error UI or fallback
    return <div className="p-6">Failed to load gameweeks.</div>;
  }

  const data = await res.json();
  const { events, elements, teams } = data;

  return <GameweeksList events={events} players={elements} teams={teams} />;
}
