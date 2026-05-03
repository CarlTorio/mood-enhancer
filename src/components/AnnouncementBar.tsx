const ITEMS = [
  "Free Nationwide Shipping",
  "COD Available",
  "30-Day Money-Back Guarantee",
  "100% Natural Ingredients",
  "Made in USA",
];

export function AnnouncementBar() {
  // Duplicate enough items for seamless loop
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="relative z-50 bg-[var(--color-brand-red)] text-white overflow-hidden lift-bar-top marquee-mask">
      <div
        className="flex w-max animate-[marquee-left_40s_linear_infinite] py-2 md:py-2 [animation-play-state:running] hover:[animation-play-state:paused]"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {loop.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 md:gap-6 px-4 md:px-6 whitespace-nowrap"
            style={{
              fontSize: "11px",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span>{item}</span>
            <span style={{ color: "#B8955A" }}>◊</span>
          </div>
        ))}
      </div>
    </div>
  );
}
