import { ICongregation } from "./Congregation"

export type IUser = {
    _id: string
    name: string
    username: string
    congregation: ICongregation
    created_at: string
}