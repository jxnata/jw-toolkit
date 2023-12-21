export type AddMapReq = {
	name: string
	address: string
	city: string
	coordinates: [number, number]
}

export type AddMapRes = {
	map: string
}

export type EditMapReq = {
	name: string
	address: string
	city: string
	coordinates: [number, number]
}

export type EditMapRes = {
	map: string
}

export type RemoveMapReq = string

export type RemoveMapRes = {
	map: string
}