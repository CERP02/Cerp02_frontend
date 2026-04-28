"use client";

// Import React hooks for managing state and side effects
import { useEffect, useRef, useState } from "react";

// useCountUp animates a number from 0 to a target value over a given duration
// It only starts counting when the "start" flag becomes true
function useCountUp(target: number, duration = 1800, start = false) {
  // value holds the current animated number shown on screen
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Do nothing until the start flag is triggered
    if (!start) return;
    // Record the time the animation started
    const startTime = performance.now();

    // tick is called on every animation frame to update the displayed value
    const tick = (now: number) => {
      // Calculate progress as a fraction between 0 and 1
      const p = Math.min((now - startTime) / duration, 1);
      // Apply an ease-out cubic curve so the number slows down near the end
      const ease = 1 - Math.pow(1 - p, 3);
      // Update the displayed value rounded to the nearest integer
      setValue(Math.round(ease * target));
      // Continue animating until progress reaches 1 (100%)
      if (p < 1) requestAnimationFrame(tick);
    };

    // Start the animation loop
    requestAnimationFrame(tick);
  }, [target, duration, start]);

  // Return the current animated value for display
  return value;
}

// Hero is the full-height landing section at the top of the home page
// It shows the platform tagline, CTA buttons, and animated stat cards
export default function Hero() {
  // counting becomes true when the hero section enters the viewport
  const [counting, setCounting] = useState(false);
  // ref is attached to the section element so we can observe when it is visible
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create an IntersectionObserver to watch when the section enters the viewport
    const obs = new IntersectionObserver(
      ([entry]) => {
        // When 30% of the section is visible, start the counter animations
        if (entry.isIntersecting) {
          setCounting(true);
          // Stop observing once triggered — we only want to animate once
          obs.disconnect();
        }
      },
      // Trigger when at least 30% of the element is visible
      { threshold: 0.3 }
    );

    // Attach the observer to the section element
    if (ref.current) obs.observe(ref.current);

    // Clean up the observer when the component unmounts
    return () => obs.disconnect();
  }, []);

  // Animate each stat counter — values reflect Kasoa community scale
  // Active incidents currently being tracked across Kasoa
  const c1 = useCountUp(47, 1800, counting);
  // Number of Kasoa towns covered by the platform
  const c2 = useCountUp(10, 1400, counting);
  // Average minutes from report submission to responder dispatch
  const c3 = useCountUp(12, 1600, counting);

  // stats defines the three metric cards shown on the right side of the hero
  const stats = [
    // Red stat — number of active incidents currently being tracked
    { val: c1, label: "Active Incidents", color: "var(--red)" },
    // Blue stat — number of Kasoa community towns covered
    { val: c2, label: "Towns Covered", color: "var(--blue)" },
    // Orange stat — average response time in minutes
    { val: c3, label: "Avg. Response (min)", color: "var(--orange)" },
  ];

  return (
    // Full-height section with relative positioning for the background layers
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden px-10 pt-28 pb-20"
    >
      {/* ── Grid Background ── */}
      {/* Subtle red grid pattern layered behind all content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,59,59,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,59,59,0.03) 1px, transparent 1px)",
          // Grid cell size — 60px squares
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial Glow ── */}
      {/* Soft red glow centered at the top of the hero to draw the eye */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(ellipse, rgba(255,59,59,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative max-w-2xl">
        {/* ── Live Badge ── */}
        {/* Pill badge with a pulsing dot to indicate real-time activity */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-widest uppercase mb-8"
          style={{
            background: "var(--red-dim)",
            border: "1px solid rgba(255,59,59,0.25)",
            color: "#ff8080",
          }}
        >
          {/* Animated pulsing dot indicating the system is live */}
          <span
            className="pulse-dot w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--red)" }}
          />
          Live Community Response System
        </div>

        {/* ── Main Heading ── */}
        {/* Large display heading emphasising the urgency of emergency response */}
        <h1
          className="font-extrabold leading-none mb-6"
          style={{
            fontFamily: "Syne, sans-serif",
            // Responsive font size — 48px minimum, scales up to 80px
            fontSize: "clamp(48px,7vw,80px)",
            letterSpacing: "-0.02em",
          }}
        >
          When{" "}
          {/* "seconds" is highlighted in red to emphasise urgency */}
          <em className="not-italic" style={{ color: "var(--red)" }}>
            seconds
          </em>
          <br />
          define survival
        </h1>

        {/* ── Subheading ── */}
        {/* Brief explanation of what CERP does and who it serves */}
        <p
          className="text-lg mb-10 max-w-xl"
          style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
        >
          The Community Emergency Reporting Platform connects Kasoa residents
          directly to first responders — faster flood warnings, fire dispatch,
          and accident response across all 10 Kasoa community towns.
        </p>

        {/* ── CTA Buttons ── */}
        <div className="flex gap-3 flex-wrap">
          {/* Primary CTA — takes citizen to the report form */}
          <a href="/report">
            <button className="btn-primary text-base px-7 py-3.5 rounded-xl">
              Report an Incident
            </button>
          </a>

          {/* Secondary CTA — takes user to the live dashboard */}
          <a href="/dashboard">
            <button className="btn-ghost text-base px-7 py-3.5 rounded-xl">
              View Live Map
            </button>
          </a>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {/* Positioned absolutely on the right side — hidden on small screens */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex-col gap-4 hidden lg:flex">
        {/* Render one card per stat */}
        {stats.map(({ val, label, color }) => (
          <div
            key={label}
            className="rounded-xl px-6 py-5 min-w-[180px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* The animated number value in the stat's accent color */}
            <div
              className="text-3xl font-extrabold mb-1"
              style={{ fontFamily: "Syne, sans-serif", color }}
            >
              {val}
            </div>

            {/* The stat label in muted uppercase text */}
            <div
              className="text-xs tracking-wider uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
