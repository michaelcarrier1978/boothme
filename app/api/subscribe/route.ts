import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      email,
      first_name: name.split(" ")[0],
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    return NextResponse.json({ error: "Failed to subscribe. Try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
