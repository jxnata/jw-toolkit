import { IAssignment } from './Assignment'
import { ICity } from './City'
import { ICongregation } from './Congregation'
import { IPublisher } from './Publisher'

export type IMap = {
	_id: string
	name: string
	address: string
	details: string
	city: ICity
	coordinates: [number, number]
	congregation: ICongregation | string
	assigned: boolean
	last_visited?: string
	last_visited_by?: IPublisher | string
	last_assignment?: IAssignment | undefined
	created_at: string
	updated_at: string
}
