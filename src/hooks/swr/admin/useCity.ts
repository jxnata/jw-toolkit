import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { ICity } from 'types/models/City'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useCity = (id: string) => {
	const { data, error, mutate } = useSWR(`/cities/view/${id}`, fetcher)

	const city: ICity = get(data, 'city', undefined)

	return {
		city,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useCity
