/* The home page's editable copy, keyed by block key (src/lib/blocks.ts).

   THIS IS THE DEFAULT, NOT A COPY. Each string is the page's own wording,
   character for character, and the page renders it through
   useBlock("home", key, COPY[key]), so an empty content_blocks table shows
   the page exactly as it is written here. The Pages panel reads the same
   object to show the original beside whatever has been changed.

   Headlines with an accent clause carry it between *stars*, around the same
   words the page wraps in an Underline (see emphasis() in src/lib/content.ts).
   The "Watch. Play. Learn." headline is the brand line and is not here. */
export const COPY: Record<string, string> = {
  "meadow.caption": "Finn and Fia. A frame from the series.",
  "snail.caption": "A frame from the series.",
  "hero.cta_primary": "How we make it",
  "hero.cta_secondary": "Visit the show",
  "thesis.heading": "We are not going to tell anyone their child watches too much television.",
  "thesis.pull": "We would rather an episode started something a child *carries on with*.",
  "thesis.lead_1":
    "We are parents, educators and early childhood experts working together to create meaningful content for children. Children's best interests are at the heart of everything we do. Our calmer, 'pawsitively' paced shows and unique app are not designed just to keep your child watching. We have taken a different approach by creating calmer experiences which aim to promote curiosity and kindness, learning through play, positive off-screen interactions with others and real-world experiences.",
  "thesis.lead_2":
    "Our platform is designed with children's wellbeing in mind: no fast cuts, no endless autoplay, and no trying to grab attention and constantly keep children watching. We are different. We want children to enjoy a meaningful, calm, thoughtful episode and then put the screen down and play, chat, laugh and learn through real-world interactions and experiences.",
  "model.heading":
    "One story to watch, play and learn from.",
  "evidence.heading": "The research we build on.",
  "series.heading": "Our first original series",
  "series.lead":
    "The Pawsitive Pugs & Pals. Finn, the fawn pug, and Fia, the black pug, in a garden that rewards slowing down. Four episodes released so far, nine to eleven minutes each.",
  "ai.heading": "AI is a production tool. *People remain responsible* for the work.",
  "ai.pull":
    "Human judgement at every stage and on every choice about what children see. AI is a tool to assist in our animation production, but it is never the author, never the decision maker. Our real-life, human educators and early childhood experts do that.",
  "ai.cta": "Read the full position",
  "updates.heading": "Occasional updates",
  "updates.body": "Production notes and company news, for adults. Infrequent, and easy to leave.",
};
