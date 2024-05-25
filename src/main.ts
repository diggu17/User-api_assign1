import { env } from "./config/env";
import { db } from "./db";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import {migrate} from "drizzle-orm/node-postgres/migrator";

async function gracefulshutdown({app}:{app: Awaited<ReturnType<typeof buildServer>>}) {
    await app.close();
}

async function main(){
    const app = await buildServer();

    await app.listen({
        port:env.PORT,
        host: env.HOST, 
    });

    await migrate(db,{
        migrationsFolder:"./migrations",
    });
    
    logger.debug(env,"using env")
    
    const signals =['SIGINT', 'SIGTERM'];
    for(const signal of signals){
        process.on(signal,()=>{
            console.log("Got Signal",signal);
            gracefulshutdown({app,});
        })
    }
}

main();