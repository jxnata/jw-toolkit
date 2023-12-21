export type AddAssignmentReq = {
	publisher: string
	map: string
}

export type AddAssignmentRes = {
	assignment: string
}

export type EditAssignmentReq = {
	publisher: string
	map: string
}

export type EditAssignmentRes = {
	assignment: string
}

export type RemoveAssignmentReq = string

export type RemoveAssignmentRes = {
	assignment: string
}