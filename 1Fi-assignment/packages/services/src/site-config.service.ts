import {
  db,
  footerCategoryGroups,
  companyInfo,
  quickLinks,
  supportLinks,
  socialLinks,
} from "@1fi/db"
import { getCached, setCache } from "./helper/redis.js"

const CACHE_KEY = "site_config"

export async function getFooterCategoryGroups() {
  const cacheKey = `${CACHE_KEY}:footer`
  const cached = await getCached<(typeof footerCategoryGroups.$inferSelect)[]>(cacheKey)
  if (cached) return cached

  const data = await db.select().from(footerCategoryGroups)
  await setCache(cacheKey, data)
  return data
}

export async function getCompanyInfo() {
  const cacheKey = `${CACHE_KEY}:company`
  const cached = await getCached<typeof companyInfo.$inferSelect>(cacheKey)
  if (cached) return cached

  const results = await db.select().from(companyInfo).limit(1)
  const result = results[0]
  if (result) await setCache(cacheKey, result)
  return result
}

export async function getQuickLinks() {
  const cacheKey = `${CACHE_KEY}:quick_links`
  const cached = await getCached<(typeof quickLinks.$inferSelect)[]>(cacheKey)
  if (cached) return cached

  const data = await db.select().from(quickLinks)
  await setCache(cacheKey, data)
  return data
}

export async function getSupportLinks() {
  const cacheKey = `${CACHE_KEY}:support_links`
  const cached = await getCached<(typeof supportLinks.$inferSelect)[]>(cacheKey)
  if (cached) return cached

  const data = await db.select().from(supportLinks)
  await setCache(cacheKey, data)
  return data
}

export async function getSocialLinks() {
  const cacheKey = `${CACHE_KEY}:social`
  const cached = await getCached<(typeof socialLinks.$inferSelect)[]>(cacheKey)
  if (cached) return cached

  const data = await db.select().from(socialLinks)
  await setCache(cacheKey, data)
  return data
}
