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
    role: "Founder and CEO",
    asset: "person.conor",
    phases: [1, 2, 4, 5],
    bio: [
      "Conor created The Pawsitive Pugs & Pals® and leads the company's strategy, commercial development, partnerships and audience research. He reads every draft script and watches every episode before release.",
      "He came to it from thirteen years in food retail, progressing from apprentice to head butcher. After a life-changing accident in 2020 he returned to education as a mature student, took a QQI Level 6 in Marketing with distinction, and is studying for a Bachelor of Business in Marketing at Munster Technological University, where he also went through the Student Inc. programme.",
      "The company began while he was minding a friend's four-year-old son, and it is built around what parents, educators and children actually need rather than around what the technology makes possible.",
    ],
  },
  {
    name: "Alan Compton",
    role: "Head of Creative Development",
    asset: "person.alan",
    phases: [1, 2, 3, 4, 5],
    bio: [
      "Alan leads the scripts, the animation and the creative judgement throughout production. He writes each draft, revises it from the team's feedback, and animates the episode once the script is locked.",
      "He is an award-winning photographer and filmmaker with more than two decades across visual storytelling, design and creative direction, and over fifteen years in commercial film and television. He has worked with international NGOs and commercial clients across Africa, Europe, Asia, the Middle East and North America, on healthcare, humanitarian response and international development.",
      "His photography has been honoured several times at the Prix de la Photographie Paris, including Portrait Photographer of the Year, and his communications work with Nobody Left Outside won a SABRE Award. He has exhibited in London, Paris and Bangkok, most recently at the Royal Albert Hall as part of Nitin Sawhney's Journeys Festival.",
    ],
  },
  {
    name: "Paula Walshe PhD",
    role: "Chief Education Advisor",
    asset: "person.paula",
    phases: [1, 2, 4, 5],
    bio: [
      "Paula has been involved from the outset. She brings the educational expertise to the project and gives feedback on every draft script.",
      "She lectures in early childhood education at South East Technological University in Carlow. Her doctoral research was on STEM and STEAM in early childhood education, and her book Full STEAM Ahead is a practical guide to playful STEAM learning with young children.",
      "She co-chairs Ireland's Early Childhood STEAM Network, is a forum member of the Women in Digital European initiative, and sits on the EECERA College of Reviewers.",
    ],
  },
  {
    name: "Lydia Sexton",
    role: "Company Secretary",
    asset: "person.lydia",
    phases: [1, 2, 4, 5],
    bio: [
      "Lydia is the company secretary, and she reads the scripts and watches the episodes alongside the rest of the team.",
      "She has worked with children with intellectual disabilities, including through horse riding, where she saw how far confidence, communication and independence can go when a child is given the right support.",
      "Her brief here is inclusion: that every child has their own strengths, pace and way of understanding the world, and that an episode should help children recognise and respect difference rather than smooth it away.",
    ],
  },
  {
    name: "Kirstie Harding",
    /* "Adviser", not a fuller title. The 22 October document describes her
       contribution and then says to agree the exact displayed title, so the
       description below is hers and the title stays at the plain word the
       document itself uses. QUESTIONS.md. */
    role: "Adviser",
    asset: "person.kirstie",
    phases: [1, 2, 4, 5],
    bio: [
      "Kirstie advises on early years practice, drawing on her work in the sector and as an SNA, and contributes to the script and episode reviews.",
      "She has over thirty years of hands-on experience in childcare and early education, is qualified in Early Childhood Development and Education and is a fully qualified SNA. She has worked in Montessori and Steiner-based playgroups, outdoor preschools and community crèches.",
      "She is a mother of four grown children.",
    ],
  },
  {
    name: "Mansi",
    role: "Production Assistant",
    /* No photograph and no biography. The 22 October document gives the public
       description below and nothing more, so nothing more is printed.
       CONTENT-NEEDED.md. */
    phases: [],
    bio: ["Mansi is a production assistant, and is developing the nursery rhymes."],
  },
  {
    name: "Victoria Buchkova",
    role: "Graphic Designer and Illustrator",
    asset: "person.victoria",
    /* SURNAME SUPPLIED 2026-10-24, after three weeks as "Victoria" alone. The
       22 October document also confirms the contribution below, which the
       introductory email had left vaguer. */
    phases: [],
    bio: [
      "Victoria designs and illustrates the games and the puzzles.",
      "She is a graphic designer and illustrator specialising in children's activity books and educational materials.",
    ],
  },
  {
    name: "Stitha Raj",
    role: "UI/UX Designer",
    asset: "person.stitha",
    /* ADDED 2026-10-27, photograph and bio from Stitha via Conor. Part of the
       app team designing PupsPlayer's screens; the bio is her own words. */
    phases: [],
    bio: [
      "Stitha is a UI/UX designer with an engineering background. She uses Figma and AI tools to design clear, user-friendly digital experiences.",
    ],
  },
];

export const ADVISORS: Member[] = [
  {
    name: "David Toth",
    /* As with Kirstie: the document describes the contribution and asks for
       the displayed title to be agreed. */
    role: "Adviser",
    asset: "person.david",
    phases: [1, 2],
    bio: [
      "David contributes to script development and gives industry advice drawn from his experience in children's shows. He reads every draft alongside the rest of the group.",
      "He is a children's media professional specialising in educational rubrics, content strategy and creator coaching, with over two decades advising youth brands including Nickelodeon, LEGO and BBC Kids on content quality and platform safety.",
      "He has also managed global operations for animation properties at Warner Bros. Studios, including Cartoon Network and DC Entertainment.",
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
export const READERS = ["Paula Walshe PhD", "Lydia Sexton", "Kirstie Harding", "Conor Sexton", "David Toth"] as const;
