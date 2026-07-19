/**
 * Progressive-enhancement replay for Next.js / React 19 server-action forms.
 *
 * A no-JS browser submits an action-wired <form> as a multipart POST back to
 * the page URL, carrying React's hidden `$ACTION_*` fields (`$ACTION_REF_n`,
 * `$ACTION_n:0`, `$ACTION_n:1`, `$ACTION_KEY`) plus the visible fields.
 * These helpers scrape those hidden fields from the SSR HTML and rebuild
 * that exact POST — so the tests exercise the real HTTP contract of the
 * server actions, not an internal API.
 */

const entityMap: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&#x27;": "'",
  "&#39;": "'",
};

export function decodeHtmlEntities(s: string): string {
  return s.replace(/&(?:quot|amp|lt|gt|#x27|#39);/g, (m) => entityMap[m]);
}

/**
 * Extract the hidden $ACTION_* inputs from the first <form> in `html`.
 * Throws if none are found (the page did not SSR an action form).
 */
export function extractActionFields(html: string): Map<string, string> {
  const formMatch = html.match(/<form[^>]*>[\s\S]*?<\/form>/);
  if (!formMatch) throw new Error("no <form> found in page HTML");
  const form = formMatch[0];

  const fields = new Map<string, string>();
  const inputRe = /<input\b[^>]*type="hidden"[^>]*>/g;
  for (const tag of form.match(inputRe) ?? []) {
    const name = tag.match(/name="([^"]*)"/)?.[1];
    if (!name || !name.startsWith("$ACTION")) continue;
    const value = tag.match(/value="([^"]*)"/)?.[1] ?? "";
    fields.set(decodeHtmlEntities(name), decodeHtmlEntities(value));
  }
  if (fields.size === 0) {
    throw new Error("no $ACTION_* hidden fields found — not an action form");
  }
  return fields;
}

/**
 * Fetch `pageUrl`, scrape the action form, and POST it back with
 * `userFields` filled in — exactly what a JS-disabled browser would do.
 * Returns the raw (un-followed) response so callers can assert on the
 * redirect status and Set-Cookie headers.
 */
export async function submitActionForm(
  pageUrl: string,
  userFields: Record<string, string>,
  init?: { cookie?: string }
): Promise<{ response: Response; requestHtml: string }> {
  const pageRes = await fetch(pageUrl, {
    headers: init?.cookie ? { cookie: init.cookie } : undefined,
  });
  if (!pageRes.ok) {
    throw new Error(`GET ${pageUrl} -> ${pageRes.status}`);
  }
  const html = await pageRes.text();
  const fields = extractActionFields(html);

  const body = new FormData();
  for (const [k, v] of fields) body.append(k, v);
  for (const [k, v] of Object.entries(userFields)) body.append(k, v);

  const response = await fetch(pageUrl, {
    method: "POST",
    body,
    redirect: "manual",
    headers: init?.cookie ? { cookie: init.cookie } : undefined,
  });
  return { response, requestHtml: html };
}

/** Pull a named cookie's value out of a response's Set-Cookie headers. */
export function cookieFromResponse(
  res: Response,
  name: string
): string | null {
  for (const sc of res.headers.getSetCookie()) {
    const m = sc.match(new RegExp(`^${name}=([^;]*)`));
    if (m) return m[1];
  }
  return null;
}
