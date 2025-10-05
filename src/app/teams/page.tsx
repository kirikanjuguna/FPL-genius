import TeamsList from "./teams-list";

export default async function TeamsPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }

  const data = await res.json();
  const teams = data.teams || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Premier League Teams</h1>
      <TeamsList initialTeams={teams} />
    </div>
  );
}
