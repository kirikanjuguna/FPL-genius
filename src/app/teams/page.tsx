import TeamCard from "./team-card";

export default async function TeamsPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 60 }, // cache for 1 min
  });

  if (!res.ok) {
    throw new Error("Failed to fetch teams");
  }

  const data = await res.json();
  const teams = data.teams || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Premier League Teams</h1>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team: any) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
