import { ICity } from '@interfaces/models/City'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

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
