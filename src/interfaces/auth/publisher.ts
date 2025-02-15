import { IUser } from '@interfaces/models/User'

export type PublisherAuthRequest = {
	username: string
	passcode: string
	congregation?: string
}

export type SwapPublisherRes = {
	user: IUser
	token: string
	private_key: string
}
