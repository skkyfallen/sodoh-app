const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

type JsonBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; status: 400 | 413 | 415 };

type StringFieldResult = { valid: boolean; value: string | null };

const requestCounts = new Map<string, { count: number; resetAt: number }>();
let nextRateLimitCleanupAt = 0;

/**
 * Best-effort process-local rate limit. This is not shared across server
 * instances and should not be treated as a global/distributed limiter.
 */
export function isRateLimited(request: Request, route: string): boolean {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",", 1)[0]?.trim() || "unknown";
  const key = `${route}:${ip}`;
  const now = Date.now();

  if (now >= nextRateLimitCleanupAt) {
    for (const [entryKey, entry] of requestCounts) {
      if (entry.resetAt <= now) requestCounts.delete(entryKey);
    }
    nextRateLimitCleanupAt = now + 60_000;
  }

  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    if (requestCounts.size >= MAX_RATE_LIMIT_ENTRIES) {
      const oldestKey = requestCounts.keys().next().value;
      if (oldestKey !== undefined) requestCounts.delete(oldestKey);
    }
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  current.count += 1;
  return false;
}

/** Read a bounded JSON object without buffering an arbitrarily large body. */
export async function readJsonObject(request: Request): Promise<JsonBodyResult> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) return { ok: false, status: 400 };
    const declaredLength = Number(contentLength);
    if (declaredLength > MAX_BODY_BYTES) return { ok: false, status: 413 };
    if (!Number.isSafeInteger(declaredLength)) return { ok: false, status: 400 };
  }

  if (!request.body) return { ok: false, status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => undefined);
        return { ok: false, status: 413 };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, status: 400 };
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const contentType = request.headers.get("content-type");
  if (!contentType || !/^application\/json(?:\s*;|$)/i.test(contentType.trim())) {
    return { ok: false, status: 415 };
  }

  try {
    const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, status: 400 };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** Trim and cap an untrusted string field. Missing/null optional fields are null. */
export function getStringField(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  required = false,
): StringFieldResult {
  const raw = body[key];
  if (raw === undefined || raw === null) {
    return { valid: !required, value: null };
  }
  if (typeof raw !== "string") return { valid: false, value: null };

  const value = raw.trim();
  if (value.length > maxLength || (required && value.length === 0)) {
    return { valid: false, value: null };
  }
  return { valid: true, value: value || null };
}

/** A bounded sanity check that rejects malformed or whitespace-containing addresses. */
export function isValidEmail(email: string): boolean {
  if (email.length > 254 || /\s/.test(email)) return false;
  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return false;
  }

  const labels = domain.split(".");
  return labels.length >= 2 && labels.every((label) =>
    label.length > 0 &&
    label.length <= 63 &&
    /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label),
  );
}
