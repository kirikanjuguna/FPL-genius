// src/app/gameweeks/page.tsx
import GameweeksList from "@/components/GameweeksList";

export default async function GameweeksPage() {
  // 1️⃣ Fetch bootstrap-static (gameweeks, players, teams)
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    console.error("Failed to fetch bootstrap-static in GameweeksPage");
    return <div className="p-6">Failed to load gameweeks.</div>;
  }
  const data = await res.json();
  const { events, elements, teams } = data;

  // 2️⃣ Fetch fixtures separately
  const fixturesRes = await fetch("https://fantasy.premierleague.com/api/fixtures/", {
    next: { revalidate: 300 },
  });
  const fixtures = await fixturesRes.json();

  // 3️⃣ Pass everything down to GameweeksList
  return (
    <GameweeksList
      events={events}
      players={elements}
      teams={teams}
      fixtures={fixtures}
    />
  );
}

