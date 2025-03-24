import {z} from "zod"

export const SignUpSchema = z.object({
    username:z.string(),
    password:z.string(),
    email:z.string().email()
})

export type SignUpType = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
    email:z.string().email(),
    password:z.string()
})

export type SignInType = z.infer<typeof SignInSchema>

