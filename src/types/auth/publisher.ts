import { IUser } from 'types/models/User'

export type PublisherAuthRequest = {
	username: string
	passcode: string
}

export type SwapPublisherRes = {
	user: IUser
	token: string
	private_key: string
}
