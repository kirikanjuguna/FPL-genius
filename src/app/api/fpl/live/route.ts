// src/app/api/fpl/live/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get("event");

  try {
    const res = await fetch(
      `https://fantasy.premierleague.com/api/event/${event}/live/`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch live data from FPL API");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Live API error:", error);
    return NextResponse.json({ error: "Failed to load live data" }, { status: 500 });
  }
}
