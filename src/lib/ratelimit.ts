import { NextRequest } from 'next/server'

type RateLimitEntry = {
  count: number
  lastRequest: number
  resetTime: number
}

const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const MAX_REQUESTS = 10 // 10 requests per minute

const ipStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  request: NextRequest,
  limit: number = MAX_REQUESTS,
  windowMs: number = RATE_LIMIT_WINDOW
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = (request as { ip?: string }).ip || request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown'
  const now = Date.now()
  
  const record = ipStore.get(ip)
  
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs
    ipStore.set(ip, { count: 1, lastRequest: now, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  record.count++
  record.lastRequest = now
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime }
}

// Legacy function for backward compatibility
export function rateLimit(ip: string) {
  const now = Date.now()
  const entry = ipStore.get(ip)

  if (!entry) {
    ipStore.set(ip, { count: 1, lastRequest: now, resetTime: now + RATE_LIMIT_WINDOW })
    return { success: true }
  }

  if (now - entry.lastRequest > RATE_LIMIT_WINDOW) {
    ipStore.set(ip, { count: 1, lastRequest: now, resetTime: now + RATE_LIMIT_WINDOW })
    return { success: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false }
  }

  entry.count++
  return { success: true }
}
