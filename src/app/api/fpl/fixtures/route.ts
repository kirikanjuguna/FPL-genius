// src/app/api/fpl/fixtures/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get("event");

  try {
    const res = await fetch(
      `https://fantasy.premierleague.com/api/fixtures/?event=${event}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch fixtures from FPL API");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fixtures API error:", error);
    return NextResponse.json({ error: "Failed to load fixtures" }, { status: 500 });
  }
}
