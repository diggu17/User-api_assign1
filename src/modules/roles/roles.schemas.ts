import { z } from "zod";
import { ALL_PERMISSIONS } from "../../config/permission";
import zodToJsonSchema from "zod-to-json-schema";


const createRoleBodySchema = z.object({
    name: z.string(),
    permissions: z.array(z.enum(ALL_PERMISSIONS)),
    // applicationId: z.string().uuid(),
});

export type createRoleBody = z.infer<typeof createRoleBodySchema>

export const createRoleJsonSchema ={
    body:zodToJsonSchema(createRoleBodySchema,"createRoleBodySchema")
}