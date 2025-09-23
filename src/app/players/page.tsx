// src/app/players/page.tsx
import PlayersList from "@/components/PlayersList";

export default async function PlayersPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 60 },
  });

  const data = await res.json();
  return <PlayersList players={data.elements} teams={data.teams} />;
}
