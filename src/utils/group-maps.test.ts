import { groupMaps } from './group-maps'
import { Map as MapInterface } from '@/interfaces'

const makeMap = (id: string, group_code?: string): MapInterface =>
	({ id, group_code: group_code ?? null } as unknown as MapInterface)

describe('groupMaps', () => {
	it('returns [] for empty array', () => {
		expect(groupMaps([])).toEqual([])
	})

	it('each map without group_code becomes its own group keyed by id', () => {
		const maps = [makeMap('a'), makeMap('b')]
		const result = groupMaps(maps)
		expect(result).toHaveLength(2)
		expect(result[0].group_code).toBe('a')
		expect(result[0].maps).toHaveLength(1)
		expect(result[1].group_code).toBe('b')
		expect(result[1].maps).toHaveLength(1)
	})

	it('maps with the same group_code are merged into one entry', () => {
		const maps = [makeMap('1', 'gc1'), makeMap('2', 'gc1')]
		const result = groupMaps(maps)
		expect(result).toHaveLength(1)
		expect(result[0].group_code).toBe('gc1')
		expect(result[0].maps).toHaveLength(2)
	})

	it('sorts multi-map groups before single-map groups', () => {
		const maps = [makeMap('solo'), makeMap('x', 'grp'), makeMap('y', 'grp')]
		const result = groupMaps(maps)
		expect(result[0].maps).toHaveLength(2)
		expect(result[1].maps).toHaveLength(1)
	})

	it('handles mixed: some with group_code, some without', () => {
		const maps = [makeMap('a', 'g1'), makeMap('b', 'g1'), makeMap('c'), makeMap('d', 'g2')]
		const result = groupMaps(maps)
		expect(result).toHaveLength(3)
		// multi-map group first
		expect(result[0].group_code).toBe('g1')
		expect(result[0].maps).toHaveLength(2)
		// singles after
		const singles = result.slice(1)
		expect(singles.every((g) => g.maps.length === 1)).toBe(true)
	})
})
