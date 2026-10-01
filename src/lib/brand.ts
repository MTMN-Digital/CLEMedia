/**
 * Brand asset manifest.
 *
 * Filled 2026-09-20 from the BRAND TOOL KIT. Three image slots and all three
 * logos are live; the rest stay null deliberately.
 *
 * WHAT IS FILLED: `home.hero`, `story.garden` and `home.characters` are frames
 * from the animated show, and their alt text says so. They are not photographs
 * and must never be captioned as though they were.
 *
 * WHAT STAYS NULL, AND WHY: the stage 1 audit found the kit is almost entirely
 * AI-generated, including every file in PEOPLE/. So `story.lead`, `home.company`
 * and any future team portrait stay null until real photography exists. A
 * generated face presented as a founder would be indefensible on a site whose
 * Ethical AI page promises a human-led process. The app slots are null simply
 * because no screenshots exist yet (QUESTIONS.md #14).
 *
 * One slot per image the site needs. `null` means the asset has not been
 * supplied yet and the slot renders a labelled placeholder instead.
 *
 * To wire a real image: drop the optimised files into `public/brand/` and set
 * `base` to the path without an extension. <Figure> then serves
 * `<base>.avif`, `<base>.webp` and `<base>.jpg` in that order, with the 2x
 * variants (`<base>@2x.*`) offered through srcset.
 *
 * Nothing else in the codebase needs to change when assets land. This file is
 * the entire integration point.
 */

export interface BrandAsset {
  /** Public path without extension, e.g. "/brand/home-hero". Null until supplied. */
  base: string | null;
  /** Alt text. Required, and written here so it is never an afterthought. */
  alt: string;
  /** Intrinsic size of the 1x file. Prevents layout shift. */
  width: number;
  height: number;
  /** What belongs here, shown on the placeholder while base is null. */
  label: string;
  /**
   * Extension of the fallback file. Must match what is actually in
   * public/brand/: a mismatch used to be served index.html by the SPA rewrite
   * and fail to decode silently. The rewrite now excludes file extensions, so
   * a mismatch 404s loudly instead, but it still has to be right.
   */
  fallback?: "jpg" | "png";
  /**
   * Set when no AVIF exists for this asset. <picture> does NOT fall through to
   * the next source if the one it chose 404s, so emitting an AVIF source for a
   * file that is not there shows a broken image in every AVIF-capable browser.
   */
  noAvif?: boolean;
}

