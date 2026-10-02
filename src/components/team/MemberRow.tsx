import { Figure } from "@/components/Figure";
import { StageMarks } from "./StageMarks";
import type { Member, Stage } from "./people";

/* ============================================================================
   A row in the ledger of core people.

   Three columns on a wide screen: the portrait, the identity (name, role and
   the six stage marks), and the biography at a reading measure. The portrait
   is square with the house radius, which is the shape the asset actually is;
   the track above crops the same faces into circles, so the two views of one
   person look like two views rather than a repeat.

   Mansi has no portrait, so her row is a different shape rather than a row
   with a hole in it: the identity moves into the portrait's place and the
   biography stays on the same axis as every other biography. No disc, no
   initial, no placeholder frame. An empty circle on a page about named people
   reads as a missing person.
   ========================================================================== */

export function MemberRow({ m, stages }: { m: Member; stages: Stage[] }) {
  const identity = (
    <div>
      <h3 className="t-h3">{m.name}</h3>
      <p className="eyebrow mt-2 !text-[11px]">{m.role}</p>
      <div className="mt-5">
        <StageMarks named={m.named} team={m.team} stages={stages} />
      </div>
    </div>
  );

  const bio = (
    <div className="max-w-[62ch] space-y-3.5">
      {m.bio.map((p, i) => (
        <p key={p.slice(0, 24)} className={i === 0 ? "t-body text-ink" : "t-body text-body"}>
          {p}
        </p>
      ))}
    </div>
  );

  if (!m.asset) {
    return (
      <li className="hairline grid gap-y-5 py-10 lg:grid-cols-[200px_minmax(0,17rem)_minmax(0,1fr)] lg:gap-x-12">
        <div className="lg:col-span-2">{identity}</div>
        {bio}
      </li>
    );
  }

  return (
    <li className="hairline grid grid-cols-[96px_minmax(0,1fr)] items-start gap-x-5 gap-y-6 py-10 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-8 lg:grid-cols-[200px_minmax(0,17rem)_minmax(0,1fr)] lg:gap-x-12">
      {/* Width on the wrapper: Figure's own w-full beats a w-* passed into
          className, which is a Tailwind ordering trap. */}
      <div className="w-full [&_picture]:block">
        <Figure
          asset={m.asset}
          rounded="rounded-[var(--radius-md)]"
          className="aspect-square"
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 150px, 96px"
        />
      </div>
      {identity}
      <div className="col-span-2 sm:col-span-1 sm:col-start-2 lg:col-span-1 lg:col-start-3">{bio}</div>
    </li>
  );
}
