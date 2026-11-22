import { STATIONS, DO_NOT } from "./stations";

/* Repeated items on the Responsible AI page, as plain strings. cms.ts passes
   these same arrays to list(...) and the components read them with useList,
   so a default here is the page exactly as it was. Anything that is not text
   (the phase kind and its company number, which the Figure 1 drawing and the
   2.n numbering follow) stays in stations.ts, matched by position. */

/* Sub-clauses 2.1 to 2.5 and the tool station, in Figure 1's order. */
export const PHASE_ITEMS = STATIONS.map((s) => ({ title: s.title, who: s.who, body: s.body }));

/* Clause 3, the tools table. */
export const TOOL_ITEMS = [
  {
    name: "Runway",
    used: "Elements of visual production and animation, to the script and direction set by the team.",
    before: "Directed, reviewed and approved by the team.",
  },
  {
    name: "ElevenLabs",
    used: "Elements of audio and voice production.",
    before: "Reviewed for quality and suitability before release.",
  },
];

/* Sub-clause 2.7. */
export const FOR_ITEMS = [
  {
    who: "For the child",
    line: "We pace every story in a developmentally appropriate way for young children: one idea at a time, giving them room to notice and time to breathe. When an episode ends, the next episode does not autoplay.",
  },
  {
    who: "For the parent",
    line: "No in-game purchases and no algorithmic recommendations, so nothing in it is designed to keep a child watching.",
  },
  {
    who: "For the educator",
    line: "Learning intent set before production and checked by an early years specialist, with printable activities that take it off the screen.",
  },
];

/* Clause 4: the table above the line, the table below it, the three refusals. */
export const PEOPLE_ITEMS = [
  { text: "What a story should teach" },
  { text: "How a character behaves" },
  { text: "What is appropriate for the children watching" },
  { text: "Every learning objective and activity" },
];

export const LINE_TOOL_ITEMS = [
  { name: "Runway", does: "Elements of visual production and animation" },
  { name: "ElevenLabs", does: "Elements of audio and voice production" },
];

export const REFUSAL_ITEMS = DO_NOT.map((text) => ({ text }));

/* Clause 5. */
export const COMMITMENT_ITEMS = [
  {
    title: "Human creativity comes first",
    body: "Characters, stories, educational objectives, scripts and creative direction all begin with people. Tools can help bring those ideas to screen. They do not decide what a story should teach, how a character should behave, or what is appropriate for the children watching.",
  },
  {
    title: "Human oversight at every stage",
    body: "Using AI does not remove responsibility. Our team reviews, directs and refines the work throughout production. Outputs are not automatically generated and published.",
  },
  {
    title: "Protecting original IP",
    body: "The Pawsitive Pugs & Pals®, its characters and its world are original intellectual property. We do not intentionally use AI to reproduce the identifiable style, characters or IP of other creators or children's brands. The aim is to build our own world rather than imitate somebody else's.",
  },
  {
    title: "Children's interests come before technology",
    body: "The fact that technology can do something does not mean we should. Decisions are guided by the child's experience first: calm, age-appropriate content that moves a child beyond passive viewing into play, conversation and offline learning.",
  },
  {
    title: "Education requires human judgement",
    body: "Educators and early years experts set the learning goal and educational intention behind every episode, every storyline and every activity, and are involved every step of the way.",
  },
  {
    title: "Transparency matters",
    body: "We will not pretend AI is absent from our process. Equally, calling our programmes simply AI-generated misrepresents the human development, direction and review involved. We prefer the clearer description at the top of this page.",
  },
];

/* Appendix A. */
export const QUESTION_ITEMS = [
  {
    q: "Which tools are used?",
    a: "Runway, for elements of visual production and animation, and ElevenLabs, for elements of audio and voice production. Both sit inside a human-led workflow rather than operating as autonomous content creators. As the technology changes we will keep reviewing the platforms we use, their commercial terms, and how they align with our standards on intellectual property, consent and responsible production.",
  },
  {
    q: "Who writes and approves the stories?",
    a: "Conor and Alan set the concept and the story. Alan writes the script and directs production. The finished episode is reviewed by the team before release, and any of them can ask for changes.",
  },
  {
    q: "How are educational decisions made?",
    a: "Scripts and episodes are developed under Alan's creative direction with educational input from Dr Paula Walshe. Conor, Paula, David Toth, Lydia Harding and Kirstie Harding contribute to the human review process. Those judgements are made by people, and we do not automate them.",
  },
  {
    q: "What happens when a review identifies a problem?",
    a: "The work is revised and re-reviewed, and the team watches and revises again until everyone is happy with the episode and signs it off for release. Getting an episode right matters more to us than getting it out on the original date.",
  },
];
