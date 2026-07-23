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

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 * - Min 8 chars
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

/**
 * Get password strength feedback
 */
export function getPasswordStrengthFeedback(password: string): string[] {
  const feedback: string[] = [];
  if (password.length < 8) feedback.push("At least 8 characters required");
  if (!/[A-Z]/.test(password)) feedback.push("At least one uppercase letter required");
  if (!/[a-z]/.test(password)) feedback.push("At least one lowercase letter required");
  if (!/[0-9]/.test(password)) feedback.push("At least one number required");
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    feedback.push("At least one special character required");
  return feedback;
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Limit length
    .replace(/[<>]/g, ""); // Remove potential HTML tags
}
