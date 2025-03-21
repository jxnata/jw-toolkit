export type AddAssignmentReq = {
	assigned: string
}

export type AddAssignmentRes = {
	assignment: string
}

export type EditAssignmentReq = {
	assigned: string
}

export type EditAssignmentRes = {
	assignment: string
}

export type FinishAssignmentReq = {
	found: boolean
	details?: string
}

export type FinishAssignmentRes = {
	assignment: string
}

export type RemoveAssignmentReq = string

export type RemoveAssignmentRes = {
	assignment: string
}

export type RestoreAssignmentRes = {
	message: string
}

export type AcceptAssignmentReq = {
	user: string
	map: string
	expiration: string
	signature: string
}

export type AcceptAssignmentRes = {
	assignment: string
}
