import { IUser } from 'types/models/User'

export type VinculateUserReq = {
	publisher: string
}

export type VinculateUserRes = {
	user: IUser
}

export type AddUserReq = {
	name: string
	password: string
	publisher: string
}

export type AddUserRes = {
	user: string
}

export type EditUserReq = {
	name: string
	publisher: string
}

export type EditUserRes = {
	user: string
}

export type RemoveUserReq = string

export type RemoveUserRes = {
	user: string
}
