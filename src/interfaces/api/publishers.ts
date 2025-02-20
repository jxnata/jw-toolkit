export type AddPublisherReq = {
	name: string
}

export type AddPublisherRes = {
	publisher: string
	passcode: string
}

export type EditPublisherReq = {
	name: string
	level: string
}

export type EditPublisherRes = {
	publisher: string
}

export type ResetPublisherReq = string

export type ResetPublisherRes = {
	publisher: string
	passcode: string
}

export type RemovePublisherReq = string

export type RemovePublisherRes = {
	publisher: string
}
