/* One check for every web address an editor types into the App, Links and
   Media panels. The contract makes store and social links https:// only and
   lets a press link be http:// as well, because an old article may still sit
   on a plain address. Returns the sentence to show by the field, or null. */

export function urlError(value: string, opts: { allowHttp?: boolean } = {}): string | null {
  const t = value.trim();
  if (!t) return null;
  let u: URL;
  try {
    u = new URL(t);
  } catch {
    return "Enter the full web address, starting with https://.";
  }
  if (u.protocol === "https:") return null;
  if (u.protocol === "http:" && opts.allowHttp) return null;
  return opts.allowHttp ? "The address must start with https:// or http://." : "The address must start with https://.";
}

/** Trimmed, or null when empty, for a nullable column. */
export function urlOrNull(value: string): string | null {
  const t = value.trim();
  return t ? t : null;
}
