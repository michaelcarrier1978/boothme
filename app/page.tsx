"use client";

import { useState, useRef } from "react";
import Script from "next/script";

const RATE = "4%";
const SPOTS_LEFT = 50;

export default function Page() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      setFirstName(name.split(" ")[0]);
      setSubmitted(true);
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (submitted) {
    return <ThankYouPage firstName={firstName} />;
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(247,244,236,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              background: "var(--accent)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>B</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 16, color: "var(--dark)" }}>BoothMe</span>
          </div>
          <a
            href="#opt-in"
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "8px 18px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
          >
            Get the Template
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            background: "rgba(180,85,47,0.08)",
            border: "1px solid rgba(180,85,47,0.2)",
            borderRadius: 20,
            padding: "4px 14px",
            marginBottom: 28,
          }}>
            Free Resource — No Credit Card
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(38px, 6vw, 64px)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "var(--dark)",
            marginBottom: 24,
          }}>
            The vendor application<br />
            <em>that actually works.</em>
          </h1>
          <p style={{
            fontSize: 18,
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 48px",
          }}>
            Stop sending vendors to a form that doesn&apos;t reflect your show. Get the exact Google Form template we use — make a copy and you&apos;re ready to take applications.
          </p>

          {/* Form Card */}
          <div id="opt-in" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "40px 32px",
            maxWidth: 480,
            margin: "0 auto",
            boxShadow: "0 4px 24px rgba(30,27,22,0.06)",
          }}>
            <p style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--muted-light)",
              marginBottom: 20,
            }}>
              Send me the template
            </p>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 15,
                    background: "#fff",
                    color: "var(--dark)",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 15,
                    background: "#fff",
                    color: "var(--dark)",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              {error && (
                <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 14 }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "var(--muted-light)" : "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--accent-hover)"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--accent)"; }}
              >
                {loading ? "Sending…" : "Send Me the Template →"}
              </button>
            </form>
            <p style={{ fontSize: 10, color: "var(--muted-light)", marginTop: 16, lineHeight: 1.6 }}>
              By clicking the button above, you agree to receive email marketing from BoothMe.<br />No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "32px 24px",
        background: "var(--card)",
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px 48px",
          textAlign: "center",
        }}>
          {[
            ["6", "sections covering every detail you need"],
            ["30+", "fields — nothing left to follow up on"],
            ["23%", "more applications reported by organizers"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--dark)" }}>{num}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What&apos;s Inside */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>What you&apos;re getting</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            color: "var(--dark)",
            marginBottom: 48,
          }}>
            Everything your application<br />
            <em>was missing.</em>
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}>
            {[
              {
                title: "Business & contact info",
                desc: "Captures vendor name, owner, phone, email, address, website, social handles, years in business, and staff count — everything you need before you even reply.",
              },
              {
                title: "Product category & description",
                desc: "9 preset categories — food & beverage, apparel, art & crafts, health & beauty, home & garden, and more — plus a free-text description field so you know exactly what they're selling.",
              },
              {
                title: "Booth & logistics requirements",
                desc: "Booth size preference, power needs (110V, 220V, or water access), tables, chairs, tent status, and special requests — all captured upfront so there's no back-and-forth.",
              },
              {
                title: "Insurance & compliance",
                desc: "Built-in checkboxes for general liability insurance, health permits, and seller's permits — so compliance is part of the application, not an afterthought.",
              },
            ].map(({ title, desc }) => (
              <div key={title} style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "28px 24px",
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  background: "rgba(180,85,47,0.1)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 16,
                }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "var(--dark)" }}>{title}</h3>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section style={{
        background: "var(--dark)",
        color: "white",
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel light>The problem</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            Most vendor applications were<br />
            <em>built by people who hate vendors.</em>
          </h2>
          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 560,
            margin: "0 auto 40px",
          }}>
            They ask for irrelevant information, bury critical questions, and leave applicants wondering if you even received their submission. Then organizers wonder why they get ghosted.
          </p>
          <p style={{
            fontSize: 17,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.9)",
            maxWidth: 560,
            margin: "0 auto",
            fontStyle: "italic",
          }}>
            &ldquo;A good application is a sales tool. It should make vendors want to be in your show, not just tolerate the friction.&rdquo;
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>What organizers say</SectionLabel>
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "28px 24px",
            maxWidth: 560,
          }}>
            <p style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--dark)",
              fontStyle: "italic",
              marginBottom: 20,
            }}>
              &ldquo;The application document helped me increase vendor applications by 33%.&rdquo;
            </p>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--dark)" }}>Michael C.</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>SquatchCon</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "64px 24px 80px",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 400,
            marginBottom: 40,
            color: "var(--dark)",
          }}>
            Good questions.
          </h2>
          {[
            {
              q: "Is this really free?",
              a: "Yes. No credit card, no trial, no catch. You get the full template just for sharing your email.",
            },
            {
              q: "What format does the template come in?",
              a: "It's a Google Form. You'll get a link in your inbox — click 'Make a copy,' and it's added to your Google Drive. Customize the fields, share your link, and you're ready to take applications.",
            }
          ].map(({ q, a }) => (
            <details key={q} style={{
              borderBottom: "1px solid var(--border)",
              padding: "20px 0",
            }}>
              <summary style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--dark)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {q}
                <span style={{ fontSize: 20, color: "var(--muted)", marginLeft: 16, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--muted)",
                marginTop: 14,
              }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            marginBottom: 16,
            color: "var(--dark)",
          }}>
            Your next show deserves<br />
            <em>better applicants.</em>
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 36 }}>
            Get the template in your inbox in under a minute.
          </p>
          <a
            href="#opt-in"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "white",
              padding: "15px 32px",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
          >
            Get the Free Template →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "var(--muted-light)" }}>
            © 2025 BoothMe. All rights reserved.{" "}
            <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</a>
            {" · "}
            <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Unsubscribe</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ThankYouPage({ firstName }: { firstName: string }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          height: 60,
        }}>
          <span style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 24,
            color: "var(--dark)",
            letterSpacing: "-0.01em",
          }}>
            BoothMe
          </span>
        </div>
      </header>

      {/* Dark Hero */}
      <section style={{
        background: "var(--dark)",
        color: "white",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(180,85,47,0.9)",
            background: "rgba(180,85,47,0.12)",
            border: "1px solid rgba(180,85,47,0.3)",
            borderRadius: 20,
            padding: "4px 14px",
            marginBottom: 28,
          }}>
            Template Sent ✓
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            Your template is on its way,{" "}
            <em>{firstName || "friend"}.</em>
          </h1>
          <p style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 480,
            margin: "0 auto",
          }}>
            Check your inbox for the Google Form link — it should arrive in the next couple minutes. Click &ldquo;Make a copy&rdquo; and it&apos;s yours. While you wait, there&apos;s something you should see.
          </p>
        </div>
      </section>

      {/* OTO: Wait — before you go */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SectionLabel>One-time offer</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(30px, 4vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--dark)",
            marginBottom: 24,
          }}>
            Wait — before you go,<br />
            <em>the template is just the start.</em>
          </h2>
          <p style={{
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.8,
            maxWidth: 620,
            marginBottom: 48,
          }}>
            The template helps you collect the right information. BoothMe handles everything that comes next — approvals, contracts, floor plan, payments, and communication — all from one place built specifically for vendor shows.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}>
            {[
              {
                title: "Applications & approvals",
                desc: "Custom vendor intake, one-click approvals, and instant notifications to accepted and waitlisted applicants.",
              },
              {
                title: "Live booth map",
                desc: "Drag-and-drop floor plan with real-time assignment status. Vendors see their spot. Attendees find which booths to visit. You see the full picture.",
              },
              {
                title: "Stripe payments built in",
                desc: "Collect booth fees directly. No invoicing back-and-forth, no Venmo requests, automatic receipts.",
              },
              {
                title: "Contracts & e-signatures",
                desc: "Auto-sent on approval, legally binding, stored permanently. No PDF email chains.",
              },
            ].map(({ title, desc }) => (
              <div key={title} style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "24px 20px",
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  background: "rgba(180,85,47,0.1)",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 12,
                }}>✓</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--dark)", marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Booth Map Demo */}
      <section style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>Live demo</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: 400,
            color: "var(--dark)",
            marginBottom: 8,
          }}>
            This is a live booth map.
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 32 }}>
            The booths are dragged over the map and assigned to a vendor. Built on the call.
          </p>
          <iframe
            src="https://app.boothme.io/embed/booth-map?tenant=big-sky-outdoor-expo&event=big-sky-outdoor-expo"
            width="100%"
            height="500"
            style={{ border: "none", borderRadius: 8 }}
            allowFullScreen
          />
        </div>
      </section>

      {/* Offer Box — dark */}
      <section style={{
        background: "var(--dark)",
        color: "white",
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 48,
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <p style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 12,
              }}>Founding Organizer Program</p>
              <h2 style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 400,
                lineHeight: 1.2,
              }}>
                Lock in the rate that<br />
                <em>never changes.</em>
              </h2>
            </div>
            <div style={{
              background: "rgba(180,85,47,0.15)",
              border: "1px solid rgba(180,85,47,0.35)",
              borderRadius: 12,
              padding: "20px 28px",
              textAlign: "center",
              flexShrink: 0,
            }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{SPOTS_LEFT}</div>
              <div style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 6,
              }}>spots remaining</div>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            marginBottom: 48,
          }}>
            {[
              {
                title: `Founding rate: ${RATE} flat`,
                desc: "Every transaction you process through BoothMe, locked in forever at the founding rate.",
              },
              {
                title: "Live booth map setup",
                desc: "We build your floor plan with you on the call. You leave with a working, drag-and-drop booth map.",
              },
              {
                title: "Stripe payments activated",
                desc: "Collect booth fees directly. Funds go straight to you — we never hold your money.",
              },
              {
                title: "Shape the roadmap",
                desc: "Founding organizers get direct input on what we build next. Your shows inform the product.",
              },
            ].map(({ title, desc }) => (
              <div key={title} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "22px 18px",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "rgba(255,255,255,0.95)" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a
              href="#book"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "white",
                padding: "15px 36px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
            >
              Claim My Founding Spot →
            </a>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 14 }}>
              Only {SPOTS_LEFT} spots at the founding rate. No obligation on the call.
            </p>
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <blockquote style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(26px, 3.5vw, 42px)",
            fontWeight: 400,
            lineHeight: 1.4,
            color: "var(--dark)",
            fontStyle: "italic",
          }}>
            &ldquo;No slide deck. No canned demo.<br />Just 30 minutes, your actual show,<br />and you leave with everything live.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Why this, why now */}
      <section style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel>Context</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            marginBottom: 48,
            color: "var(--dark)",
          }}>
            Why this, why now.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)", marginBottom: 14 }}>
                The market is moving fast.
              </h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
                Vendors are getting more sophisticated. They expect a professional experience — from the first application through payment confirmation. Shows that deliver it get the best vendors. Shows that don&apos;t get ghosted.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--dark)", marginBottom: 14 }}>
                We&apos;re early and intentional about it.
              </h3>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
                We&apos;re not scaling with thousands of customers yet — on purpose. Founding organizers get direct access to us, and their shows shape how the product evolves. That closes when we hit capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark CTA Bar */}
      <section style={{
        background: "var(--dark)",
        color: "white",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Claim your Founding<br />
            <em>Organizer spot.</em>
          </h2>
          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
            marginBottom: 36,
          }}>
            30 minutes. We set up your show together. You lock in {RATE} forever.
          </p>
          <a
            href="#book"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "white",
              padding: "15px 36px",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
          >
            Book a Free Setup Call →
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 16 }}>
            Only {SPOTS_LEFT} spots at the founding rate. No obligation on the call.
          </p>
        </div>
      </section>

      {/* Calendly Booking */}
      <section id="book" style={{ padding: "64px 24px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: 32 }}>
          <SectionLabel>Book your call</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: 400,
            color: "var(--dark)",
            marginBottom: 8,
          }}>
            Pick a time that works for you.
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
            30 minutes. We set up your show live on the call.
          </p>
        </div>
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/mjcsolutions-io/30min"
          style={{ minWidth: 320, height: 700 }}
        />
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </section>

      {/* FAQ */}
      <section style={{
        padding: "64px 24px 80px",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 400,
            marginBottom: 40,
            color: "var(--dark)",
          }}>
            Good questions.
          </h2>
          {[
            {
              q: "What exactly happens on the setup call?",
              a: "We spend 30 minutes building your show inside BoothMe — live, on the call. That means your application form, booth map, payment setup, and contract template. You leave with a working system, not a demo.",
            },
            {
              q: `What does the ${RATE} founding rate actually mean?`,
              a: `${RATE} per transaction, locked in forever. When we move to subscription pricing — which we will — you keep the founding rate. No renegotiation, no grandfathering clause, no annual reviews.`,
            },
            {
              q: "Is there a monthly fee?",
              a: `No. Founding organizers pay nothing until they process their first payment through BoothMe. Then it's a flat ${RATE} on what you collect. That's it.`,
            },
            {
              q: "What if my show is small?",
              a: "The platform scales down as well as up. We've set up shows with 12 vendors and shows with 200+. The 30-minute call works either way.",
            },
            {
              q: "What payment processor do you use?",
              a: "Stripe. You connect your own Stripe account so funds go directly to you — we never hold your money.",
            },
            {
              q: "Can I cancel if it doesn't work out?",
              a: "Yes. No contracts, no cancellation fees. If BoothMe isn't the right fit after the call, you walk away.",
            },
          ].map(({ q, a }) => (
            <details key={q} style={{
              borderBottom: "1px solid var(--border)",
              padding: "20px 0",
            }}>
              <summary style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--dark)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {q}
                <span style={{ fontSize: 20, color: "var(--muted)", marginLeft: 16, flexShrink: 0 }}>+</span>
              </summary>
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--muted)",
                marginTop: 14,
              }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 13, color: "var(--muted-light)" }}>
          © 2025 BoothMe. All rights reserved.{" "}
          <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</a>
          {" · "}
          <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Unsubscribe</a>
        </p>
      </footer>
    </div>
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono), monospace",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,0.5)" : "var(--muted-light)",
      marginBottom: 16,
    }}>
      {children}
    </p>
  );
}
