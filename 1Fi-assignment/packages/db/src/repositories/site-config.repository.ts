import { eq, asc } from "drizzle-orm"
import { db } from "../index.js"
import {
  footerCategoryGroups,
  companyInfo,
  quickLinks,
  supportLinks,
  socialLinks,
} from "../schema/index.js"
import {
  InsertFooterCategoryGroup,
  InsertCompanyInfo,
  InsertQuickLink,
  InsertSupportLink,
  InsertSocialLink,
} from "../zod/index.js"
import {
  FooterCategoryGroup,
  CompanyInfo,
  QuickLink,
  SupportLink,
  SocialLink,
} from "../types.js"

export async function createFooterCategoryGroup(
  data: InsertFooterCategoryGroup,
): Promise<FooterCategoryGroup> {
  const result = await db
    .insert(footerCategoryGroups)
    .values(data)
    .returning()
  if (!result[0]) throw new Error("Failed to create footer category group")
  return result[0]
}

export async function getAllFooterCategoryGroups(): Promise<
  FooterCategoryGroup[]
> {
  return db
    .select()
    .from(footerCategoryGroups)
    .orderBy(asc(footerCategoryGroups.sortOrder))
}

export async function updateFooterCategoryGroup(
  id: string,
  data: Partial<InsertFooterCategoryGroup>,
): Promise<FooterCategoryGroup | undefined> {
  const result = await db
    .update(footerCategoryGroups)
    .set(data)
    .where(eq(footerCategoryGroups.id, id))
    .returning()
  return result[0]
}

export async function deleteFooterCategoryGroup(
  id: string,
): Promise<boolean> {
  const result = await db
    .delete(footerCategoryGroups)
    .where(eq(footerCategoryGroups.id, id))
    .returning()
  return result.length > 0
}

export async function createCompanyInfo(
  data: InsertCompanyInfo,
): Promise<CompanyInfo> {
  const result = await db.insert(companyInfo).values(data).returning()
  if (!result[0]) throw new Error("Failed to create company info")
  return result[0]
}

export async function getCompanyInfo(): Promise<CompanyInfo | undefined> {
  const result = await db.select().from(companyInfo).limit(1)
  return result[0]
}

export async function updateCompanyInfo(
  id: string,
  data: Partial<InsertCompanyInfo>,
): Promise<CompanyInfo | undefined> {
  const result = await db
    .update(companyInfo)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(companyInfo.id, id))
    .returning()
  return result[0]
}

export async function createQuickLink(
  data: InsertQuickLink,
): Promise<QuickLink> {
  const result = await db.insert(quickLinks).values(data).returning()
  if (!result[0]) throw new Error("Failed to create quick link")
  return result[0]
}

export async function getAllQuickLinks(): Promise<QuickLink[]> {
  return db
    .select()
    .from(quickLinks)
    .orderBy(asc(quickLinks.sortOrder))
}

export async function updateQuickLink(
  id: string,
  data: Partial<InsertQuickLink>,
): Promise<QuickLink | undefined> {
  const result = await db
    .update(quickLinks)
    .set(data)
    .where(eq(quickLinks.id, id))
    .returning()
  return result[0]
}

export async function deleteQuickLink(id: string): Promise<boolean> {
  const result = await db
    .delete(quickLinks)
    .where(eq(quickLinks.id, id))
    .returning()
  return result.length > 0
}

export async function createSupportLink(
  data: InsertSupportLink,
): Promise<SupportLink> {
  const result = await db.insert(supportLinks).values(data).returning()
  if (!result[0]) throw new Error("Failed to create support link")
  return result[0]
}

export async function getAllSupportLinks(): Promise<SupportLink[]> {
  return db
    .select()
    .from(supportLinks)
    .orderBy(asc(supportLinks.sortOrder))
}

export async function updateSupportLink(
  id: string,
  data: Partial<InsertSupportLink>,
): Promise<SupportLink | undefined> {
  const result = await db
    .update(supportLinks)
    .set(data)
    .where(eq(supportLinks.id, id))
    .returning()
  return result[0]
}

export async function deleteSupportLink(id: string): Promise<boolean> {
  const result = await db
    .delete(supportLinks)
    .where(eq(supportLinks.id, id))
    .returning()
  return result.length > 0
}

export async function createSocialLink(
  data: InsertSocialLink,
): Promise<SocialLink> {
  const result = await db.insert(socialLinks).values(data).returning()
  if (!result[0]) throw new Error("Failed to create social link")
  return result[0]
}

export async function getSocialLinkByPlatform(
  platform: string,
): Promise<SocialLink | undefined> {
  const result = await db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.platform, platform))
    .limit(1)
  return result[0]
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  return db.select().from(socialLinks)
}

export async function updateSocialLink(
  id: string,
  data: Partial<InsertSocialLink>,
): Promise<SocialLink | undefined> {
  const result = await db
    .update(socialLinks)
    .set(data)
    .where(eq(socialLinks.id, id))
    .returning()
  return result[0]
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  const result = await db
    .delete(socialLinks)
    .where(eq(socialLinks.id, id))
    .returning()
  return result.length > 0
}
