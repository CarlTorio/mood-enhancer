import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "../Reveal";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = "gWyNJb5d6Kk";

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VSL() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const hideControlsTimer = useRef<number | null>(null);

  const showControls = () => {
    setControlsVisible(true);
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const init = () => {
      if (!containerRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          loop: 1,
          playlist: VIDEO_ID,
        },
        events: {
          onReady: (e: any) => {
            const iframe = e.target.getIframe?.();
            if (iframe) {
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.display = "block";
              iframe.style.objectFit = "contain";
              iframe.style.backgroundColor = "#0D0D0D";
              iframe.style.border = "0";
            }
            e.target.mute();
            e.target.playVideo();
            setDuration(e.target.getDuration() || 0);
            setReady(true);
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              setDuration(e.target.getDuration() || 0);
            }
            if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    }

    intervalRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === "function") {
        setCurrent(p.getCurrentTime() || 0);
        const d = p.getDuration?.() || 0;
        if (d) setDuration(d);
      }
    }, 250);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleUnmute = () => {
    const p = playerRef.current;
    if (!p) return;
    p.unMute();
    p.setVolume(100);
    p.playVideo();
    setMuted(false);
    setPlaying(true);
    showControls();
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pauseVideo();
      setPlaying(false);
    } else {
      p.playVideo();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      p.setVolume(100);
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const restart = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(0, true);
    p.playVideo();
    setPlaying(true);
    setCurrent(0);
    e?.currentTarget.blur();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p || !duration) return;
    const t = (Number(e.target.value) / 100) * duration;
    p.seekTo(t, true);
    setCurrent(t);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <section id="story" className="bg-tier-2 section-divider relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-x-10 lg:gap-x-12 gap-y-8 lg:grid-cols-[55%_45%] items-start">
        <Reveal>
          <div
            className="group/vsl relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[14px] lift-image lift-halo"
            style={{
              backgroundColor: "var(--color-noir)",
              border: "0.5px solid color-mix(in oklab, var(--color-gold) 22%, transparent)",
            }}
          >
            <div
              className="relative aspect-video w-full overflow-hidden bg-[var(--color-noir)]"
              onClick={() => { if (!muted) showControls(); }}
              onTouchStart={() => { if (!muted) showControls(); }}
            >
              <div
                ref={containerRef}
                className="pointer-events-none absolute inset-0 block h-full w-full bg-[var(--color-noir)] [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:block [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:border-0 [&>iframe]:bg-[var(--color-noir)] [&>iframe]:object-contain"
              />

              {/* Tap-to-unmute overlay */}
              {ready && muted && (
                <button
                  type="button"
                  onClick={handleUnmute}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group"
                  aria-label="Tap for sound"
                >
                  <div className="flex flex-col items-center gap-3 text-white">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-brand-red)] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium tracking-wide uppercase">Tap for sound</span>
                  </div>
                </button>
              )}
            </div>

            {/* Custom controls bar */}
            {ready && (
              <div className={`absolute bottom-0 left-0 right-0 z-20 px-4 pt-6 pb-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover/vsl:opacity-100 group-hover/vsl:translate-y-0 focus-within:opacity-100 focus-within:translate-y-0 ${controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                {/* Progress bar */}
                <div className="relative h-1 mb-3 group">
                  <div className="absolute inset-0 rounded-full bg-white/25" />
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-[var(--color-brand-red)]"
                    style={{ width: `${progress}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={onSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Seek video"
                  />
                </div>

                <div className="flex items-center gap-3 text-white">
                  {/* Play/Pause */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center transition-colors"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    )}
                  </button>

                  {/* Mute/Unmute */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center transition-colors"
                    aria-label={muted ? "Unmute" : "Mute"}
                  >
                    {muted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                    )}
                  </button>

                  {/* Restart */}
                  <button
                    type="button"
                    onClick={restart}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center transition-colors"
                    aria-label="Restart from beginning"
                    title="Restart"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>

                  {/* Time */}
                  <div className="ml-auto text-xs tabular-nums text-white/85">
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="text-content">
            <p className="eyebrow mb-3">Watch This First</p>
            <h2 className="text-display text-[var(--color-ivory)] leading-[1.1] text-4xl md:text-5xl lg:text-[44px]">
              When Was the Last Time You Truly Felt… <span style={{ color: "#A81716", fontStyle: "italic" }}>Connected?</span>
            </h2>
            <p className="mt-5 text-[var(--color-ivory-muted)] max-w-xl text-base md:text-[17px] leading-[1.7] font-light">
              Before you scroll, watch this short video. It's the story of thousands of Filipino couples and maybe yours too. What you'll see might be the most <span style={{ color: "#F2EAE0", fontWeight: 600 }}>honest conversation about intimacy</span> you've heard in years.
            </p>

            <ul className="mt-6 space-y-3 max-w-xl">
              {[
                "What's actually stealing your connection (it's not what you think)",
                "Why most solutions fail and what works instead",
                "How LOVABLE helps your body remember how to feel again",
              ].map((b) => (
                <li key={b} className="flex gap-3 items-start text-[var(--color-ivory)]/90 leading-[1.6] text-[15px] md:text-base">
                  <span className="mt-3 inline-block w-5 h-px bg-[var(--color-brand-red)] flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link to="/shop" className="btn-primary btn-shine btn-shine-primary"><span>Get LOVABLE Now →</span></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
