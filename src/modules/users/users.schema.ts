import { z } from "zod";
import { application } from "../../db/schema";
import zodToJsonSchema from "zod-to-json-schema";

//create User
const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    applicationId: z.string().min(6),
    password:z.string().min(6),
    instialUser: z.boolean().optional(),
});

export type createUserBody = z.infer<typeof createUserBodySchema>

export const createUserJsonSchema ={
    body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
};

//Login

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    applicationId: z.string(),
})

export type LoginBody = z.infer<typeof loginSchema>

export const  loginJsonSchema ={
    body: zodToJsonSchema(loginSchema,"loginSchema")
}


//Assign Role to user
const assignRoleToUserBody = z.object({
    userId: z.string().uuid(),
    roleId: z.string().uuid(),
    applicationId: z.string().uuid(),
});

export type AssignRoleToUserBody =z.infer<typeof assignRoleToUserBody>;

export const assignRoleTouserJsonSchema={
    body: zodToJsonSchema(assignRoleToUserBody,"assignRoleToUserBody")
}