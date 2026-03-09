import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let email: string;

  try {
    const body = await req.json();
    email = body.email;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const apiKey       = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error("BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email:  true,
          utm_source:          "website",
          utm_medium:          "organic",
          utm_campaign:        "subscribe_form",
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Beehiiv API error:", res.status, detail);
      return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Subscribe route error:", message);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}