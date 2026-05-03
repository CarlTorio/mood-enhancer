import manualCover from "@/assets/reconnection-manual-cover.jpg";

// Bonus indicator badge inside bundle tier buttons
export function BundleBonusIndicator({ tier }: { tier: "2" | "3" }) {
  const items =
    tier === "3"
      ? ["The Reconnection Manual", "The Daily Ritual Companion"]
      : ["Includes The Reconnection Manual"];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginTop: 10,
        padding: "8px 12px",
        background: "rgba(184, 149, 90, 0.08)",
        border: "0.5px solid rgba(184, 149, 90, 0.3)",
        borderRadius: 8,
      }}
    >
      {items.map((it) => (
        <div key={it} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#C9A06D", fontSize: 8, lineHeight: 1 }}>◆</span>
          <span
            style={{
              color: "#C9A06D",
              fontSize: 11,
              fontStyle: "italic",
              letterSpacing: 0.4,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {it}
          </span>
        </div>
      ))}
    </div>
  );
}

// "What's included" panel rendered above the CTA for bundles
export function BundleIncludesSection({
  productImage,
  productName,
  tier,
}: {
  productImage: string;
  productName: string;
  tier: "2" | "3";
}) {
  return (
    <div
      style={{
        margin: "32px 0 0",
        padding: 24,
        background: "linear-gradient(180deg, #1A0E0E 0%, #160808 100%)",
        border: "0.5px solid rgba(184, 149, 90, 0.25)",
        borderRadius: 16,
      }}
    >
      <h3
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 22,
          color: "#F2EAE0",
          margin: 0,
          fontWeight: 400,
        }}
      >
        What's <em style={{ color: "#DC2627" }}>included.</em>
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
        <IncludeRow
          image={productImage}
          imageBg="#0D0606"
          label="Product"
          name={productName}
          desc="Premium drops, formulated to be taken daily."
        />
        <IncludeRow
          image={manualCover}
          imageBg="#1a0606"
          label="Bonus"
          name="The Reconnection Manual"
          desc="A guide for modern Filipino couples. Practical rituals, communication exercises, and mindset shifts. Available immediately after purchase."
          meta="PDF · All devices · Lifetime access"
        />
        {tier === "3" && (
          <IncludeRow
            image={manualCover}
            imageBg="#1a0606"
            label="Bonus"
            name="The Daily Ritual Companion"
            desc="A 7-day couples ritual guide. One small practice for each day of the week."
            meta="PDF · All devices · Lifetime access"
          />
        )}
      </div>
      <div
        style={{
          marginTop: 16,
          padding: "10px 14px",
          background: "rgba(220, 38, 39, 0.06)",
          borderLeft: "2px solid #DC2627",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 11,
            fontStyle: "italic",
            color: "rgba(242, 234, 224, 0.85)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          The Reconnection Manual is included with all bundle orders through this month.
        </p>
      </div>
    </div>
  );
}

function IncludeRow({
  image,
  imageBg,
  label,
  name,
  desc,
  meta,
}: {
  image: string;
  imageBg: string;
  label: string;
  name: string;
  desc: string;
  meta?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        padding: 16,
        background: "rgba(13, 6, 6, 0.5)",
        borderRadius: 12,
        border: "0.5px solid rgba(184, 149, 90, 0.15)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 10,
          background: imageBg,
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "0.5px solid rgba(184, 149, 90, 0.2)",
        }}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 9,
            letterSpacing: 2.5,
            color: "#C9A06D",
            textTransform: "uppercase",
            margin: "0 0 4px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 16,
            color: "#F2EAE0",
            margin: "0 0 6px",
            fontWeight: 400,
            lineHeight: 1.3,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 12,
            color: "rgba(242, 234, 224, 0.8)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {desc}
        </p>
        {meta && (
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 10,
              color: "rgba(184, 149, 90, 0.7)",
              fontStyle: "italic",
              margin: "6px 0 0",
              letterSpacing: 0.3,
            }}
          >
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}
