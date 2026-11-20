import type { AssetKey } from "@/lib/brand";
import type { ImageOverride } from "@/lib/content";

/* ============================================================================
   The people, and the phases an episode passes through.

   REWRITTEN 2026-10-01 from the client's own "Team Bio & Photos" handoff. Up to
   that point the team page carried six seeded descriptions written from the
   production sequence, every one flagged unconfirmed, and six empty photo
   frames. The biographies below are the client's own account of each person,
   cut down but never embellished: no claim appears here that the handoff does
   not make, and the honours, titles and institutions are theirs verbatim.

   NAMES CORRECTED 2026-10-13 from the creative director's revision of the home
   page, which gave Kirstie the surname the bio handoff never did.

   ── THE SIX STAGES ARE GONE, 2026-10-24 ───────────────────────────────────
   Until this date this file carried a six-stage sign-off sequence: six named
   gates, a different person answerable at each, two taken by the team, and one
   where a release could be held. It came from the company's own written
   account and QUESTIONS.md #35 reserved it against exactly this revision.

   Conor's review document of 22 October withdraws it: "Our process involves
   repeated team reviews, rather than one separate review assigned to each
   person. Alan leads the writing, animation and creative direction
   throughout." The five phases below are that document's own list, and the
   sentences on them are close to its own words.

   WHAT CHANGED IN THE DATA, not just the labels. The old shape asked "who
   answers for this stage", so a person carried the stages they were named at
   and a flag for the two the team shared. The new account has no per-stage
   owner at all: one group reads every draft, Alan writes and animates, and
   the whole team watches and signs off. So a person now carries the phases
   the company's account places them in, and nothing else. Any page that still
   wants to say "a named person at every stage" is making a claim this file no
   longer supports.

   THE DOCUMENT ALSO CONFIRMS THE ROLES, which were open since 2026-10-01: Alan
   is Head of Creative Development, Paula is Chief Education Advisor, Lydia is
   Company Secretary, Mansi is a Production Assistant developing nursery
   rhymes, and Victoria has a surname, Buchkova. Two titles it leaves open on
   purpose, Kirstie's and David's, so both read "Adviser" here and the
   contribution is carried in words underneath. See QUESTIONS.md.
   ========================================================================== */

export interface Member {
  name: string;
  role: string;
  asset?: AssetKey;
  /* First line is what this person does here, in the company's own words from
     the 22 October document. The rest is the evidence for it, from the bio
     handoff, and is untouched by that revision. */
  bio: string[];
  /** Phase numbers (1 to 5) the company's account places this person in. */
  phases: number[];
  /** A portrait uploaded in the admin (people.photo). When set it replaces
   *  `asset`: pass it to Figure as `override={m.photo ?? null}`. Absent on
   *  the bundled list. */
  photo?: ImageOverride | null;
  /** An expert's own site (people.website). */
  website?: string | null;
}

export interface Phase {
  n: string;
  phase: string;
  /** The line on the slip: who does this phase, in the company's own words. */
  who: string;
  /** One sentence. The full account lives on the Responsible AI page. */
  what: string;
  /** Set where the company's account says the phase repeats, and how often. */
  rounds?: string;
}

