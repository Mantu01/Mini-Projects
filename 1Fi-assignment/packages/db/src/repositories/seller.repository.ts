import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { sellers } from "../schema/index.js"
import { InsertSeller } from "../zod/index.js"
import { Seller } from "../types.js"

export async function createSeller(data: InsertSeller): Promise<Seller> {
  const result = await db.insert(sellers).values(data).returning()
  if (!result[0]) throw new Error("Failed to create seller")
  return result[0]
}

export async function getSellerById(
  id: string,
): Promise<Seller | undefined> {
  const result = await db
    .select()
    .from(sellers)
    .where(eq(sellers.id, id))
    .limit(1)
  return result[0]
}

export async function getSellerBySlug(
  slug: string,
): Promise<Seller | undefined> {
  const result = await db
    .select()
    .from(sellers)
    .where(eq(sellers.slug, slug))
    .limit(1)
  return result[0]
}

export async function getAllSellers(): Promise<Seller[]> {
  return db.select().from(sellers)
}

export async function updateSeller(
  id: string,
  data: Partial<InsertSeller>,
): Promise<Seller | undefined> {
  const result = await db
    .update(sellers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(sellers.id, id))
    .returning()
  return result[0]
}

export async function deleteSeller(id: string): Promise<boolean> {
  const result = await db
    .delete(sellers)
    .where(eq(sellers.id, id))
    .returning()
  return result.length > 0
}
