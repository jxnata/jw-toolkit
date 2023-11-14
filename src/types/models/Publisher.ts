import { ICongregation } from "./Congregation"

export type IPublisher = {
    _id: string
    name: string
    username: string
    congregation: ICongregation
    created_at: string
}