import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const PIXEL_ID = "1593221715528386";

function sha256(value: string) {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ ok: true });

  const { event_name, event_id, email } = await req.json();

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const userAgent = req.headers.get("user-agent") ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boothme.app";

  const userData: Record<string, unknown> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };
  if (email) userData.em = [sha256(email)];

  await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: siteUrl,
          ...(event_id ? { event_id } : {}),
          user_data: userData,
        },
      ],
      access_token: accessToken,
    }),
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
