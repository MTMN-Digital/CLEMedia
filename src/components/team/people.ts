import type { AssetKey } from "@/lib/brand";

/* ============================================================================
   The people, and the review sequence they stand in.

   REWRITTEN 2026-10-01 from the client's own "Team Bio & Photos" handoff. Up to
   that point the team page carried six seeded descriptions written from the
   production sequence, every one flagged unconfirmed, and six empty photo
   frames. Everything below is the client's own account of each person, cut
   down but never embellished: no claim appears here that the handoff does not
   make, and the honours, titles and institutions are theirs verbatim.

   Two things the handoff does not settle, both listed in QUESTIONS.md:
   Kirstie's surname, which it never gives, and the job titles for Lydia, Alan
   and Paula, which it leaves out while giving one for Conor, Kirstie and David.
   The titles below are the ones the company was already using.

   MOVED HERE 2026-10-02 so the page can show the same information two ways:
   the stages with the faces answerable at each, and the people with the stages
   against their names. `named` lists the stages where the company's own
   six-stage account names the person. `team` marks the two stages that account
   gives to the production team and the team as a whole, which every core
   member shares and the adviser does not.
   ========================================================================== */

export interface Member {
  name: string;
  role: string;
  asset?: AssetKey;
  /* First line is the claim, the rest is the evidence for it. */
  bio: string[];
  /* Stage numbers (1 to 6) where the person is named by the company's account. */
  named: number[];
  /* Whether the person shares the two team stages (5 and 6). */
  team: boolean;
}

export interface Stage {
  n: string;
  stage: string;
  who: string;
  checks: string;
  /* Portraits of the people the company's account NAMES at this stage. The
     two team stages carry none: the account says "the production team" and
     "the team" without naming anyone, and drawing five faces there would
     assert who does that check. The track shows a team mark instead, and the
     per-person marks carry the whole-team state. */
  faces: AssetKey[];
  /* The two stages the company's account gives to the team as a whole. */
  shared?: boolean;
  /* Where the account says a release can be delayed. */
  hold?: boolean;
}

export const TEAM: Member[] = [
  {
    name: "Conor Sexton",
    role: "Founder and CEO",
    asset: "person.conor",
    named: [1],
    team: true,
    bio: [
      "Conor created The Pawsitive Pugs & Pals® and leads the company's strategy, commercial development, partnerships and audience research.",
      "He came to it from thirteen years in food retail, progressing from apprentice to head butcher. After a life-changing accident in 2020 he returned to education as a mature student, took a QQI Level 6 in Marketing with distinction, and is completing a Bachelor of Business in Marketing at Munster Technological University, where he also went through the Student Inc. programme.",
      "Becoming a father is what gave the company its purpose: building around what parents, educators and children actually need rather than around what the technology makes possible.",
    ],
  },
  {
    name: "Alan Compton",
    role: "Creative Director",
    asset: "person.alan",
    named: [1, 2],
    team: true,
    bio: [
      "Alan writes and directs. The look of the world, the performances and the pace of an episode are his call.",
      "He is an award-winning photographer and filmmaker with more than two decades across visual storytelling, design and creative direction, and over fifteen years in commercial film and television. He has worked with international NGOs and commercial clients across Africa, Europe, Asia, the Middle East and North America, on healthcare, humanitarian response and international development.",
      "His photography has been honoured several times at the Prix de la Photographie Paris, including Portrait Photographer of the Year, and his communications work with Nobody Left Outside won a SABRE Award. He has exhibited in London, Paris and Bangkok, most recently at the Royal Albert Hall as part of Nitin Sawhney's Journeys Festival.",
    ],
  },
  {
    name: "Paula Walshe PhD",
    role: "Education Director",
    asset: "person.paula",
    named: [3],
    team: true,
    bio: [
      "Paula reviews the learning intent of every episode and the offline activities that follow it.",
      "She lectures in early childhood education at South East Technological University in Carlow. Her doctoral research was on STEM and STEAM in early childhood education, and her book Full STEAM Ahead is a practical guide to playful STEAM learning with young children.",
      "She co-chairs Ireland's Early Childhood STEAM Network, is a forum member of the Women in Digital European initiative, and sits on the EECERA College of Reviewers.",
    ],
  },
  {
    name: "Lydia Harding",
    role: "Executive Producer",
    asset: "person.lydia",
    named: [4],
    team: true,
    bio: [
      "Lydia reads every script and every production from a parent's point of view, and from a child's.",
      "She has worked with children with intellectual disabilities, including through horse riding, where she saw how far confidence, communication and independence can go when a child is given the right support.",
      "Her brief here is inclusion: that every child has their own strengths, pace and way of understanding the world, and that an episode should help children recognise and respect difference rather than smooth it away.",
    ],
  },
  {
    name: "Kirstie",
    role: "Child Development Consultant",
    asset: "person.kirstie",
    named: [4],
    team: true,
    bio: [
      "Kirstie checks that what gets made is age-appropriate and grounded in real early years practice.",
      "She has over thirty years of hands-on experience in childcare and early education, is qualified in Early Childhood Development and Education and is a fully qualified SNA. She has worked in Montessori and Steiner-based playgroups, outdoor preschools and community crèches.",
      "She is a mother of four grown children.",
    ],
  },
  {
    name: "Mansi",
    role: "Production Coordination",
    /* The one person in the review sequence the handoff sent no photograph or
       biography for. Listed rather than dropped, because she appears in the
       sequence on the home page and on Responsible AI. CONTENT-NEEDED.md. */
    named: [],
    team: true,
    bio: [
      "Mansi holds the schedule together, so that a note raised at one review stage reaches the people who have to act on it.",
    ],
  },
];