const assets = {
  "home.hero": {
    base: "/brand/home-hero",
    alt: "Bluebells and dew in the garden at sunrise, a scene from The Pawsitive Pugs and Pals",
    width: 1400, height: 1050,
    label: "The garden that inspired the show's world, or the founders at work",
  },
  "home.company": {
    base: null,
    alt: "The CLÉ Family Media team at work",
    width: 1200, height: 800,
    label: "The team at work, a workspace, or the production process. Real photography only: the kit has none.",
  },
  "home.characters": {
    base: "/brand/home-characters",
    alt: "Two pug characters in knitted jumpers beside a hen, from The Pawsitive Pugs and Pals",
    width: 1280, height: 800,
    label: "Character art: Finn, Fia and the rest of the pack",
    // A show frame, so the fallback is JPG. PNG would be several times the
    // bytes for no gain; PNG is kept for the app slots, which are UI captures.
    fallback: "jpg",
  },
  "home.app": {
    base: null,
    alt: "The PupsPlayer app shown on a tablet",
    width: 1000, height: 750,
    label: "PupsPlayer app preview",
    fallback: "png",
  },
  "story.lead": {
    base: null,
    alt: "Conor Sexton and Lydia Harding, founders of CLÉ Family Media",
    width: 1680, height: 720,
    label: "Conor and Lydia. Real photography only: the kit has none.",
  },
  "story.garden": {
    base: "/brand/story-garden",
    alt: "The garden in The Pawsitive Pugs and Pals, with a rope swing hanging from an old tree",
    width: 1200, height: 800,
    label: "The garden, the house, early sketches, or the real pugs",
  },
  "app.hero": {
    base: null,
    alt: "The PupsPlayer app on a phone",
    width: 900, height: 1125,
    label: "PupsPlayer app preview, device mockup or key screen",
    fallback: "png",
  },
  "brand.cle": {
    /* Keyed off its green backdrop 2026-09-25. The source render sits on a
       deep green that appears nowhere else in the palette, so dropped onto the
       clay ground it read as a pasted-in tile. The knockout is a measured
       chroma key on greenness plus a shadow pass, not a threshold guess. */
    base: "/brand/cle-mark",
    alt: "The CLÉ Family Media logo, the letters formed from needle-felted animals",
    width: 591, height: 591,
    label: "CLÉ Family Media logo",
    fallback: "png",
    noAvif: true,
  },
  "brand.show": {
    base: "/brand/show-logo",
    alt: "The Pawsitive Pugs & Pals logo, needle-felted lettering with paw prints and bones",
    width: 1000, height: 563,
    label: "The Pawsitive Pugs & Pals logo",
    fallback: "jpg",
  },
  /* ---------------------------------------------------------------------
     Brand objects from the BRAND TOOL KIT, opened 2026-09-22.

     The show site's whole visual language is physically sculpted felted
     objects sitting on a warm ground. Carrying a few of them is what makes
     this site read as the same brand rather than a lookalike.

     These are BRAND MARKS, not depictions of reality, which is the line
     agreed for this build: a felted sign is a logo and nobody mistakes it for
     a photograph, while a picture of a person, a room or the garden is a
     claim about the world and must be real. See CONTRACT-UI.md, Imagery.

     The kit is on Alan's Mac and unreadable from the build, so every slot
     below renders a labelled placeholder until the file is exported. The
     export list is in CONTENT-NEEDED.md under "Brand objects to export".
  --------------------------------------------------------------------- */
  "object.cle-mark": { base: null, alt: "The CLÉ Family Media mark", width: 900, height: 900, label: "Felted CLÉ mark on transparent, trimmed", fallback: "png" },
  "object.pack": { base: null, alt: "The Pawsitive Pugs and Pals characters", width: 1200, height: 700, label: "A felted character group object, for the show cross-link", fallback: "png" },
  "object.section-marker": { base: null, alt: "", width: 800, height: 500, label: "A neutral felted marker for a section opener, no show wordmark on it", fallback: "png" },

  /* ---------------------------------------------------------------------
     Slots opened 2026-09-22 for the imagery the client is sending.

     Every one is a real position in a real layout, sized to what that layout
     needs, so a supplied file becomes a one-line change and nothing reflows.

     PORTRAITS eventually belong in the `people` table so Conor can reorder
     and re-caption them himself. They sit here until the admin panel's people
     screen exists, and the migration is a straight copy of base + alt.

     Real photography only on every slot below. The kit's PEOPLE folder is
     AI-generated and unusable here.
  --------------------------------------------------------------------- */
  /* FILLED 2026-10-01 from the client's "Team Bio & Photos" handoff. Six
     photographs taken by six different people, so each is cropped square on the
     face and carries one warm grade, which is what lets a studio headshot and a
     phone selfie sit in the same row. Sources and crop boxes are recorded in
     BRAND TOOL KIT/web-exports/ASSET-LOG.md.

     Conor's was supplied as a cutout on pure white. The white is flood filled
     from the corners, never thresholded, so his white SHIRT survives, and it is
     composited onto --color-sunken so the portrait sits in its well rather than
     glowing out of it. */
  "person.conor": { base: "/brand/people/conor", alt: "Conor Sexton, founder of CLÉ Family Media", width: 440, height: 440, label: "Conor Sexton, portrait" },
  "person.alan": { base: "/brand/people/alan", alt: "Alan Compton, creative director", width: 440, height: 440, label: "Alan Compton, portrait" },
  "person.paula": { base: "/brand/people/paula", alt: "Paula Walshe PhD, education director", width: 440, height: 440, label: "Paula Walshe PhD, portrait" },
  "person.lydia": { base: "/brand/people/lydia", alt: "Lydia Harding", width: 440, height: 440, label: "Lydia Harding, portrait" },
  "person.kirstie": { base: "/brand/people/kirstie", alt: "Kirstie, child development consultant", width: 440, height: 440, label: "Kirstie, portrait" },
  "person.david": { base: "/brand/people/david", alt: "David Toth, strategic advisor", width: 440, height: 440, label: "David Toth, portrait" },
  /* Mansi is the one person in the review sequence the handoff sent no photo
     or biography for. Listed, unillustrated, logged in CONTENT-NEEDED.md. */
  "person.mansi": { base: null, alt: "Mansi, production coordination", width: 440, height: 440, label: "Mansi, portrait" },

  "team.group": { base: null, alt: "The CLÉ Family Media team", width: 1680, height: 945, label: "The team together, on location or in the workspace" },

  /* Process and workspace. The Responsible AI page argues a human-led process
     and currently illustrates it with nothing at all, its weakest point. */
  "process.workspace": { base: null, alt: "The CLÉ Family Media workspace", width: 1400, height: 933, label: "Workspace, desks, the room the work is made in" },
  "process.review": { base: null, alt: "An episode review session in progress", width: 1400, height: 933, label: "A review session in progress: people, screens, notes" },
  "process.script": { base: null, alt: "Script pages and production notes", width: 1200, height: 900, label: "Scripts, storyboards, notes, whiteboard" },

  /* The garden. The show's world is based on a real one, and a photograph of
     it would replace the strongest generated image on this site. */
  "garden.real": { base: null, alt: "The garden the show's world is based on", width: 1680, height: 945, label: "The REAL garden, photographed. Replaces the generated hero" },
  "garden.detail": { base: null, alt: "A detail from the garden", width: 1000, height: 1000, label: "Garden detail: the swing, a gate, planting" },

  /* Craft. The lettering is physically made, so the making of it is a genuine
     photograph this brand can own, and the best answer to the AI question. */
  "craft.felting": { base: null, alt: "The needle-felted lettering being made by hand", width: 1400, height: 933, label: "The felted lettering being made: hands, wool, tools" },

  "journal.default": { base: null, alt: "CLÉ Family Media", width: 1200, height: 675, label: "Default journal card image, used when a post has none" },
  "social.og": { base: null, alt: "CLÉ Family Media", width: 1200, height: 630, label: "Open Graph card, 1200x630. Blocked on the CLÉ mark" },

  /* ─────────────────────────────────────────────────────────────────────────
     TITLE SLATES, opened 2026-09-23.

     How pawsitivepugs.com uses wool: as discrete rendered objects standing in
     for NAMES. The episode plate IS the artwork on that site. These are the
     only wool objects the kit has that are NOT already in public/brand/:
     `brand.cle` and `brand.show` are the felted CLE mark and the felted show
     wordmark, and both are already here and in use.

     FILLED 2026-09-25 from the four public YouTube uploads, at David's go:
     maxresdefault thumbnails, which are the show's own artwork and the frames
     Conor himself chose per episode. Optimised into the house AVIF, WebP and
     JPG pipeline at 1x and 2x with metadata stripped.

     These can be swapped for the kit's TITLE SLATES exports whenever Alan
     pulls them; the slot names do not change. Flagged to Conor in
     CONTENT-NEEDED.md so he can substitute preferred stills.
  ───────────────────────────────────────────────────────────────────────── */
  "slate.ep1": { base: "/brand/slate-ep1", alt: "Episode one, The Feather, its felted title slate", width: 640, height: 360, label: "Episode still" },
  "slate.ep2": { base: "/brand/slate-ep2", alt: "Episode two, The Strawberry, its felted title slate", width: 640, height: 360, label: "Episode still" },
  "slate.ep3": { base: "/brand/slate-ep3", alt: "Episode three, Chicken Vision, its felted title slate", width: 640, height: 360, label: "Episode still" },
  "slate.ep4": { base: "/brand/slate-ep4", alt: "Episode four, The Cuckoo\u2019s Incredible Journey, its felted title slate", width: 640, height: 360, label: "Episode still" },

  "app.screen1": { base: null, alt: "PupsPlayer episode library", width: 540, height: 960, label: "App screenshot 1", fallback: "png" },
  "app.screen2": { base: null, alt: "PupsPlayer play activity", width: 540, height: 960, label: "App screenshot 2", fallback: "png" },
  "app.screen3": { base: null, alt: "PupsPlayer parent controls", width: 540, height: 960, label: "App screenshot 3", fallback: "png" },
} satisfies Record<string, BrandAsset>;

