import { NextRequest, NextResponse } from "next/server";
import { getBrief, saveDraftEdits, publishBrief, revertToDraft, deleteBrief } from "@/app/lib/briefs";

// ─── Auth helper ──────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const token        = req.nextUrl.searchParams.get("token");
  const editorSecret = process.env.EDITOR_SECRET;
  if (!editorSecret) return false;
  return token === editorSecret;
}

// ─── GET — fetch brief, publish, or unpublish ─────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isAuthorized(req)) {
    const action = req.nextUrl.searchParams.get("action");
    if (action === "publish" || action === "unpublish") {
      return new NextResponse(errorPage("Unauthorized — invalid token"), {
        status: 401,
        headers: { "Content-Type": "text/html" },
      });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get("action");

  // ── Publish As-Is (from email link) ──
  if (action === "publish") {
    try {
      await publishBrief(id, {});
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new NextResponse(errorPage(message), {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    return new NextResponse(publishConfirmPage(id, siteUrl), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  // ── Unpublish — revert to draft ──
  if (action === "unpublish") {
    try {
      await revertToDraft(id);
      return NextResponse.json({ success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // ── Fetch brief ──
  try {
    const brief = await getBrief(id);
    if (!brief) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(brief);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PATCH — save draft edits ─────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let editedData: Record<string, unknown>;
  try {
    editedData = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const updated = await saveDraftEdits(id, editedData);
    return NextResponse.json({ success: true, id: updated.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE — permanently delete a brief ─────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteBrief(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function publishConfirmPage(id: string, siteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Brief Published</title>
</head>
<body style="background:#000000;color:#ffffff;font-family:Arial,sans-serif;margin:0;padding:48px 24px;">
  <div style="max-width:480px;margin:0 auto;text-align:center;">
    <p style="color:#2d6a4f;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">Rich with Sophia</p>
    <div style="font-size:48px;margin-bottom:24px;">✓</div>
    <h1 style="color:#ffffff;font-size:28px;margin:0 0 12px;">Brief Published</h1>
    <p style="color:#9ca3af;font-size:16px;margin:0 0 32px;">
      The ${escapeHtml(id)} brief is now live on your site.
    </p>
    <a href="${siteUrl}/daily-brief" style="display:inline-block;background:#2d6a4f;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
      View Live Brief →
    </a>
  </div>
</body>
</html>`.trim();
}

function errorPage(message: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Error</title></head>
<body style="background:#000000;color:#ffffff;font-family:Arial,sans-serif;margin:0;padding:48px 24px;">
  <div style="max-width:480px;margin:0 auto;text-align:center;">
    <h1 style="color:#f87171;font-size:24px;">Something went wrong</h1>
    <p style="color:#9ca3af;">${escapeHtml(message)}</p>
  </div>
</body>
</html>`.trim();
}