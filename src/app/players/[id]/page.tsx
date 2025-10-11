import { notFound } from "next/navigation";

interface Player {
  id: number;
  web_name: string;
  code: number;
  team: number;
  element_type: number;
  now_cost: number;
  total_points: number;
  goals_scored: number;
  assists: number;
  form: string;
  minutes: number;
}

interface Team {
  id: number;
  name: string;
}

interface Position {
  id: number;
  singular_name: string;
}

interface FPLResponse {
  elements: Player[];
  teams: Team[];
  element_types: Position[];
}

async function getPlayerData(id: string) {
  const res = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    cache: "no-store", // ✅ prevent oversized data cache error
  });

  if (!res.ok) throw new Error("Failed to fetch data");

  const data: FPLResponse = await res.json();
  const player = data.elements.find((p) => p.id === Number(id));
  if (!player) return null;

  const team = data.teams.find((t) => t.id === player.team);
  const position = data.element_types.find((et) => et.id === player.element_type);

  return { player, team, position };
}

export default async function PlayerDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // ✅ await params before using
  const playerData = await getPlayerData(params.id);

  if (!playerData) notFound();

  const { player, team, position } = playerData;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">
        {/* ✅ Player Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <img
            src={`https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`}
            alt={player.web_name}
            className="w-28 h-36 rounded-md border"
          />
          <div>
            <h1 className="text-3xl font-bold mb-1">{player.web_name}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {team?.name} • {position?.singular_name}
            </p>
          </div>
        </div>

        {/* ✅ Player Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InfoCard title="Price" value={`£${(player.now_cost / 10).toFixed(1)}m`} />
          <InfoCard title="Points" value={player.total_points} />
          <InfoCard title="Goals" value={player.goals_scored} />
          <InfoCard title="Assists" value={player.assists} />
          <InfoCard title="Form" value={player.form} />
          <InfoCard title="Minutes" value={player.minutes} />
        </div>

        {/* ✅ Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/players"
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ← Back to Players
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
      <h3 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
