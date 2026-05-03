import { useEffect, useMemo, useRef, useState } from "react";

const FOR_HER_IMG =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/12.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMi5wbmciLCJpYXQiOjE3NzcwODkxODksImV4cCI6MTgwODYyNTE4OX0.lwk9AUb9CE31IDWqJDTuZOZtmes59bZ4FO-lUxOVd4s";
const FOR_HIM_IMG =
  "https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/sign/LOVABLE%20ASSETS/11.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNmM0OTM0Ny0zYWQ3LTRiMTAtYmI4NC04N2E3N2VmMWM3NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMT1ZBQkxFIEFTU0VUUy8xMS5wbmciLCJpYXQiOjE3NzcwODkyNTksImV4cCI6MTgwODYyNTI1OX0.K5QMIKYRD65B8p2BagU6a3SVO0gCmuwFYS78qwdHmPU";

// ============================================================
// EXPANDED DATA POOLS
// ============================================================

const FEMALE_NAMES = [
  "Maria", "Joan", "Beth", "Geraldine", "Grace", "Nicole", "Andrea", "Camille",
  "Patricia", "Rachelle", "Jasmine", "Angelica", "Kristine", "Mariel", "Trisha",
  "Hazel", "Faith", "Cassandra", "Bianca", "Charlene", "Daniella", "Erika",
  "Francine", "Hannah", "Isabel", "Janelle", "Katrina", "Lyka", "Michelle",
  "Nadine", "Olivia", "Princess", "Queenie", "Rhea", "Sofia", "Tricia", "Vanessa",
  "Yvonne", "Zarah", "Mae",
];

const MALE_NAMES = [
  "Mark", "Luis", "Alvin", "Carlo", "Dennis", "Edwin", "Francis", "Gabriel",
  "Henry", "Ivan", "Jerome", "Kenneth", "Lance", "Marvin", "Niño", "Oliver",
  "Paul", "Ralph", "Samuel", "Tristan", "Vincent", "Wesley", "Xander", "Aaron",
  "Benjie", "Christian", "Daniel", "Earl", "Fernan", "Greg", "Harold", "Ian",
  "Joseph", "Kevin", "Leo", "Miguel", "Nathan", "Patrick", "Roger", "Steven",
];

const LAST_INITIALS = ["A.", "B.", "C.", "D.", "G.", "L.", "M.", "P.", "R.", "S.", "T.", "V."];

const LOCATIONS = [
  // Metro Manila
  "Quezon City", "Makati", "Manila", "Pasig", "Taguig", "Mandaluyong",
  "Parañaque", "Marikina", "Caloocan", "Las Piñas", "Muntinlupa", "San Juan", "Pasay",
  // Luzon
  "Antipolo", "Cainta", "Bacoor", "Dasmariñas", "Imus", "Calamba", "Santa Rosa",
  "Biñan", "San Pedro", "Los Baños", "Lipa", "Batangas City", "Tanauan",
  "Lucena", "Tagaytay", "Angeles", "San Fernando", "Olongapo", "Baguio",
  "Dagupan", "Tarlac", "Cabanatuan", "Naga", "Legazpi", "Iriga",
  // Visayas
  "Cebu City", "Mandaue", "Lapu-Lapu", "Iloilo City", "Bacolod", "Tacloban",
  "Dumaguete", "Tagbilaran", "Roxas City",
  // Mindanao
  "Davao City", "Cagayan de Oro", "Zamboanga City", "General Santos",
  "Butuan", "Iligan", "Koronadal", "Tagum",
];

type ProductVariant = {
  name: string;
  weight: number;
  kind: "her" | "him" | "couples";
};

