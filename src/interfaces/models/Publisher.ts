import { ICongregation } from './Congregation'

export type IPublisher = {
	_id: string
	name: string
	username: string
	privileges: string[]
	congregation: ICongregation
	created_at: string
}

export type IVinculatedPublisher = IPublisher & {
	user?: string
}

export type IPublisherParams = {
	_id: string
	name: string
	username: string
	privileges: string
	congregation: string
	created_at: string
}
