// src/app/fixtures/page.tsx
import FixturesList from "@/components/FixturesList";

export default async function FixturesPage() {
  const res = await fetch("https://fantasy.premierleague.com/api/fixtures/", {
    next: { revalidate: 300 },
  });
  const fixtures = await res.json();

  const teamsRes = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
  const teamsData = await teamsRes.json();

  return <FixturesList fixtures={fixtures} teams={teamsData.teams} />;
}
