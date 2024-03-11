import { IPublisher } from 'types/models/Publisher'

export type AdminAuthRequest = {
	username: string
	password: string
}

export type SwapAdminRes = {
	publisher: IPublisher
	token: string
}