const PRODUCTS: ProductVariant[] = [
  { name: "LOVABLE for Her", weight: 8, kind: "her" },
  { name: "LOVABLE for Her - 1 Bottle", weight: 7, kind: "her" },
  { name: "LOVABLE for Her - 2 Bottles", weight: 18, kind: "her" },
  { name: "LOVABLE for Her - 3 Bottles", weight: 7, kind: "her" },
  { name: "LOVABLE for Him", weight: 8, kind: "him" },
  { name: "LOVABLE for Him - 1 Bottle", weight: 7, kind: "him" },
  { name: "LOVABLE for Him - 2 Bottles", weight: 17, kind: "him" },
  { name: "LOVABLE for Him - 3 Bottles", weight: 8, kind: "him" },
  { name: "Couples Bundle - 1 Set", weight: 8, kind: "couples" },
  { name: "Couples Bundle - 2 Sets", weight: 8, kind: "couples" },
  { name: "Couples Bundle - 3 Sets", weight: 4, kind: "couples" },
];

const TIME_PHRASES = {
  veryRecent: ["just now", "a moment ago", "1 minute ago", "2 minutes ago", "3 minutes ago", "5 minutes ago"],
  recent: ["7 minutes ago", "10 minutes ago", "12 minutes ago", "15 minutes ago", "18 minutes ago", "22 minutes ago"],
  older: ["30 minutes ago", "45 minutes ago", "1 hour ago", "2 hours ago"],
};

// ============================================================
// SHUFFLE / WEIGHTED HELPERS
// ============================================================

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

function pickTimePhrase(): string {
  const r = Math.random();
  if (r < 0.6) return pickRandom(TIME_PHRASES.veryRecent);
  if (r < 0.9) return pickRandom(TIME_PHRASES.recent);
  return pickRandom(TIME_PHRASES.older);
}

// ============================================================
// ROTATOR — generates a shuffled queue of unique entries.
// Persists in sessionStorage so navigations don't reset rotation.
// ============================================================

type ProofEntry = {
  displayName: string;
  location: string;
  product: string;
  productKind: "her" | "him" | "couples";
  time: string;
};

const SESSION_KEY = "lovable_proof_v2";

function generateQueue(): ProofEntry[] {
  const peopleNames = shuffle([...FEMALE_NAMES, ...MALE_NAMES]);
  return peopleNames.map((firstName) => {
    const initial = pickRandom(LAST_INITIALS);
    const location = pickRandom(LOCATIONS);
    const product = weightedPick(PRODUCTS);
    return {
      displayName: `${firstName} ${initial}`,
      location,
      product: product.name,
      productKind: product.kind,
      time: pickTimePhrase(),
    };
  });
}

type RotatorState = { queue: ProofEntry[]; index: number };

function loadRotator(): RotatorState {
  if (typeof window === "undefined") return { queue: [], index: 0 };
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RotatorState;
      if (Array.isArray(parsed.queue) && typeof parsed.index === "number") {
        return parsed;
      }
    }
  } catch {
    // fall through
  }
  return { queue: generateQueue(), index: 0 };
}

