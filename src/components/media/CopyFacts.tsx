import { useEffect, useState } from "react";
import { IconCheck } from "@/components/icons";

/* ============================================================================
   "Copy the facts": the one thing a web page can do with a press sheet that
   paper cannot. Writes the Facts group to the clipboard as plain
   `Key: value` lines, with the marks and the É as real characters.

   Text only, in the house link style: icons.tsx has no copy glyph and none
   is drawn for it. The label swaps to "Copied" for a moment, announced
   politely. Where the clipboard is unavailable the control is not rendered:
   the sheet is still on the page to select by hand.
   ========================================================================== */
export function CopyFacts({ text }: { text: string }) {
  const [can, setCan] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCan(typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function");
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setDone(false), 1500);
    return () => window.clearTimeout(t);
  }, [done]);

  if (!can) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
    } catch {
      /* Refused by the browser. The sheet is still on screen. */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="kit-copy link-draw inline-flex w-full min-h-[48px] items-center gap-1.5 text-[15px] font-semibold text-red-deep sm:w-auto sm:min-h-[44px]"
    >
      {done ? (
        <>
          Copied
          <IconCheck size={15} />
        </>
      ) : (
        "Copy the facts"
      )}
    </button>
  );
}
