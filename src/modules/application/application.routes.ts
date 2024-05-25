import { FastifyInstance } from "fastify";
import { createApplicationJsonSchema } from "./application.schemas";
import { createApplicationHandler, getApplicationshandler } from "./application.controllers";
import { getApplication } from "./application.services";

export async function applicationRoutes(app: FastifyInstance) {
    app.post('/',{
        schema: createApplicationJsonSchema,
    },
        createApplicationHandler
    );
    app.get('/',getApplicationshandler)
}