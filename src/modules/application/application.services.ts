import { InferModel } from "drizzle-orm";
import { application } from "../../db/schema";
import { db } from "../../db";

export async function createApplication(data: InferModel<typeof application, "insert">) {
    const result = await db.insert(application).values(data).returning();

    return result[0];
}

export async function getApplication(){
    const result= await db.select({
        id: application.id,
        name: application.name,
        createdAt: application.createdAt,
    }).from(application)
    return result;
}