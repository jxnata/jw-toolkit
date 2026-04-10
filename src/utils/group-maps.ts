import { Map } from '@/interfaces'

export type MapGroup = {
	group_code: string
	maps: Map[]
}

export function groupMaps(maps: Map[]): MapGroup[] {
	const grouped = new Map<string, Map[]>()

	for (const map of maps) {
		const key = map.group_code ?? map.id
		const existing = grouped.get(key)
		if (existing) {
			existing.push(map)
		} else {
			grouped.set(key, [map])
		}
	}

	const result: MapGroup[] = []
	const singles: MapGroup[] = []

	for (const [group_code, groupMaps] of grouped) {
		const entry = { group_code, maps: groupMaps }
		if (groupMaps.length > 1) {
			result.push(entry)
		} else {
			singles.push(entry)
		}
	}

	return [...result, ...singles]
}
