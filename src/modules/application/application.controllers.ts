import { FastifyRequest, FastifyReply } from "fastify";
import {createApplicationBody }from "./application.schemas"
import { createApplication, getApplication } from "./application.services";
import { createRole } from "../roles/roles.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permission";

export async function createApplicationHandler(
    request: FastifyRequest<{
        Body: createApplicationBody;
    }> ,reply: FastifyReply
) {
    const {name} =request.body;
    const application =await createApplication({
        name,
    });

    const superAdminRolePromise = createRole({
        applicationId:application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions:ALL_PERMISSIONS as unknown as Array<string>,
    });

    const applicationUserRolePromise= await createRole({ 
        applicationId:application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions:USER_ROLE_PERMISSIONS,
    })

    const [superAdminRole, applicationUserRole] =await Promise.allSettled([
        superAdminRolePromise,
        applicationUserRolePromise
    ]);
    if(superAdminRole.status==="rejected"){
        throw new Error("Error in creating Admin role");
    }
    if(applicationUserRole.status==="rejected"){
        throw new Error("Error in creating user role");
    }
    return{
        application,
        superAdminRole: superAdminRole.value,
        applicationUserRole : applicationUserRole.value,
    }; 
}


export async function getApplicationshandler() {
    return getApplication();
    
}