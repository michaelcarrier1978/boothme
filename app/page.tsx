"use client";

import React, { useState } from "react";
import Image from "next/image";
import Script from "next/script";

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  bg: "#f3f2f2",
  surface: "#eae9e9",
  dark: "#201e1d",
  accent: "#ec3013",
  accentDark: "#ae1800",
  divider: "color-mix(in srgb,#201e1d 40%,transparent)",
  muted: "color-mix(in srgb,#201e1d 80%,transparent)",
  mutedLight: "color-mix(in srgb,#201e1d 68%,transparent)",
};

function Divider() {
  return <div style={{ height: 2, border: 0, margin: 0, background: T.divider }} />;
}

function LightboxImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const [open, setOpen] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [pinching, setPinching] = React.useState(false);
  const pinchRef = React.useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = React.useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const clamp = (s: number) => Math.max(1, Math.min(8, s));

  const close = React.useCallback(() => {
    setOpen(false);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const zoom = React.useCallback((factor: number) => {
    setScale(prev => {
      const next = clamp(prev * factor);
      if (next <= 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const touchDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const iconBtn: React.CSSProperties = {
    width: 44, height: 44, border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  };

  return (
    <>
      {/* Thumbnail */}
      <button
        onClick={() => setOpen(true)}
        aria-label={`Expand: ${alt}`}
        style={{ display: "block", width: "100%", padding: 0, border: "none", background: "none", cursor: "zoom-in", position: "relative" }}
      >
        <Image src={src} alt={alt} width={width} height={height} unoptimized style={{ width: "100%", height: "auto", display: "block" }} />
        <span style={{
          position: "absolute", bottom: 10, right: 10,
          background: "rgba(0,0,0,0.55)", color: "#fff",
          width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
            <line x1="6.5" y1="4.5" x2="6.5" y2="8.5" />
            <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" />
          </svg>
        </span>
      </button>

      {/* Lightbox */}
      {open && (
        <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.92)" }}>

          {/* Pan + zoom interaction layer */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              touchAction: "none",
              cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default",
            }}
            onWheel={e => { e.stopPropagation(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); }}
            onMouseDown={e => {
              if (scale <= 1) return;
              dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
              setDragging(true);
            }}
            onMouseMove={e => {
              if (!dragRef.current) return;
              setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy });
            }}
            onMouseUp={() => { dragRef.current = null; setDragging(false); }}
            onMouseLeave={() => { dragRef.current = null; setDragging(false); }}
            onTouchStart={e => {
              if (e.touches.length === 2) {
                pinchRef.current = { dist: touchDist(e.touches), scale };
                setPinching(true);
              } else if (e.touches.length === 1 && scale > 1) {
                dragRef.current = { sx: e.touches[0].clientX, sy: e.touches[0].clientY, ox: offset.x, oy: offset.y };
              }
            }}
            onTouchMove={e => {
              if (e.touches.length === 2 && pinchRef.current) {
                const next = clamp(pinchRef.current.scale * (touchDist(e.touches) / pinchRef.current.dist));
                setScale(next);
                if (next <= 1) setOffset({ x: 0, y: 0 });
              } else if (e.touches.length === 1 && dragRef.current) {
                setOffset({ x: dragRef.current.ox + e.touches[0].clientX - dragRef.current.sx, y: dragRef.current.oy + e.touches[0].clientY - dragRef.current.sy });
              }
            }}
            onTouchEnd={() => { pinchRef.current = null; dragRef.current = null; setPinching(false); }}
          >
            <Image
              src={src} alt={alt} width={width} height={height} unoptimized
              style={{
                maxWidth: "90vw", maxHeight: "85vh", width: "auto", height: "auto", display: "block",
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                transformOrigin: "center",
                transition: dragging || pinching ? "none" : "transform 0.15s ease",
                userSelect: "none", pointerEvents: "none",
              }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); close(); }}
            aria-label="Close"
            style={{ ...iconBtn, position: "absolute", top: 16, right: 16 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>

          {/* Zoom controls */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}
          >
            <button onClick={() => zoom(1.4)} aria-label="Zoom in" style={iconBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
                <line x1="6.5" y1="4.5" x2="6.5" y2="8.5" />
                <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" />
              </svg>
            </button>
            <button onClick={() => zoom(1 / 1.4)} aria-label="Zoom out" style={iconBtn}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
                <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" />
              </svg>
            </button>
            {scale > 1 && (
              <button
                onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
                aria-label="Reset zoom"
                style={{ ...iconBtn, width: "auto", padding: "0 14px", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-body)" }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}


// ─── Email form (shared) ─────────────────────────────────────────────────────
function EmailForm({
  email,
  setEmail,
  onSubmit,
  loading,
  error,
  status,
  ctaLabel = "Join the Waitlist →",
  style,
  inputBg,
  btnClass,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: { preventDefault(): void }) => void;
  loading: boolean;
  error: string;
  status?: string;
  ctaLabel?: string;
  style?: React.CSSProperties;
  inputBg?: string;
  btnClass?: "primary" | "ghost";
}) {
  const isPrimary = btnClass !== "ghost";
  return (
    <div style={style}>
      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 560 }}
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          style={{
            flex: "1 1 240px",
            minHeight: 48,
            fontSize: 16,
            padding: "6px 10px",
            fontFamily: "var(--font-body)",
            color: T.dark,
            background: inputBg ?? T.surface,
            border: `1px solid ${T.divider}`,
            borderRadius: 0,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: "0 1 auto",
            minHeight: 48,
            fontSize: 16,
            padding: "6px 20px",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            borderRadius: 0,
            border: isPrimary ? "none" : `1px solid ${T.bg}`,
            background: isPrimary ? T.accent : "transparent",
            color: isPrimary ? T.bg : T.bg,
          }}
        >
          {loading ? "Joining..." : ctaLabel}
        </button>
      </form>
      {error && (
        <p style={{ fontSize: 14, color: T.accent, marginTop: 8, fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
      <p style={{
        fontSize: 13,
        lineHeight: 1.5,
        margin: "12px 0 0",
        color: T.mutedLight,
        fontFamily: "var(--font-body)",
      }}>
        By submitting, you&apos;ll get updates from BoothMe. No spam, unsubscribe anytime.
      </p>
      {status && (
        <p style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 15,
          margin: "10px 0 0",
          color: T.accentDark,
          minHeight: 22,
        }}>
          {status}
        </p>
      )}
    </div>
  );
}

// ─── Shared footer ───────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer style={{
      borderTop: `2px solid ${T.divider}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "20px clamp(20px,5vw,64px)",
      fontSize: 12,
      color: T.mutedLight,
      fontFamily: "var(--font-body)",
      textAlign: "center",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, background: "#22a74f", flexShrink: 0 }}>
          <Image src="/ticket-office.png" alt="" width={13} height={13} style={{ display: "block" }} />
        </span>
        BoothMe &copy; {new Date().getFullYear()}
      </span>
      <a href="/privacy" style={{ color: T.mutedLight, textDecoration: "none" }}>Privacy Policy</a>
    </footer>
  );
}

// ─── Landing page ────────────────────────────────────────────────────────────

function LandingPage({ onSubmit, email, setEmail, loading, error }: {
  onSubmit: (e: { preventDefault(): void }) => void;
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div style={{ background: T.bg, color: T.dark, fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.6 }}>

      {/* Header */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "14px clamp(20px,5vw,64px)",
        background: T.bg,
        borderBottom: `2px solid ${T.divider}`,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "#22a74f", flexShrink: 0 }}>
            <Image src="/ticket-office.png" alt="" width={22} height={22} style={{ display: "block" }} />
          </span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>
            BoothMe
          </span>
        </span>
        <a
          href="#join"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: 15,
            minHeight: 44,
            padding: "0 18px",
            background: T.accent,
            color: T.bg,
            textDecoration: "none",
            borderRadius: 0,
          }}
        >
          Join the waitlist
        </a>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "clamp(36px,7vw,72px) clamp(20px,5vw,64px) clamp(32px,5vw,56px)",
      }}>
        <span style={{
          display: "block",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.accentDark,
          marginBottom: 20,
          fontFamily: "var(--font-heading)",
        }}>
          Pre-launch — founding organizers
        </span>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(34px,7vw,68px)",
          lineHeight: 1.06,
          letterSpacing: "-0.025em",
          margin: "0 0 20px -0.055em",
        }}>
          Drag vendors onto a live floor plan as they apply.
        </h1>
        <p style={{
          fontSize: "clamp(17px,2.2vw,20px)",
          lineHeight: 1.55,
          maxWidth: "42ch",
          margin: "0 0 28px",
          color: T.muted,
          fontFamily: "var(--font-body)",
        }}>
          See exactly where every application stands — no more guessing who&apos;s confirmed, who&apos;s pending, or who&apos;s paid.
        </p>

        {/* Hero form */}
        <div
          id="join"
          style={{
            borderTop: `2px solid ${T.divider}`,
            paddingTop: 24,
            maxWidth: 560,
            scrollMarginTop: 84,
          }}
        >
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: 17,
            margin: "0 0 14px",
          }}>
            Join the waitlist now and lock in a 5% vendor fee for life.
          </p>
          <EmailForm
            email={email}
            setEmail={setEmail}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {/* Hero GIF */}
        <figure style={{ margin: "clamp(32px,5vw,56px) 0 0" }}>
          <LightboxImage src="/event-owner-map.gif" alt="Organizer drags a vendor card onto the live floor plan; booth turns green and status flips to Assigned" width={2230} height={1254} />
        </figure>
      </section>

      <Divider />

      {/* Problem */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(20px,5vw,64px)" }}>
        <span style={{
          display: "block",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.accentDark,
          marginBottom: 14,
          fontFamily: "var(--font-heading)",
        }}>
          The problem
        </span>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(26px,4vw,40px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 18px",
          maxWidth: "24ch",
        }}>
          Vendor applications don&apos;t belong in your inbox.
        </h2>
        <p style={{ margin: 0, maxWidth: "58ch", color: T.muted }}>
          Email threads, Instagram DMs, a spreadsheet somewhere trying to hold it all together — it works, barely, until a vendor cancels three days out and you&apos;re redrawing the floor plan by hand.
        </p>
      </section>

      <Divider />

      {/* How it works */}
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(20px,5vw,64px)" }}>
        <span style={{
          display: "block",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.accentDark,
          marginBottom: 14,
          fontFamily: "var(--font-heading)",
        }}>
          How BoothMe works
        </span>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(26px,4vw,40px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 clamp(28px,4vw,44px)",
        }}>
          One live map, everyone on the same page.
        </h2>

        {/* Feature 01 — Vendor */}
        <div style={{ paddingBottom: "clamp(28px,4vw,44px)" }}>
          <figure style={{ margin: "0 0 clamp(16px,2vw,24px)" }}>
            <LightboxImage src="/vendor-map.gif" alt="Vendor sees their confirmed booth number on the live floor plan" width={2106} height={1184} />
          </figure>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(12px,2vw,24px)", alignItems: "baseline" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, margin: 0, color: T.accent, flexShrink: 0 }}>01</p>
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.2, letterSpacing: "-0.015em", margin: "0 0 6px" }}>
                For vendors: know exactly where you&apos;re set up
              </h3>
              <p style={{ margin: 0, fontSize: 16, color: T.muted, maxWidth: "60ch" }}>
                No more &ldquo;where&apos;s my booth?&rdquo; texts the morning of the show. Vendors see their confirmed spot on the same live map.
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Feature 02 — Attendee */}
        <div style={{ paddingTop: "clamp(28px,4vw,44px)" }}>
          <figure style={{ margin: "0 0 clamp(16px,2vw,24px)" }}>
            <LightboxImage src="/attendee-map.gif" alt="Attendee searches vendors on the public floor plan" width={892} height={502} />
          </figure>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(12px,2vw,24px)", alignItems: "baseline" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, margin: 0, color: T.accent, flexShrink: 0 }}>02</p>
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.2, letterSpacing: "-0.015em", margin: "0 0 6px" }}>
                For attendees: find the vendors they came for
              </h3>
              <p style={{ margin: 0, fontSize: 16, color: T.muted, maxWidth: "60ch" }}>
                A searchable, public floor plan so attendees can find specific vendors instead of wandering the whole show.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Pricing callout */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(20px,5vw,64px)" }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(20px,4vw,48px)",
          alignItems: "baseline",
          border: `2px solid ${T.dark}`,
          padding: "clamp(22px,3.5vw,36px)",
        }}>
          <p style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(34px,5vw,56px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: 0,
            color: T.accent,
            flex: "0 0 auto",
          }}>
            5% vs 7%
          </p>
          <p style={{ margin: 0, flex: "1 1 300px", fontSize: 16, color: T.muted }}>
            Waitlist organizers who become Founding Organizers lock in a 5% vendor fee for life — the standard rate will be 7%. No upfront cost: you only pay when vendors pay you.
          </p>
        </div>
      </section>

      <Divider />

      {/* Why I built this */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(20px,5vw,64px)" }}>
        <span style={{
          display: "block",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.accentDark,
          marginBottom: 14,
          fontFamily: "var(--font-heading)",
        }}>
          Why I built this
        </span>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(26px,4vw,40px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 18px",
          maxWidth: "26ch",
        }}>
          Built by someone who&apos;s run the show, literally.
        </h2>
        <p style={{ margin: "0 0 clamp(24px,4vw,40px)", maxWidth: "58ch", color: T.muted }}>
          I&apos;ve sold as a vendor at shows, and I&apos;ve helped run them — the application process is where things fall apart every time. I built BoothMe to fix the part of running a vendor show that nobody enjoys.
        </p>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(20px,4vw,40px)",
          alignItems: "start",
          borderTop: `2px solid ${T.divider}`,
          paddingTop: "clamp(24px,4vw,36px)",
        }}>
          <figure style={{ flex: "0 1 200px", margin: 0 }}>
            <Image src="/bigSkyLogoWhole_outline.webp" alt="Big Sky Outdoor Expo logo" width={300} height={271} style={{ width: "100%", height: "auto", display: "block" }} />
          </figure>
          <figure style={{ flex: "1 1 320px", margin: 0 }}>
            <blockquote style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(20px,2.8vw,28px)",
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              margin: 0,
              maxWidth: "34ch",
            }}>
              &ldquo;BoothMe has been a true gem. It has saved me a lot of headache and constant stress managing vendors and where each vendor goes. Thank you BoothMe for making my event so easy.&rdquo;
            </blockquote>
            <figcaption style={{ fontSize: 15, margin: "20px 0 0", color: T.mutedLight }}>
              — Jenney Devitt, Big Sky Outdoor Expo
            </figcaption>
          </figure>
        </div>
      </section>

      <Divider />

      {/* FAQ */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(36px,6vw,64px) clamp(20px,5vw,64px)" }}>
        <span style={{
          display: "block",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: T.accentDark,
          marginBottom: 14,
          fontFamily: "var(--font-heading)",
        }}>
          Questions
        </span>
        <h2 style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(26px,4vw,40px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          margin: "0 0 clamp(20px,3vw,32px)",
        }}>
          Before you join
        </h2>

        {[
          {
            q: "Is this a real product yet?",
            a: "BoothMe is in active development, with Big Sky Outdoor Expo as our first live customer. Joining the waitlist gets you early access as it rolls out further.",
            border: `border-top: 2px solid ${T.divider}`,
          },
          {
            q: "What does it cost?",
            a: "No upfront cost. Waitlist organizers who become Founding Organizers lock in a 5% fee per vendor payment (standard rate is 7%) — for life. You only pay when vendors pay you.",
            border: `border-top: 2px solid ${T.divider}`,
          },
          {
            q: "What happens after I join the waitlist?",
            a: "You'll hear from us as BoothMe becomes available. Founding Organizer spots — the first 50 — are confirmed on a short setup call once you're invited in.",
            border: `border-top: 2px solid ${T.divider}; border-bottom: 2px solid ${T.divider}`,
          },
        ].map((item) => (
          <details
            key={item.q}
            style={{ borderTop: `2px solid ${T.divider}` }}
          >
            <summary style={{
              listStyle: "none",
              cursor: "pointer",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 17,
              padding: "18px 0",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}>
              {item.q}
              <span style={{ fontWeight: 400, color: T.accent }}>+</span>
            </summary>
            <p style={{ margin: "0 0 20px", maxWidth: "62ch", fontSize: 16, color: T.muted }}>
              {item.a}
            </p>
          </details>
        ))}
        <div style={{ height: 2, background: T.divider }} />
      </section>

      {/* Bottom CTA */}
      <section style={{ background: T.accent, color: T.bg }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(44px,7vw,88px) clamp(20px,5vw,64px)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(30px,5.2vw,56px)",
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            margin: "0 0 28px -0.055em",
            maxWidth: "26ch",
          }}>
            Join the waitlist and lock in 5% for life.
          </h2>
          <EmailForm
            email={email}
            setEmail={setEmail}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            btnClass="ghost"
            inputBg={T.bg}
          />
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

// ─── Thank-you page ───────────────────────────────────────────────────────────

function ThankYouPage() {
  const N = {
    n300: "#d9d9d9",
    n700: "#616161",
    n800: "#424242",
  };

  const faqItems = [
    {
      q: "I don’t have all my event details ready yet.",
      a: "Bring whatever you’ve got — even a rough vendor count and a date. We’ll build the rest live on the call.",
    },
    {
      q: "Is this a sales pitch?",
      a: "It’s a working setup of your event, not a slideshow. If it’s not a fit, you’ll know by the end of the call — no hard sell.",
    },
    {
      q: "Is the 5% rate really permanent?",
      a: "Yes — it’s tied to your account as a founding organizer, not a temporary launch discount. It doesn’t change when the standard rate goes up later.",
    },
    {
      q: "What happens after the first 50 spots are filled?",
      a: "The offer closes. New organizers after that point join at the standard 7% rate with self-serve setup.",
    },
  ];

  const benefits = [
    {
      num: "01",
      title: "Lock in a 5% vendor fee for life",
      desc: "Standard rate will be 7%. Confirmed the moment you book, not a temporary launch discount.",
    },
    {
      num: "02",
      title: "We build your booth map with you on the call",
      desc: "Done-for-you setup, not a self-serve tutorial.",
    },
    {
      num: "03",
      title: "Direct input into what gets built next",
      desc: "The features you ask for shape the platform before it’s locked in.",
    },
  ];

  return (
    <div style={{ background: T.bg, color: T.dark, fontFamily: "var(--font-body)", lineHeight: 1.6 }}>

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: `2px solid ${T.divider}`,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "#22a74f", flexShrink: 0 }}>
            <Image src="/ticket-office.png" alt="" width={20} height={20} style={{ display: "block" }} />
          </span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
            BoothMe
          </span>
        </span>
        <span style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: T.accent,
          fontWeight: 600,
        }}>
          Waitlist confirmed
        </span>
      </header>

      {/* Main content */}
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Section 1 — Confirmation */}
        <section style={{ padding: "36px 20px 32px", borderBottom: `2px solid ${T.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 28,
              height: 28,
              background: T.accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              ✓
            </div>
            <span style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: N.n700,
              fontWeight: 600,
            }}>
              Step 1 of 2 complete
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(30px,9vw,52px)",
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            margin: "0 0 16px",
          }}>
            You&apos;re on the list.
          </h1>
          <p style={{ fontSize: 16, color: N.n800, maxWidth: "44ch", margin: 0 }}>
            We&apos;ll email you as BoothMe becomes available. In the meantime &mdash; one more thing worth two minutes of your time.
          </p>
        </section>

        {/* Section 2 — Founding Organizer offer */}
        <section style={{ padding: "32px 20px", borderBottom: `2px solid ${T.divider}` }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: `2px solid ${T.accent}`,
            padding: "6px 10px",
            marginBottom: 20,
          }}>
            <div style={{ width: 7, height: 7, background: T.accent, flexShrink: 0 }} />
            <span style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: T.accent,
              fontWeight: 700,
            }}>
              First 50 spots only
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(24px,6.5vw,36px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: "0 0 14px",
          }}>
            Want to be one of the first 50 Founding Organizers?
          </h2>
          <p style={{ fontSize: 16, color: N.n800, maxWidth: "52ch", margin: "0 0 24px" }}>
            Book a free 20-minute call and we&apos;ll build your first event&apos;s booth map and application flow together &mdash; live, before you commit to anything.
          </p>

          {/* Benefits grid */}
          <div style={{ borderTop: `2px solid ${T.divider}`, marginBottom: 28 }}>
            {benefits.map((b, i) => (
              <div
                key={b.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 14,
                  padding: "16px 0",
                  borderBottom: i < benefits.length - 1 ? `1px solid ${N.n300}` : `2px solid ${T.divider}`,
                }}
              >
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.accent,
                  paddingTop: 3,
                  fontFamily: "var(--font-heading)",
                }}>
                  {b.num}
                </span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px", fontFamily: "var(--font-heading)" }}>
                    {b.title}
                  </p>
                  <p style={{ fontSize: 14, color: N.n800, margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Calendly embed */}
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/mjcsolutions-io/30min"
            style={{ minWidth: 320, height: 700 }}
          />
        </section>

        {/* Section 3 — FAQ */}
        <section style={{ padding: "32px 20px", borderBottom: `2px solid ${T.divider}` }}>
          <p style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: N.n700,
            fontWeight: 600,
            marginBottom: 8,
          }}>
            Before you book
          </p>
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "clamp(22px,6vw,32px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: "0 0 20px",
          }}>
            Quick questions
          </h2>

          <div style={{ borderTop: `2px solid ${T.divider}` }}>
            {faqItems.map((item, i) => (
              <details
                key={item.q}
                style={{ borderBottom: i < faqItems.length - 1 ? `1px solid ${N.n300}` : `2px solid ${T.divider}` }}
              >
                <summary style={{
                  listStyle: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "var(--font-heading)",
                  padding: "16px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}>
                  {item.q}
                  <span style={{ color: T.accent, fontWeight: 400, flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ fontSize: 15, color: N.n800, margin: "0 0 16px", maxWidth: "58ch" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <SiteFooter />

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; }
}

function capi(event_name: string, event_id: string, email?: string) {
  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name, event_id, email }),
  }).catch(() => {});
}

export default function Page() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PageView CAPI on mount
  React.useEffect(() => {
    const id = `pv_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    capi("PageView", id);
  }, []);

  // Calendly Schedule listener (active after form submit)
  React.useEffect(() => {
    if (!submitted) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.event !== "calendly.event_scheduled") return;
      const id = `sched_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      window.fbq?.("track", "Schedule", {}, { eventID: id });
      capi("Schedule", id);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [submitted]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        // Deduplicate browser Lead against CAPI Lead using the returned event ID
        window.fbq?.("track", "Lead", { content_name: "waitlist" }, { eventID: data.fb_event_id });
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <ThankYouPage />;
  }

  return (
    <LandingPage
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      loading={loading}
      error={error}
    />
  );
}
