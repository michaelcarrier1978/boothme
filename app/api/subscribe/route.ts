import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "BoothMe <hello@boothme.co>",
      to: email,
      subject: "Your Free Vendor Application Template",
      html: `
        <div style="font-family: 'IBM Plex Sans', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; background: #F7F4EC; color: #1E1B16;">
          <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 16px;">Hey ${name}!</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thanks for grabbing the free vendor application template. Here it is — copy it, customize it, make it yours.
          </p>
          <div style="background: #FFFDF7; border: 1px solid #E2DCCD; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #7A7263; margin-bottom: 12px;">What's inside:</p>
            <ul style="padding-left: 20px; line-height: 2;">
              <li>Pre-filled application questions that convert</li>
              <li>Conditional logic setup guide</li>
              <li>Scoring rubric for reviewing applicants</li>
              <li>Follow-up email sequence templates</li>
            </ul>
          </div>
          <a href="#" style="display: inline-block; background: #B4552F; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px; margin-bottom: 32px;">
            Download Your Template →
          </a>
          <p style="font-size: 14px; color: #5A5449; border-top: 1px solid #E2DCCD; padding-top: 24px;">
            — Michael at BoothMe<br>
            <a href="https://boothme.co" style="color: #B4552F;">boothme.co</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
