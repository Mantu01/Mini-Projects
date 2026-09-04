import { eq, asc } from "drizzle-orm"
import { db } from "../index.js"
import { emiTenureOptions } from "../schema/index.js"
import { InsertEmiTenureOption } from "../zod/index.js"
import { EmiTenureOption } from "../types.js"

export async function createEmiTenureOption(
  data: InsertEmiTenureOption,
): Promise<EmiTenureOption> {
  const result = await db.insert(emiTenureOptions).values(data).returning()
  if (!result[0]) throw new Error("Failed to create EMI tenure option")
  return result[0]
}

export async function getEmiTenureOptionById(
  id: string,
): Promise<EmiTenureOption | undefined> {
  const result = await db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.id, id))
    .limit(1)
  return result[0]
}

export async function getEmiTenureOptionsByProductId(
  productId: string,
): Promise<EmiTenureOption[]> {
  return db
    .select()
    .from(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, productId))
    .orderBy(asc(emiTenureOptions.months))
}

export async function updateEmiTenureOption(
  id: string,
  data: Partial<InsertEmiTenureOption>,
): Promise<EmiTenureOption | undefined> {
  const result = await db
    .update(emiTenureOptions)
    .set(data)
    .where(eq(emiTenureOptions.id, id))
    .returning()
  return result[0]
}

export async function deleteEmiTenureOption(id: string): Promise<boolean> {
  const result = await db
    .delete(emiTenureOptions)
    .where(eq(emiTenureOptions.id, id))
    .returning()
  return result.length > 0
}

export async function deleteEmiTenureOptionsByProductId(
  productId: string,
): Promise<boolean> {
  const result = await db
    .delete(emiTenureOptions)
    .where(eq(emiTenureOptions.productId, productId))
    .returning()
  return result.length > 0
}
