/* The date a document's wording was last written, formatted the way the
   documents print it ("24 October 2026").

   The ISO date is read as UTC, so the formatted day cannot slip backwards for
   a reader west of Greenwich. Never pass a live date: a document that says it
   was revised on the day you opened it is a false statement. */
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** The label every document uses for its date, on the title block and in
 *  the foot line. It says "wording" so it can never read as an adoption or a
 *  review date (cross-site rule 5). */
export const REVISED_LABEL = "Wording last revised";
