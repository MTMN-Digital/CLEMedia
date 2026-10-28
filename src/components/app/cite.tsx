import { Fragment, type ReactNode } from "react";

const SHOW = "The Pawsitive Pugs & Pals";

/**
 * Sets the show's title as `<cite>` wherever it appears in an editable
 * string. The admin types the sentence as plain text; the page keeps the
 * title in italic as the site sets it everywhere else. Builds elements, never
 * HTML, so nothing typed into the panel can inject markup.
 *
 * `mark` appends the registered mark after the first occurrence: the brand
 * carries it on first use per page, and only there.
 */
export function citeShow(text: string, mark = false): ReactNode {
  const parts = text.split(SHOW);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && <cite>{SHOW}</cite>}
      {i === 1 && mark && <>&reg;</>}
      {p}
    </Fragment>
  ));
}
