import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";

const PIXEL_ID = "1593221715528386";

function sha256(value: string) {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const firstName = name ? name.split(" ")[0] : email.split("@")[0];

  const ckRes = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, email, first_name: firstName }),
  });

  if (!ckRes.ok) {
    return NextResponse.json({ error: "Failed to subscribe. Try again." }, { status: 500 });
  }

  // Fire CAPI Lead event (non-blocking)
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const leadEventId = `lead_${randomUUID()}`;

  if (accessToken) {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "";
    const userAgent = req.headers.get("user-agent") ?? "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://boothme.app";

    fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: siteUrl,
            event_id: leadEventId,
            user_data: {
              em: [sha256(email)],
              client_ip_address: clientIp,
              client_user_agent: userAgent,
            },
          },
        ],
        access_token: accessToken,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, fb_event_id: leadEventId });
}
