export type AddMapReq = {
	name: string
	address: string
	details?: string
	district?: string
	city: string
	coordinates: string
	tag?: string
}

export type AddMapRes = {
	map: string
}

export type EditMapReq = {
	name: string
	address: string
	details?: string
	district?: string
	city: string
	coordinates: string
	tag?: string
}

export type EditMapRes = {
	map: string
}

export type RemoveMapReq = string

export type RemoveMapRes = {
	map: string
}

export type AddExtraMapReq = {
	address: string
	details?: string
	coordinates: string
}

export type ExtraMapLocal = {
	id: string
	address: string
	details?: string
	lat: number
	lng: number
}
