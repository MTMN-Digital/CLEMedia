import type { AssetKey } from "@/lib/brand";

/**
 * Series one, as the show actually has it.
 *
 * ONE LIST, AND IT USED TO BE THREE. The home page, the app walkthrough and
 * the studio wall on /media each carried their own copy of the same four
 * episodes, which is fine until the day the client sends a new title slate:
 * then one of them says "The Cuckoo's Incredible Journey" and the other two
 * say something else, and nothing fails to build. Adding episodes five and
 * six on 2026-10-11 would have meant three identical edits, so the list moved
 * here and the three surfaces read it.
 *
 * TITLES COME FROM THE SLATES, NOT FROM YOUTUBE. The client's ruling on
 * 2026-10-11, about the folder he sent: "the google drive is named new
 * titles, so we will use them regardless of whether they arent the titles on
 * the youtube videos". So episode 004 is "The Cuckoo" here and on the page,
 * while the video it links to is still titled "The Cuckoo's Incredible
 * Journey" on the channel. That divergence is deliberate and is his call.
 *
 * NUMBERS ARE THE REAL ONES, read off the felted slates and the YouTube
 * metadata rather than off the show site's section ordering, which lists them
 * in a different sequence: The Strawberry is 002 and Chicken Vision is 003,
 * where the show site implies the reverse.
 *
 * `released: false` MEANS WE KNOW NOTHING ABOUT IT BUT ITS NAME AND ITS ART.
 * No runtime, no link, no synopsis, because none has been supplied and this
 * site does not invent a claim it has not been given. Every surface that
 * renders an episode has to cope with all three being absent; that is what
 * the optional fields are for, and it is why they are optional rather than
 * empty strings.
 */
export interface Episode {
  n: string;
  title: string;
  asset: AssetKey;
  /** True once it is on the channel. False means art and a title, nothing else. */
  released: boolean;
  /** The video. Absent until it exists. */
  href?: string;
  /** The real duration. Absent until measured. */
  runtime?: string;
  /** The show's own synopsis. Absent until supplied. */
  line?: string;
  guidance?: string;
  reviewer?: string;
}

export const EPISODES: Episode[] = [
  {
    n: "001", title: "The Feather", asset: "slate.ep1", released: true,
    runtime: "9:16", href: "https://www.youtube.com/watch?v=duMH0f12JM0",
    line: "A drifting feather leads Finn and Fia on a garden adventure where slowing down helps them discover the hidden beauty of the tiny world around them.",
  },
  {
    n: "002", title: "The Strawberry", asset: "slate.ep2", released: true,
    runtime: "11:10", href: "https://www.youtube.com/watch?v=ZzhkZJgQEK0",
    line: "After a rainy night in the garden, Finn and Fia help a tiny field mouse reach a strawberry just out of reach.",
  },
  {
    n: "003", title: "Chicken Vision", asset: "slate.ep3", released: true,
    runtime: "10:41", href: "https://www.youtube.com/watch?v=CpgIzsn500Q",
    line: "Finn and Fia meet a hen who sees the garden differently, and discover the world can look magical in many different ways.",
  },
  {
    n: "004", title: "The Cuckoo", asset: "slate.ep4", released: true,
    runtime: "9:58", href: "https://www.youtube.com/watch?v=yHYYBpMfE6M",
    line: "Finn and Fia go on a new adventure and meet a cuckoo who has travelled a very long way to get back to the garden.",
  },
  { n: "005", title: "Colour Quest", asset: "slate.ep5", released: false },
  { n: "006", title: "Fluffy Clouds", asset: "slate.ep6", released: false },
];

/** The ones a visitor can actually watch today. */
export const RELEASED = EPISODES.filter((e) => e.released);

/**
 * The words on an unreleased tile. One constant, because it appears on three
 * surfaces and the client chose these two words.
 */
export const COMING_SOON = "Coming soon";
