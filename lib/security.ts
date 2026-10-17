/**
 * In-memory rate limiting store
 * For production, use Redis instead
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for an IP
 * @param ip - Client IP address
 * @param maxAttempts - Max attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if within limit, false if exceeded
 */
export function checkRateLimit(
  ip: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // No record or window expired
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  // Check if limit exceeded
  if (record.count >= maxAttempts) {
    return false;
  }

  // Increment and allow
  record.count++;
  return true;
}

/**
 * Get client IP from NextRequest
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";
  return ip.trim();
}
