type RateLimitEntry = {
  count: number;
  lastRequest: number;
};

const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 3;

const ipStore = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry) {
    ipStore.set(ip, { count: 1, lastRequest: now });
    return { success: true };
  }

  if (now - entry.lastRequest > RATE_LIMIT_WINDOW) {
    ipStore.set(ip, { count: 1, lastRequest: now });
    return { success: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false };
  }

  entry.count++;
  return { success: true };
}
