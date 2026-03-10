// GET /api/admin/briefs?token=
//
// Returns all briefs (drafts + published) sorted newest-first.
// Used by the admin dashboard at /admin to list and manage all briefs.
//
// Auth: validated against EDITOR_SECRET env var.
// This endpoint is never called from the public-facing site.

import { NextRequest, NextResponse } from "next/server";
import { getAllBriefsAdmin } from "@/app/lib/briefs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";

  if (token !== process.env.EDITOR_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const briefs = await getAllBriefsAdmin();
    return NextResponse.json(briefs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("getAllBriefsAdmin failed:", message);
    return NextResponse.json({ error: "Failed to fetch briefs" }, { status: 500 });
  }
}