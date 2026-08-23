"use client";

import { useState, useRef } from "react";

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
            Stop losing great vendors to a clunky Google Form. Get the exact application template we use with our highest-performing shows — free.
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
            <p style={{ fontSize: 12, color: "var(--muted-light)", marginTop: 16 }}>
              No spam. Unsubscribe anytime.
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
            ["2,400+", "vendors managed"],
            ["180+", "shows run"],
            ["4.9★", "average rating"],
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
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}>
            {[
              {
                title: "The right questions",
                desc: "Vetted questions that reveal booth size needs, setup requirements, and red flags — without scaring off good vendors.",
              },
              {
                title: "Scoring rubric",
                desc: "A simple 1–5 framework so you can review 50 applications in an afternoon instead of a week.",
              },
              {
                title: "Acceptance & decline emails",
                desc: "Copy-paste templates that sound human. Vendors remember how you made them feel.",
              },
              {
                title: "Conditional logic guide",
                desc: "Set up smart branching so food vendors see different questions than craft vendors.",
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {[
              {
                quote: "I went from spending 6 hours reviewing applications to 90 minutes. The rubric alone was worth it.",
                name: "Sarah M.",
                role: "Founder, Pacific Coast Makers Market",
              },
              {
                quote: "My acceptance rate for quality vendors jumped 40% after switching to this application structure. More info upfront = better decisions.",
                name: "James K.",
                role: "Director, Urban Harvest Festival",
              },
              {
                quote: "Vendors actually thank me for the application process now. I didn't know that was possible.",
                name: "Priya T.",
                role: "Organizer, Craft + Culture Show",
              },
            ].map(({ quote, name, role }) => (
              <div key={name} style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "28px 24px",
              }}>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--dark)",
                  fontStyle: "italic",
                  marginBottom: 20,
                }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--dark)" }}>{name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{role}</div>
                </div>
              </div>
            ))}
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
              a: "You'll get a link to a Google Form template you can copy to your own account, plus a PDF guide with setup instructions and the scoring rubric.",
            },
            {
              q: "Do I need to use BoothMe to use the template?",
              a: "Nope. The template works standalone with Google Forms, Typeform, or any form builder. BoothMe just automates everything on top of it.",
            },
            {
              q: "What is BoothMe, anyway?",
              a: "BoothMe is vendor show management software — applications, contracts, payments, floor plan, and communication in one place. The template gives you a taste of how we think about vendor experience.",
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
            <span style={{ fontWeight: 600, fontSize: 16 }}>BoothMe</span>
          </div>
        </div>
      </header>

      {/* Confirmation */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            width: 64,
            height: 64,
            background: "rgba(180,85,47,0.1)",
            border: "2px solid rgba(180,85,47,0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            fontSize: 28,
            color: "var(--accent)",
          }}>
            ✓
          </div>
          <h1 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "var(--dark)",
            marginBottom: 20,
          }}>
            It&apos;s on its way,{" "}
            <em>{firstName || "friend"}.</em>
          </h1>
          <p style={{
            fontSize: 17,
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 auto 16px",
          }}>
            Check your inbox — the template should arrive in the next couple minutes. Check spam if it doesn&apos;t show up.
          </p>
        </div>
      </section>

      {/* Upsell */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "40px 36px",
            boxShadow: "0 4px 24px rgba(30,27,22,0.06)",
          }}>
            <div style={{
              display: "inline-block",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              background: "rgba(180,85,47,0.08)",
              border: "1px solid rgba(180,85,47,0.2)",
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 20,
            }}>
              Founding Organizer Offer
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "var(--dark)",
              marginBottom: 16,
            }}>
              While you wait —<br />
              <em>want the whole system?</em>
            </h2>
            <p style={{
              fontSize: 16,
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: 24,
            }}>
              We&apos;re opening up <strong style={{ color: "var(--dark)" }}>{SPOTS_LEFT} founding organizer spots</strong> for shows that want the full BoothMe setup — applications, contracts, floor plan, and payments — at a{" "}
              <strong style={{ color: "var(--accent)" }}>flat {RATE} transaction rate.</strong> No monthly fees. Ever.
            </p>
            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {[
                "30-minute setup call, we build it with you",
                `Flat ${RATE} per transaction — no monthly fee`,
                "Priority support forever",
                "Lock in before we move to subscription pricing",
              ].map(item => (
                <li key={item} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 12,
                  fontSize: 15,
                  color: "var(--dark)",
                }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#"
              style={{
                display: "block",
                background: "var(--accent)",
                color: "white",
                padding: "15px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--accent)")}
            >
              Book a Free Setup Call →
            </a>
            <p style={{
              fontSize: 12,
              color: "var(--muted-light)",
              marginTop: 14,
              textAlign: "center",
            }}>
              Only {SPOTS_LEFT} spots at the founding rate. No obligation on the call.
            </p>
          </div>
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
