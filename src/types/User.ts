import { ICongregation } from "./Congregation"

export type IUser = {
    _id: string
    name: string
    username: string
    password: string
    congregation: ICongregation | string
    created_at: string
}