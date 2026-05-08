import { db } from "@/db/connection";
import { categories } from "@/db/schema/categories.schema";
import { eq, sql } from "drizzle-orm";

export class CategoriesServices {
  static async selectAll() {
    return await db.select().from(categories);
  }

  static async selectById(id: string) {
    return await db.select().from(categories).where(eq(categories.id, id));
  }

  static async selectByName(name: string) {
    name = name.toLowerCase().trim();
    return await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(sql`lower(${categories.name})`, name));
  }

  static create(values: any) {
    const created = db
      .insert(categories)
      .values({ ...values })
      .returning();
    return created;
  }

  static async update(id: string, values: any) {
    const updated = await db
      .update(categories)
      .set({ ...values })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  static async remove(id: string) {
    return await db.delete(categories).where(eq(categories.id, id));
  }
}
