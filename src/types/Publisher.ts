import { ICongregation } from "./Congregation"

export type IPublisher = {
    _id: string
    name: string
    username: string
    passcode: string
    congregation: ICongregation | string
    created_at: string
}