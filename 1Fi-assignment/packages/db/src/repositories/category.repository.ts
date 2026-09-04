import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { categories } from "../schema/index.js"
import { InsertCategory } from "../zod/index.js"
import { Category } from "../types.js"

export async function createCategory(data: InsertCategory): Promise<Category> {
  const result = await db.insert(categories).values(data).returning()
  if (!result[0]) throw new Error("Failed to create category")
  return result[0]
}

export async function getCategoryById(
  id: string,
): Promise<Category | undefined> {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1)
  return result[0]
}

export async function getCategoryByName(
  name: string,
): Promise<Category | undefined> {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.name, name))
    .limit(1)
  return result[0]
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)
  return result[0]
}

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories)
}

export async function updateCategory(
  id: string,
  data: Partial<InsertCategory>,
): Promise<Category | undefined> {
  const result = await db
    .update(categories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning()
  return result[0]
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning()
  return result.length > 0
}