export type AssetKey = keyof typeof assets;

/** Widened so `base` stays `string | null` once a path is filled in. */
export const ASSETS: Record<AssetKey, BrandAsset> = assets;

/**
 * Logos are separate: they are flat single-colour marks, so they ship as SVG
 * with no responsive variants.
 *
 * Both were vectorised with potrace from the kit's flat PNGs and verified
 * against the originals. Each path is `fill="currentColor"`, so colour comes
 * from CSS: `showBlack` and `showWhite` are deliberately the same file, and a
 * consumer sets `text-ink` or `text-paper` on it rather than loading a second
 * asset. The wordmark was traced from `logo white.png` because at 1871x523 it
 * is more than twice the resolution of `logo-black.png`.
 *
 * `cle` stays null: no vector CLÉ Family Media mark exists anywhere in the kit,
 * which is QUESTIONS.md #21 and still the biggest outstanding brand gap.
 */
export const LOGOS = {
  /** The show wordmark, black on light. Flat and clean in the kit. */
  showBlack: "/brand/show-wordmark.svg" as string | null,
  /** The show wordmark, white on dark. */
  showWhite: "/brand/show-wordmark.svg" as string | null,
  /** The PupsPlayer paw-and-play mark, flat #B5E2F6. */
  pupsPlayer: "/brand/pupsplayer.svg" as string | null,
  /** A vector CLÉ Family Media wordmark. Does not exist in the kit yet. */
  cle: null as string | null,
};
