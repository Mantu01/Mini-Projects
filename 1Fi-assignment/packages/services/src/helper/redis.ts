import { Redis } from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

const DEFAULT_TTL = 300

export async function getCached<T>(key: string): Promise<T | null> {
  const data = await redis.get(key)
  if (!data) return null
  return JSON.parse(data) as T
}

export async function setCache(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
  await redis.set(key, JSON.stringify(value), "EX", ttl)
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

export { redis }
