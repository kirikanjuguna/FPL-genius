export default async function TeamsPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const teams = data.teams;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team: any) => (
          <div
            key={team.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">Short Name: {team.short_name}</p>
            <p className="mt-2">
              <span className="font-medium">Strength:</span> {team.strength}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
