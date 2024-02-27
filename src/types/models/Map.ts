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
	last_visited?: string
	last_visited_by?: IPublisher | string
	assigned?: IAssignment | null
	created_at: string
}
