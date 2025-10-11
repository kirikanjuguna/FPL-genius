import Link from "next/link";

export default async function TeamDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // ✅ await before use
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    cache: "no-store", // ✅ prevent cache error
  });

  const data = await res.json();

  const team = data.teams.find((t: any) => t.id === Number(params.id));
  const players = data.elements.filter((p: any) => p.team === Number(params.id));

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">Team not found.</p>
        <Link href="/teams" className="text-blue-600 hover:underline">
          ← Back to Teams
        </Link>
      </div>
    );
  }

  const getPosition = (type: number) => {
    switch (type) {
      case 1:
        return "Goalkeeper";
      case 2:
        return "Defender";
      case 3:
        return "Midfielder";
      case 4:
        return "Forward";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* 🏠 Back Link */}
      <Link href="/teams" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Teams
      </Link>

      {/* 🧩 Team Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={`https://resources.premierleague.com/premierleague/badges/70/t${team.code}.png`}
          alt={team.name}
          className="w-20 h-20"
        />
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">Short: {team.short_name}</p>
          <p className="text-gray-600 dark:text-gray-300">Strength: {team.strength}</p>
        </div>
      </div>

      {/* ⚽ Players List */}
      <h2 className="text-2xl font-semibold mb-4">Players</h2>
      {players.length === 0 ? (
        <p>No players found for this team.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player: any) => (
            <div
              key={player.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{player.web_name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {getPosition(player.element_type)}
              </p>
              <p className="mt-1">
                <span className="font-medium">Price:</span> £
                {(player.now_cost / 10).toFixed(1)}m
              </p>
              <p>
                <span className="font-medium">Points:</span> {player.total_points}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