function saveRotator(state: RotatorState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

function nextEntry(state: RotatorState): { entry: ProofEntry; next: RotatorState } {
  let { queue, index } = state;
  if (queue.length === 0 || index >= queue.length) {
    queue = generateQueue();
    index = 0;
  }
  const entry = queue[index];
  const next: RotatorState = { queue, index: index + 1 };
  saveRotator(next);
  return { entry, next };
}

function imageFor(kind: "her" | "him" | "couples") {
  if (kind === "him") return FOR_HIM_IMG;
  return FOR_HER_IMG;
}

// ============================================================
// COMPONENT
// ============================================================

const URGENCY_DISMISSED_KEY = "lovable-urgency-dismissed";

export function SocialProofToast() {
  const [entry, setEntry] = useState<ProofEntry | null>(null);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [urgencyDismissed, setUrgencyDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [heroInView, setHeroInView] = useState(false);

  const stateRef = useRef<RotatorState>({ queue: [], index: 0 });

  // Initialize rotator (client only)
  useEffect(() => {
    stateRef.current = loadRotator();
  }, []);

  // Hide on checkout / thank-you
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = window.location.pathname;
    setHidden(p.startsWith("/checkout") || p.startsWith("/thank-you"));
  }, []);

  // Track hero visibility
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hero = document.getElementById("top");
    if (!hero) {
      setHeroInView(false);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setHeroInView(e.isIntersecting),
      { threshold: 0, rootMargin: "0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Mobile detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Watch urgency-bar dismissal
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      setUrgencyDismissed(sessionStorage.getItem(URGENCY_DISMISSED_KEY) === "1");
    };
    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  // Rotation cycle
  useEffect(() => {
    if (closed || hidden) return;
    let mounted = true;
    let hideTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;

    const visibleDuration = isMobile ? 5000 : 8000;
    // Spec: ~60s between toasts. We render for visibleDuration, then idle for the rest.
    const idleAfterHide = Math.max(2000, 60000 - visibleDuration);

    const showNext = () => {
      if (!mounted) return;
      const { entry: nextE, next } = nextEntry(stateRef.current);
      stateRef.current = next;
      setEntry(nextE);
      setVisible(true);

      hideTimer = setTimeout(() => {
        if (!mounted) return;
        setVisible(false);
        cycleTimer = setTimeout(() => {
          if (!mounted) return;
          showNext();
        }, idleAfterHide);
      }, visibleDuration);
    };

    const initial = setTimeout(showNext, 8000);
    return () => {
      mounted = false;
      clearTimeout(initial);
      clearTimeout(hideTimer);
      clearTimeout(cycleTimer);
    };
  }, [closed, hidden, isMobile]);

  const bottom = useMemo(
    () => (isMobile ? (urgencyDismissed ? 8 : 40) : urgencyDismissed ? 8 : 24),
    [isMobile, urgencyDismissed]
  );

  if (closed || hidden) return null;
  if (!entry) return null;
  if (isMobile && heroInView) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: `calc(${bottom}px + env(safe-area-inset-bottom, 0px))`,
        right: isMobile ? 16 : 20,
        left: isMobile ? 16 : "auto",
        maxWidth: isMobile ? undefined : 320,
        zIndex: 40,
        background: "rgba(22, 8, 8, 0.95)",
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        border: "0.5px solid rgba(184, 149, 90, 0.3)",
        borderRadius: 12,
        padding: "14px 16px",
        boxShadow:
          "0 1px 0 rgba(242, 234, 224, 0.08) inset, 0 12px 32px rgba(0, 0, 0, 0.5), 0 24px 56px rgba(0, 0, 0, 0.3)",
        fontFamily: "Montserrat, sans-serif",
        display: "grid",
        gridTemplateColumns: "48px 1fr 24px",
        gap: 12,
        alignItems: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(110%)",
        transition: visible
          ? "opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1), bottom 0.3s ease"
          : "opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1), bottom 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <img
        src={imageFor(entry.productKind)}
        alt=""
        width={48}
        height={48}
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          objectFit: "cover",
          flexShrink: 0,
          background: "#2a0d0d",
        }}
      />
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#F2EAE0",
            fontWeight: 500,
            fontSize: 13,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {entry.displayName} from {entry.location}
        </div>
        <div style={{ color: "rgba(154,136,128,0.85)", fontSize: 11, lineHeight: 1.4, marginTop: 2 }}>
          ordered {entry.product}
        </div>
        <div
          style={{
            color: "rgba(154,136,128,0.7)",
            fontSize: 10,
            lineHeight: 1.4,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ color: "#1FBB7B", fontSize: 10 }}>✓</span>
          {entry.time} · Verified
        </div>
      </div>
      <button
        onClick={() => setClosed(true)}
        aria-label="Close notification"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "transparent",
          border: "0.5px solid rgba(154,136,128,0.3)",
          color: "rgba(154,136,128,0.8)",
          fontSize: 12,
          lineHeight: 1,
          cursor: "pointer",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 200ms ease",
        }}
      >
        ×
      </button>
    </div>
  );
}
