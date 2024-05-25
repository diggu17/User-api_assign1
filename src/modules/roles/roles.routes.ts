import { FastifyInstance } from "fastify";
import { createRoleBody, createRoleJsonSchema } from "./roles.schemas";
import { createRoleHandler } from "./roles.controller";
import { PERMISSIONS } from "../../config/permission";


export async function roleRoutes(app:FastifyInstance) {
    app.post<{
        Body: createRoleBody;
    }>("/",{
        schema: createRoleJsonSchema,
        preHandler: [app.guard.scope([PERMISSIONS["roles:write"]])]
    },
    createRoleHandler
)}   