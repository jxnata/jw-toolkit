import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IMap } from 'types/models/Map'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useUnassignedMaps = () => {
	const { data, error, mutate } = useSWR(`/maps/unassigned`, fetcher)

	const maps: IMap[] = get(data, 'maps', [])

	return {
		maps,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useUnassignedMaps
