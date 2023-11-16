import { ICongregation } from "./Congregation";
import { IPublisher } from "./Publisher";

export type IMap = {
    _id: string
    name: string
    address: IMapAddress
    coordinates: [number, number];
    congregation: ICongregation | string
    last_visited?: string
    last_visited_by?: IPublisher | string
    created_at: string
}

export type IMapAddress = {
    street: string,
    number: string,
    district: string,
    city: string,
}