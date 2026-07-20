/**
 * Real-name sanitization — the single normalizer for every path that writes
 * `participants.real_name`.
 *
 * The facilitator roster renders these strings back (`ControlPanel.tsx`).
 * React escapes them, so there is no XSS; the risk is *visual*. A name made
 * of bidi overrides (U+202E) or zero-width joiners reorders and mangles the
 * lines around it, at the exact moment the facilitator is scanning the roster
 * to see who speaks next. Length alone never caught this — 60 characters of
 * U+202E passed validation cleanly.
 *
 * Pure and dependency-free (no `server-only`) so it is directly unit-testable.
 *
 * Order matters:
 *  1. NFC-normalize, so composed and decomposed forms of the same name agree.
 *  2. Map whitespace-ish controls (tab, newline, CR, FF, VT, NEL) to a plain
 *     space FIRST — deleting them outright would weld words together
 *     ("Sara\nAli" -> "SaraAli").
 *  3. Strip everything remaining in Unicode category C: Cc (controls), Cf
 *     (format — this is what removes U+202E RTL OVERRIDE, U+200B ZWSP,
 *     U+200E/U+200F LRM/RLM), Cs (surrogates), Co (private use), Cn
 *     (unassigned). Arabic renders correctly without any of these: the bidi
 *     algorithm derives direction from the strong characters themselves.
 *  4. Collapse whitespace runs and trim.
 */

/** Controls that carry whitespace intent — become a space, not nothing. */
const WHITESPACE_CONTROLS = /[\t\n\r\f\v]/g;

/** Unicode "other" category: Cc, Cf, Cs, Co, Cn. */
const CONTROL_AND_FORMAT = /\p{C}/gu;

/** Any whitespace run (including exotic Unicode spaces) -> one plain space. */
const WHITESPACE_RUN = /\s+/gu;

/**
 * Normalize a submitted real name for storage and display.
 *
 * Returns a possibly-empty string: a name consisting entirely of control
 * characters legitimately sanitizes to `""`. Callers MUST length-check the
 * RESULT, not the raw input, so such a submission is rejected as invalid
 * rather than stored as blank.
 */
export function sanitizeRealName(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFC")
    .replace(WHITESPACE_CONTROLS, " ")
    .replace(CONTROL_AND_FORMAT, "")
    .replace(WHITESPACE_RUN, " ")
    .trim();
}

/** Bounds for a real name, checked against the SANITIZED value. */
export const REAL_NAME_MIN = 1;
export const REAL_NAME_MAX = 60;

/** True iff the sanitized name is within bounds. */
export function isValidRealName(sanitized: string): boolean {
  return (
    sanitized.length >= REAL_NAME_MIN && sanitized.length <= REAL_NAME_MAX
  );
}
