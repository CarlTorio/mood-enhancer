## Goal

Replace the mobile hero background image with the new one and reposition it so the couple's heads sit slightly higher, while the hero text aligns roughly with the woman's neck.

## Changes — `src/components/sections/Hero.tsx`

1. **Swap image URL**
   - `HERO_IMAGE_URL` → `https://hmavnijneqxnythlehpw.supabase.co/storage/v1/object/public/LOVABLE%20ASSETS/1.2.png`

2. **Mobile image positioning** (inside `@media (max-width: 767px)`)
   - Change `.hero-image` `object-position` from `65% 5%` to `65% 18%` so the subjects' heads shift upward into the top portion of the frame, leaving the lower half (around the woman's neck/shoulders) for the text overlay.

3. **Mobile text vertical alignment**
   - The text container currently uses `items-end` on mobile with `pb-28`. To align the headline near the woman's neck (roughly mid-screen, slightly below center), reduce bottom padding so the text block sits a bit lower than current — change `pb-28` → `pb-20` on mobile only (`md:py-28` stays for desktop).

4. **Mobile overlay tweak (optional readability)**
   - Keep the existing gradient overlay; no change needed unless contrast suffers after the swap. If needed in implementation, slightly strengthen the bottom stop only.

## Notes

- Desktop (`md:` and up) styling is untouched — image source still swaps, but desktop uses its own mask/positioning which already centers the subjects correctly.
- Final pixel positioning of `object-position` and `pb-*` may need a tiny nudge (±5%) once visible; will verify against the 390×653 viewport after the change.
