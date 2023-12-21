import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IMap } from 'types/models/Map'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useMap = (id: string) => {
	const { data, error, mutate } = useSWR(`/maps/${id}`, fetcher)

	const map: IMap = get(data, 'map', undefined)

	return {
		map,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useMap
