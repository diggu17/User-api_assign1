import fastify from "fastify";
import guard from 'fastify-guard';
import { logger } from "./logger";
import { applicationRoutes } from "../modules/application/application.routes";
import { userRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import jwt, { decode } from "jsonwebtoken"

type User={
    id:string,
    scope: Array<string>,
    applicationId: string, 
}

declare module 'fastify'{
    interface FastifyRequest{
        user:User;
    }
}

export async function buildServer(){
    const app = fastify({
        logger,
    });

    app.decorateRequest('user', null)
    app.addHook("onRequest", async function (request, reply) {
        const authHeader = request.headers.authorization;
        if(!authHeader){
            return;
        }

        try{
            const token = authHeader.replace('Bearer','')
            const decoded = jwt.verify(token,'secret') as User

            request.user =decoded;
        }
        catch(e){

        }
    })

    //register plugins
    app.register(guard,{
        requestProperty: "user",
        scopeProperty: "scopes",
        errorHandler: (result, request, reply) =>{
            return reply.send("you can not do that");
        },
    });

    // register routes
    app.register(applicationRoutes,{prefix: "/api/application"});
    app.register(userRoutes,{prefix: "/api/users"}) 
    app.register(roleRoutes,{prefix: "/api/roles"})

    return app;
}

// export default buildServer;
