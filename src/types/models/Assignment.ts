import { ICongregation } from "./Congregation"
import { IMap } from "./Map"
import { IPublisher } from "./Publisher"

export type IAssignment = {
    _id: string
    publisher: IPublisher | string
    map: IMap
    congregation: ICongregation | string
    details?: string
    found: boolean
    finished: boolean
    created_at: string
}