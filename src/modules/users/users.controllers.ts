import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, LoginBody, createUserBody } from "./users.schema";
import { SYSTEM_ROLES } from "../../config/permission";
import {getRoleByName} from "../roles/roles.services"
import { assignRoleTouser, createUser, getUserByApplication, getUserByEmail } from "./users.services";
import jwt from "jsonwebtoken"
import { logger } from "../../utils/logger";


export async function createUserHandel(
    request: FastifyRequest<{
        Body:createUserBody;
    }>,

    reply: FastifyReply
){
    const {instialUser, ...data} =request.body

    const rolename = instialUser ?SYSTEM_ROLES.SUPER_ADMIN: SYSTEM_ROLES.APPLICATION_USER;

    if(rolename === SYSTEM_ROLES.SUPER_ADMIN){
        const appUsers = await getUserByApplication(data.applicationId);

        if(appUsers.length>0){
            return reply.code(400).send({
                message: "Application already has super admin user",
                extensions: {
                    code: "APPLICATION_ALREADY_SUPER_USER",
                    applicationId: data.applicationId,
                },
            });
        }
    }


    const role = await getRoleByName({
        name: rolename,
        applicationId: data.applicationId,
    });

    if(!role){
        return reply.code(404).send({
            message:" Role Not Found",
        });
    }

    try{
        const user = await createUser(data);

        await assignRoleTouser({
            userId: user.id, 
            roleId: role.id,
            applicationId: data.applicationId
        })


        return user;
    } catch(e){}
}

export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginBody;
    }>,
    reply: FastifyReply
) {
    const {applicationId, email, password} = request.body

    const user = await getUserByEmail({
        applicationId,
        email,
    });

    
    if(!user){
        return reply.code(400).send({
            message: "Invalid email or password",
        })
    }

    const token = jwt.sign(
        {
            id: user.id,
            email,
            applicationId,
            scopes: user.permissions,
        },
        "secret"
    );

    return {token};
}

export async function assignRoleTouserHandler(
    request: FastifyRequest<{
        Body: AssignRoleToUserBody;
    }>,
    reply: FastifyReply
) {
    const {userId, roleId, applicationId} =request.body

    try{
        const result = await assignRoleTouser({
            userId,
            applicationId,roleId,
        })
    
        return result;
    }   
    
    catch(e){
        logger.error(e,`error assigning role to user`);
        return reply.code(400).send({
            message: "could not assign role to user" 
        })
    }
}