import compact from 'lodash/compact'
import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IDistricts } from 'types/models/Districts'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useDistricts = (city?: string) => {
	const { data, error, mutate } = useSWR(`/maps/districts`, fetcher)

	const all: IDistricts = get(data, 'districts', null)
	let districts: string[] = []

	if (all) {
		if (!city) {
			districts = compact(Object.values(all).flat())
		} else {
			districts = compact(get(all, city, []))
		}
	}

	const list = [{ label: 'Todos', value: '' }, ...districts.map(d => ({ label: d, value: d }))]

	return {
		districts,
		list,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useDistricts
