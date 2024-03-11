import { IUser } from 'types/models/User'

export type VinculateUserReq = {
	publisher: string
}

export type VinculateUserRes = {
	user: IUser
}