export const ADVISORS: Member[] = [
  {
    name: "David Toth",
    role: "Strategic Advisor",
    asset: "person.david",
    named: [],
    team: false,
    bio: [
      "David shapes platform strategy and the low-stimulation media framework that connects screen time to real-world creativity, nature and offline play.",
      "He is a children's media professional specialising in educational rubrics, content strategy and creator coaching, with over two decades advising youth brands including Nickelodeon, LEGO and BBC Kids on content quality and platform safety.",
      "He has also managed global operations for animation properties at Warner Bros. Studios, including Cartoon Network and DC Entertainment.",
    ],
  },
];

/* The six stages are the company's own account. The full sentences for each
   stage live on the Responsible AI page, which owns that account; here each
   stage carries one clause, enough to label it on the track, so a reader
   going Home to Team to Responsible AI does not read the same six sentences
   three times. */
export const STAGES: Stage[] = [
  {
    n: "01",
    stage: "Concept and story",
    who: "Conor and Alan",
    checks: "Concept, story and learning goal, set before production begins.",
    faces: ["person.conor", "person.alan"],
  },
  {
    n: "02",
    stage: "Script and direction",
    who: "Alan Compton",
    checks: "Script written, production directed, assets specified by the team.",
    faces: ["person.alan"],
  },
  {
    n: "03",
    stage: "Educational review",
    who: "Paula Walshe PhD",
    checks: "Learning intent and the offline activities, against early years practice.",
    faces: ["person.paula"],
  },
  {
    n: "04",
    stage: "Parent and early years review",
    who: "Lydia and Kirstie",
    checks: "Script and production read from a parent's point of view, and a child's.",
    faces: ["person.lydia", "person.kirstie"],
  },
  {
    n: "05",
    stage: "Quality and suitability",
    who: "The production team",
    checks: "Voices and visuals checked for quality and suitability.",
    faces: [],
    shared: true,
  },
  {
    n: "06",
    stage: "Final review and approval",
    who: "The team",
    checks: "The finished episode inspected, changes requested where needed.",
    faces: [],
    shared: true,
    hold: true,
  },
];
