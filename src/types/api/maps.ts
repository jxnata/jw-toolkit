export type AddMapReq = {
	name: string
	address: string
	details?: string
	city: string
	coordinates: string
}

export type AddMapRes = {
	map: string
}

export type EditMapReq = {
	name: string
	address: string
	details?: string
	city: string
	coordinates: string
}

export type EditMapRes = {
	map: string
}

export type RemoveMapReq = string

export type RemoveMapRes = {
	map: string
}
