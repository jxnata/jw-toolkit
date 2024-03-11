import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWRInfinite from 'swr/infinite'
import { IMap } from 'types/models/Map'

type Props = {
	skip?: number
	limit?: number
	search?: string
	all?: boolean
}

type GetMapsResponse = {
	maps: IMap[]
}

const LIMIT = 10

const fetcher = (url: string) => api.get<GetMapsResponse>(url).then(res => res.data)

const defaultProps = { limit: LIMIT, search: '', all: false }

const getKey = (page: number, previousPageData: GetMapsResponse, search: string) => {
	if (previousPageData && !previousPageData.maps.length) return null

	const skip = (page || 0) * LIMIT

	return `/maps?skip=${skip}&limit=${LIMIT}&search=${search}`
}

const useMaps = (props: Props = defaultProps) => {
	const { search = '' } = props

	const { data, error, size, isLoading, mutate, setSize } = useSWRInfinite(
		(p, prev) => getKey(p, prev, search),
		fetcher,
		{ revalidateAll: true }
	)

	const maps: IMap[] = []

	if (data) {
		for (const item of data) {
			const items: IMap[] = get(item, 'maps', [])
			maps.push(...items)
		}
	}

	const next = () => {
		if (maps.length > 9 && !isLoading) {
			setSize(old => old + 1)
		}
	}

	return {
		maps,
		page: size,
		loading: !error && !data,
		error,
		next,
		mutate,
	}
}

export default useMaps