export const TEAM: Member[] = [
  {
    name: "Conor Sexton",
    role: "Founder & CEO",
    asset: "person.conor",
    phases: [1, 2, 4, 5],
    bio: [
      "Conor founded CLE Family Media and created The Pawsitive Pugs & Pals®. He leads the company's strategy, partnerships and audience research, bringing together creative and educational specialists to develop responsible, low-stimulation children's media through a Watch • Play • Learn approach.",
    ],
  },
  {
    name: "Alan Compton",
    role: "Head of Creative Development",
    asset: "person.alan",
    phases: [1, 2, 3, 4, 5],
    bio: [
      "Alan is an award-winning photographer, filmmaker and creative strategist with more than 20 years of experience. He leads the creative development, storytelling, character design and AI-assisted animation production behind CLE Family Media's original content.",
    ],
  },
  {
    name: "Dr Paula Walshe",
    role: "Chief Education Officer",
    asset: "person.paula",
    phases: [1, 2, 4, 5],
    bio: [
      "Paula is an early childhood education lecturer, researcher and author, specialising in STEM and STEAM learning. Involved from the earliest development stages, she guides educational design, developmental suitability and learning objectives across our content and resources.",
    ],
  },
  {
    name: "Lydia Harding",
    role: "Parent Perspective & Content Review",
    asset: "person.lydia",
    phases: [1, 2, 4, 5],
    bio: [
      "Lydia brings a parent's perspective to the development and review of our content. Her experience supporting children with intellectual disabilities informs her focus on inclusion, accessibility and experiences that respect each child's individual needs and strengths.",
    ],
  },
  {
    name: "Kirstie Harding",
    /* "Adviser", not a fuller title. The 22 October document describes her
       contribution and then says to agree the exact displayed title, so the
       description below is hers and the title stays at the plain word the
       document itself uses. QUESTIONS.md. */
    role: "Child Development Adviser",
    asset: "person.kirstie",
    phases: [1, 2, 4, 5],
    bio: [
      "Kirstie is a qualified Special Needs Assistant and former early childhood educator with more than 30 years of experience, including work in crèches and early-years settings. She contributes practical childcare and inclusion expertise to reviews of the stories and educational materials.",
    ],
  },
  {
    name: "Mansi Kale",
    role: "Production Assistant & Lullaby Development",
    /* No photograph and no biography. The 22 October document gives the public
       description below and nothing more, so nothing more is printed.
       CONTENT-NEEDED.md. */
    phases: [],
    bio: [
      "Mansi supports content production and the development of gentle lullabies and songs linked to our episodes. She also contributes to Hindi-language production and localisation work.",
    ],
  },
  {
    name: "Victoria Buchkova",
    role: "Graphic Designer & Illustrator",
    asset: "person.victoria",
    /* SURNAME SUPPLIED 2026-10-24, after three weeks as "Victoria" alone. The
       22 October document also confirms the contribution below, which the
       introductory email had left vaguer. */
    phases: [],
    bio: [
      "Victoria creates illustrations, children's activity books, colouring sheets and visual designs for our educational games. Her work helps turn each episode's learning themes into engaging, hands-on activities.",
    ],
  },
  {
    name: "Stitha Raj",
    role: "UI/UX & Front-End Designer",
    asset: "person.stitha",
    /* ADDED 2026-10-27, photograph and bio from Stitha via Conor. Part of the
       app team designing PupsPlayer's screens; the bio is her own words. */
    phases: [],
    bio: [
      "Stitha is a UI/UX designer with an engineering background. She uses Figma and AI tools to design accessible, clear digital interfaces and supports the front-end experience for families and educators using the app.",
    ],
  },
  {
    name: "Justin Miranda",
    role: "Software Developer | App Development",
    asset: "person.justin",
    /* ADDED 2026-11-10, photograph, title and bio from Conor's email. Builds
       the app; no surname given, so first name only, as with Mansi. Conor
       wrote the title as "Software Developer | App Development". */
    phases: [],
    bio: [
      "Justin is the software developer designing and building The Pawsitive Pugs & Pals® app. His work brings together calm episodes, gentle interactive games and printable educational resources in a child-friendly experience for families and educators.",
    ],
  },
];

export const ADVISORS: Member[] = [
  {
    name: "David Toth",
    /* As with Kirstie: the document describes the contribution and asks for
       the displayed title to be agreed. */
    role: "Strategic Adviser",
    asset: "person.david",
    phases: [1, 2],
    bio: [
      "David is a children's media specialist with more than two decades of experience in content strategy and educational media. He advises on platform and audience strategy and actively contributes to script and episode reviews, with a focus on content quality, suitability and safe experiences for children.",
    ],
  },
];

/* The five phases are the company's own list from the 22 October document, in
   its order and close to its words. Each slip carries one sentence; the full
   account, including the names of the five who read every draft, lives on the
   Responsible AI page, which owns it. A reader going Home to Team to
   Responsible AI should not meet the same five sentences three times.

   NOTE WHAT IS NOT HERE. No stage owner, no sign-off line per phase, and no
   "a release can be held here". All three were true of the six-stage account
   and none survives this one: the document asks in as many words for the
   repeated language about being answerable and holding releases back to come
   off the site. What replaces it is the thing that is actually unusual here,
   which is that the same five people read every draft and the work goes round
   again until they are all happy. */
export const PHASES: Phase[] = [
  {
    n: "01",
    phase: "First draft",
    who: "Alan writes, five read",
    what: "Alan writes the script, and Paula, Lydia, Kirstie, Conor and David Toth each read it and give feedback.",
  },
  {
    n: "02",
    phase: "Revised drafts",
    who: "Alan and the same five",
    what: "Alan writes the next draft from that feedback, and the same group reads it again.",
    rounds: "Three to four rounds before the script is locked",
  },
  {
    n: "03",
    phase: "Animation",
    who: "Alan Compton",
    what: "Once the script is locked Alan begins the animation, using his creative judgement throughout production.",
  },
  {
    n: "04",
    phase: "Episode review",
    who: "The team",
    what: "The team watches the episode and gives feedback, and Alan makes the changes and shares the revised version.",
  },
  {
    n: "05",
    phase: "Final sign-off",
    who: "The team",
    what: "The team watches and revises again until everyone is happy with the episode and signs it off for release.",
    rounds: "Repeats until everyone is happy",
  },
];

/* The five who read every draft, in the order the company's document lists
   them. Used wherever a page shows the reading group as faces rather than as
   a sentence, so the group can never drift between pages. */
export const READERS = ["Dr Paula Walshe", "Lydia Harding", "Kirstie Harding", "Conor Sexton", "David Toth"] as const;
