import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IMap } from 'types/models/Map'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useAllMaps = () => {
	const { data, error, mutate } = useSWR('/maps?all', fetcher)

	const maps: IMap[] = get(data, 'maps', [])

	return {
		maps,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useAllMaps
