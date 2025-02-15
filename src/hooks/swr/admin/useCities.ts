import { ICityListItem } from '@interfaces/models/City'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWRInfinite from 'swr/infinite'

type Props = {
	search?: string
}

type GetCitiesResponse = {
	cities: ICityListItem[]
}

const LIMIT = 20

const fetcher = (url: string) => api.get<GetCitiesResponse>(url).then(res => res.data)

const getKey = (page: number, previousPageData: GetCitiesResponse, search: string) => {
	if (previousPageData && !previousPageData.cities.length) return null

	const skip = (page || 0) * LIMIT

	return `/cities?skip=${skip}&limit=${LIMIT}&search=${search}`
}

const defaultProps = { skip: 0, limit: LIMIT, search: '' }

const useCities = (props: Props = defaultProps) => {
	const { search } = props

	const { data, error, size, isLoading, mutate, setSize } = useSWRInfinite(
		(p, prev) => getKey(p, prev, search),
		fetcher,
		{ revalidateAll: true }
	)

	const cities: ICityListItem[] = []

	if (data) {
		for (const item of data) {
			const items: ICityListItem[] = get(item, 'cities', [])
			cities.push(...items)
		}
	}

	const next = () => {
		if (cities.length >= LIMIT && !isLoading) {
			setSize(old => old + 1)
		}
	}

	return {
		cities,
		page: size,
		loading: !error && !data,
		error,
		next,
		mutate,
	}
}

export default useCities
