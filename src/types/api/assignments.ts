export type AddAssignmentReq = {
	publisher: string
	map: string
	permanent: boolean
}

export type AddAssignmentRes = {
	assignment: string
}

export type EditAssignmentReq = {
	publisher: string
	map: string
	details: string
	permanent: boolean
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