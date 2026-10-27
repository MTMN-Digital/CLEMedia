import { useId, useEffect, useState, type SelectHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { SLUG_PATTERN, parseEuro, slugify, formatEuro } from "@/lib/admin";

/* Form primitives on the site's own .field-* classes. Every control has a
   visible label, an optional hint and an error line tied to it with
   aria-describedby. Inputs are 16px or more so iOS never zooms on focus. */

export interface FieldProps {
  label: string;
  /** Shown under the control in smaller type. */
  hint?: ReactNode;
  /** Shown in red under the control, and marks the control invalid. */
  error?: string | null;
  /** Adds "(optional)" after the label. */
  optional?: boolean;
  className?: string;
}

function useFieldIds() {
  const id = useId();
  return { id, hintId: `${id}-hint`, errId: `${id}-err` };
}

function describedBy(hint: unknown, error: unknown, ids: { errId: string; hintId: string }) {
  return [hint ? ids.hintId : null, error ? ids.errId : null].filter(Boolean).join(" ") || undefined;
}

/** Wraps any control: label, control, hint, error. `children` receives the ids. */
export function Field({
  label,
  hint,
  error,
  optional,
  className = "",
  children,
}: FieldProps & { children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode }) {
  const ids = useFieldIds();
  return (
    <div className={`adm-field ${className}`}>
      <label htmlFor={ids.id} className="field-label">
        {label}
        {optional && <span className="opt"> (optional)</span>}
      </label>
      {children({ id: ids.id, describedBy: describedBy(hint, error, ids), invalid: Boolean(error) })}
      {hint && <p id={ids.hintId} className="adm-hint">{hint}</p>}
      {error && <p id={ids.errId} className="adm-error">{error}</p>}
    </div>
  );
}

type InputProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/** One line of text. */
export function TextInput({ label, hint, error, optional, className, value, onChange, ...rest }: InputProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          className={`field-input ${invalid ? "is-error" : ""}`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      )}
    </Field>
  );
}

type AreaProps = FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

/** Several lines of plain text. Paragraphs are separated by a blank line. */
export function TextArea({ label, hint, error, optional, className, value, onChange, rows = 5, ...rest }: AreaProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          rows={rows}
          className={`field-textarea ${invalid ? "is-error" : ""}`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      )}
    </Field>
  );
}

type SelectProps = FieldProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  onChange: (value: string) => void;
  value: string;
  options: { value: string; label: string }[];
};

/** A native select: the phone's own picker is the best one there is. */
export function Select({ label, hint, error, optional, className, value, onChange, options, ...rest }: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} optional={optional} className={className}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          className={`field-input ${invalid ? "is-error" : ""}`}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** A checkbox with its label beside it. */
export function Checkbox({ label, hint, checked, onChange, disabled }: { disabled?: boolean; hint?: ReactNode; checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  const id = useId();
  return (
    <div className="adm-field">
      <label className="adm-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} aria-describedby={hint ? `${id}-hint` : undefined} />
        <span>{label}</span>
      </label>
      {hint && <p id={`${id}-hint`} className="adm-hint">{hint}</p>}
    </div>
  );
}

/**
 * Two to four options, one choice. Used for published/hidden, filters, and
 * core team/adviser. Each option is a toggle button with aria-pressed.
 */
export function Segmented<V extends string>({ label, value, onChange, options, hideLabel }: { value: V; hideLabel?: boolean; onChange: (v: V) => void; options: { value: V; label: string }[]; label: string }) {
  const id = useId();
  return (
    <div className="adm-field">
      <p id={id} className={hideLabel ? "adm-sr" : "field-label"}>{label}</p>
      <div className="adm-seg" role="group" aria-labelledby={id}>
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** ISO string to the value a datetime-local input wants, in local time. */
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** A datetime-local value back to an ISO string, or null when empty. */
export function fromLocalInput(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Date and time, in the viewer's local time. `value` and `onChange` are ISO strings or null. */
export function DateTimeInput({ label, hint, error, optional, value, onChange }: FieldProps & { value: string | null; onChange: (iso: string | null) => void }) {
  return (
    <TextInput
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      type="datetime-local"
      value={toLocalInput(value)}
      onChange={(v) => onChange(fromLocalInput(v))}
    />
  );
}

/**
 * The web address of an item. Follows `source` (usually the title) until the
 * editor types in it, then stays as typed. Shows the full address it makes.
 * `prefix` is the path before the slug, e.g. "/shop/".
 *
 * Validity: call `slugError(value)`; the field shows that error itself too.
 */
export function SlugField({ value, onChange, source, prefix, label = "Web address", error }: { label?: string; prefix: string; value: string; error?: string | null; onChange: (v: string) => void; source: string }) {
  const [touched, setTouched] = useState(Boolean(value) && value !== slugify(source));
  const shown = touched ? value : slugify(source);
  useEffect(() => {
    if (!touched && shown !== value) onChange(shown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, touched]);
  const own = slugError(shown);
  return (
    <TextInput
      label={label}
      value={shown}
      onChange={(v) => {
        setTouched(true);
        onChange(v.toLowerCase().replace(/\s+/g, "-"));
      }}
      error={error ?? (shown ? own : null)}
      hint={<>The page will be at <strong>{prefix}{shown || "..."}</strong>. Lower case letters, numbers and hyphens.</>}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      inputMode="url"
    />
  );
}

/** Null when the slug is usable, otherwise why not. */
export function slugError(slug: string): string | null {
  if (!slug) return "A web address is required.";
  if (!SLUG_PATTERN.test(slug)) return "Use only lower case letters, numbers and single hyphens.";
  return null;
}

/**
 * A price in euro. The editor types "4.99"; the value is integer cents
 * (499) or null while what is typed is not a price.
 */
export function PriceField({ label = "Price", cents, onChange, error, hint }: { onChange: (cents: number | null) => void; hint?: ReactNode; cents: number | null; error?: string | null; label?: string }) {
  const [text, setText] = useState(cents != null ? (cents / 100).toFixed(2) : "");
  const parsed = parseEuro(text);
  const own = text && parsed == null ? "Enter a price like 4.99." : null;
  return (
    <Field label={label} hint={hint ?? (parsed != null ? `Shown on the site as ${formatEuro(parsed)}.` : "In euro, for example 4.99.")} error={error ?? own}>
      {({ id, describedBy, invalid }) => (
        <div className="adm-prefix">
          <span aria-hidden="true">€</span>
          <input
            id={id}
            className={`field-input ${invalid ? "is-error" : ""}`}
            inputMode="decimal"
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onChange(parseEuro(e.target.value));
            }}
          />
        </div>
      )}
    </Field>
  );
}
