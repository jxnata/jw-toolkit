export type ICity = {
	$id: string
	name: string
	created_at: string
}

export type ICityListItem = ICity & {
	maps_count: number
}
