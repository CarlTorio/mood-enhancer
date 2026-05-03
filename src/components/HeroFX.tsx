import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useIsMobile } from "@/hooks/use-mobile";

let enginePromise: Promise<void> | null = null;

export function HeroFX() {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const isMobile = useIsMobile();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enginePromise) {
      enginePromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
    }
    enginePromise.then(() => setReady(true));
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = inView && visible;

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      autoPlay: active,
      particles: {
        number: {
          value: isMobile ? 12 : 22,
          density: { enable: true, area: 800 },
        },
        color: { value: ["#DC2627", "#DC2627", "#DC2627", "#B8955A", "#B8955A"] },
        shape: { type: "circle" },
        opacity: {
          value: { min: 0.2, max: 0.55 },
          animation: {
            enable: true,
            speed: 0.8,
            sync: false,
            startValue: "random" as const,
          },
        },
        size: {
          value: { min: 0.8, max: 2 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
            startValue: "random" as const,
          },
        },
        move: {
          enable: true,
          direction: "top" as const,
          speed: { min: 0.2, max: 0.6 },
          random: true,
          straight: false,
          outModes: { default: "out" as const },
        },
        wobble: {
          enable: true,
          distance: 6,
          speed: { min: -1.5, max: 1.5 },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
    [isMobile, active]
  );

  const glitterOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 60,
      autoPlay: active,
      particles: {
        number: {
          value: isMobile ? 18 : 35,
          density: { enable: true, area: 800 },
        },
        color: { value: ["#B8955A", "#D4B27A", "#F2EAE0", "#B8955A"] },
        shape: {
          type: "star",
          options: { star: { sides: 4 } },
        },
        opacity: {
          value: { min: 0, max: 0.9 },
          animation: {
            enable: true,
            speed: 2.5,
            sync: false,
            startValue: "random" as const,
            destroy: "none" as const,
          },
        },
        size: {
          value: { min: 0.5, max: 2.2 },
          animation: {
            enable: true,
            speed: 3,
            sync: false,
            startValue: "random" as const,
          },
        },
        move: {
          enable: true,
          direction: "none" as const,
          speed: { min: 0.05, max: 0.2 },
          random: true,
          straight: false,
          outModes: { default: "out" as const },
        },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random" as const,
          animation: { enable: true, speed: 5, sync: false },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.08,
            opacity: 1,
            color: { value: "#F2EAE0" },
          },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
    [isMobile, active]
  );

  const bokehCount = isMobile ? 3 : 5;
  const bokehSpecs = [
    { top: "15%", left: "10%", delay: "0s", scale: 1 },
    { top: "60%", left: "25%", delay: "3s", scale: 1.3 },
    { top: "35%", left: "40%", delay: "6s", scale: 0.8 },
    { top: "80%", left: "15%", delay: "2s", scale: 1.1 },
    { top: "25%", left: "50%", delay: "5s", scale: 0.9 },
  ].slice(0, bokehCount);

  return (
    <>
      <div ref={sentinelRef} className="absolute inset-0 pointer-events-none" aria-hidden />

      {/* Bokeh layer (z-index 2) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: isMobile ? "100%" : "55%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {bokehSpecs.map((b, i) => (
          <div
            key={i}
            className="hero-bokeh"
            style={{
              top: b.top,
              left: b.left,
              animationDelay: b.delay,
              ["--bokeh-scale" as any]: b.scale,
            }}
          />
        ))}
      </div>

      {ready && (
        <>
          {/* Embers (z-index 3) */}
          <div
            aria-hidden
            className="hero-embers"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: isMobile ? "100%" : "55%",
              height: "100%",
              zIndex: 3,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <Particles id="hero-embers" options={options} />
          </div>

          {/* Gold glitter (z-index 4) */}
          <div
            aria-hidden
            className="hero-glitter"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: isMobile ? "100%" : "55%",
              height: "100%",
              zIndex: 4,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <Particles id="hero-glitter" options={glitterOptions} />
          </div>
        </>
      )}
    </>
  );
}
