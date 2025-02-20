import { IPublisher } from '@interfaces/models/Publisher'

export type AdminAuthRequest = {
	username: string
	password: string
	congregation?: string
}

export type SwapAdminRes = {
	publisher: IPublisher
	token: string
}
