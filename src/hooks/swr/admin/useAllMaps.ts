import { IMap } from '@interfaces/models/Map'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useAllMaps = () => {
	const { data, error, mutate } = useSWR('/maps/all', fetcher)

	const maps: IMap[] = get(data, 'maps', [])

	return {
		maps,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useAllMaps
