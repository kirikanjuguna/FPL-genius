// src/app/gameweeks/page.tsx
import GameweeksList from "@/components/GameweeksList";

export default async function GameweeksPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 300 },
  });

  const data = await res.json();
  const { events, elements, teams } = data;

  return <GameweeksList events={events} players={elements} teams={teams} />;
}
