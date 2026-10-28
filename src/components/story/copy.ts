/* The story page's editable copy, keyed by block key (src/lib/blocks.ts).

   The default, not a copy: each string is the page's own wording, character
   for character, rendered through useBlock("story", key, COPY[key]) so an
   empty content_blocks table shows the page exactly as written here. No
   string carries *stars*: nothing on this page sets a clause apart. The
   portrait is an image block (hero.image) and has no entry here.

   THE PAGE IS A LETTER, 2026-10-28. The headline is sentence one of the
   letter, verbatim, and the letter's own paragraphs follow in four
   movements, each a multi-paragraph block (paragraphs separated by a blank
   line). The dateline is one line per row: name, title, place. The year
   joins the place line only when the client gives it; nothing here sets a
   date.

   film.heading STAYS BUT IS NOT READ. "The mission, in his own words" asserts
   who narrates the film, which nobody has confirmed. The page renders no
   heading over the film and labels the player "The mission film" until the
   client answers; the key is kept so a saved row is not lost. */
export const COPY: Record<string, string> = {
  "hero.eyebrow_sub": "Conor Sexton\nFounder and CEO\nCo. Cork",
  "hero.title": "The idea for CLÉ Family Media began while I was minding a friend's four-year-old son.",
  "letter.open":
    "He was watching YouTube when something came up that was not appropriate for his age. My fiancée, Lydia, was pregnant with our little girl at the time.",
  "letter.saw": [
    "I spent a year researching children's media and developing an approach for a low-stimulation educational cartoon. I knew I could not build it alone, so I began bringing together people with the creative and educational experience the project needed.",
    "Paula was involved from the beginning. We had never met in person, but I spoke to her online and shared my vision and ambition. She wanted to be involved while the early work on production tools, pacing and voices was still taking shape. Education was part of the project from the outset.",
    "There was less of it than I expected. Plenty of shows were gentle. Plenty were educational. Very few were both, and fewer still would tell you anything about who had made them or who had checked them before they reached a child.",
  ].join("\n\n"),
  "garden.caption":
    "The garden the series is set in, with its rope swing. A frame from The Pawsitive Pugs & Pals®.",
  "letter.here": [
    "I spent thirteen years in food retail, starting as an apprentice and finishing as head butcher. It is not the background anyone expects behind a children's media company, and I would not trade it.",
    "You learn quickly what people actually want when they are standing in front of you, and you learn to run a counter that does not fall apart on a Saturday.",
    "A life-changing accident in 2020 ended that direction. I went back to education as a mature student instead, took a QQI Level 6 in Marketing with distinction, and I am studying for a Bachelor of Business in Marketing at Munster Technological University, where I also went through the Student Inc. programme.",
    "Returning to education gave me the opportunity to build something new.",
  ].join("\n\n"),
  "letter.people":
    "The company came together around people who knew far more than I did: Alan on the creative side, who writes the scripts, directs and sets the pace of an episode; Paula on the educational side, who brings the learning expertise and reads every draft; Lydia, Kirstie and David bringing the parent, early years and industry perspectives that catch details which may be missed during production.",
  "letter.build": [
    "That work became The Pawsitive Pugs & Pals, our first original series. Finn, the fawn pug, and Fia, the black pug, came out of it. The learning was built in from the start rather than added once the scripts were finished, which is a slower way to make a show and, as far as we can tell, the only way to make this one.",
    "Being a small studio is not something we are apologising for. The people who set the story are the same people who read every draft of it, and the work goes round between us until we are all happy with it. That is worth more to me than volume.",
  ].join("\n\n"),
  "build.link": "How an episode is made and reviewed",
  "characters.caption": "Finn and Fia, with a hen. A frame from the series.",
  "letter.reach": [
    "The model is Watch, Play, Learn, and it is more literal than it sounds. Our Watch, Play, Learn approach connects calm stories with interactive games, creative tasks and practical activities children can explore beyond the screen. Each episode introduces ideas children can then explore through games and practical activities.",
    "In practice, families find us free on YouTube, which is simply where discovery happens for a series like ours. The show's own site is where the episodes and the family activities properly live, and we are building a product experience to support ad-free viewing and the offline activities together. That is in development rather than available, and we will say so plainly until the day it is not.",
  ].join("\n\n"),
  "reach.show_link": "The show's own site",
  "reach.app_link": "PupsPlayer™, in development",
  "next.lead": "I would rather answer your questions directly than have you guess at them from a website.",
  "next.link": "Get in touch",
  "sign.name": "Conor Sexton",
  "sign.role": "Founder and CEO, CLÉ Family Media",
  "film.ps": "P.S. The mission film, a little over a minute.",
  "film.heading": "The mission, in his own words",
  "film.note":
    "The film starts muted. Turn the sound on when you are ready to, and the captions are there whether you do or not. Nothing on this site starts talking at you.",
  "close.line": "The people he brought in have a page of their own.",
  "close.link": "Our team",
};
