import { FastifyInstance } from "fastify";
import { Schema } from "zod";
import { AssignRoleToUserBody, assignRoleTouserJsonSchema, createUserJsonSchema, loginJsonSchema } from "./users.schema";
import { assignRoleTouserHandler, createUserHandel, loginHandler } from "./users.controllers";
import { PERMISSIONS } from "../../config/permission";


export async function userRoutes(app:FastifyInstance) {
    app.post("/",
    {
        schema: createUserJsonSchema,
    },
    createUserHandel
    );

    app.post("/login",{
        schema: loginJsonSchema,
    }, loginHandler)

    app.post<{
        Body:AssignRoleToUserBody;
    }>("/roles",{
        schema: assignRoleTouserJsonSchema,
        preHandler: [app.guard.scope(PERMISSIONS["users:roles:write"])],
    }, assignRoleTouserHandler)
}