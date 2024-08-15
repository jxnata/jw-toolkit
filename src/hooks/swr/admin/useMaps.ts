import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWRInfinite from 'swr/infinite'
import { IMap } from 'types/models/Map'

type Props = {
	search?: string
	district?: string
	status?: string
	all?: boolean
}

type GetMapsResponse = {
	maps: IMap[]
}

const LIMIT = 20

const fetcher = (url: string) => api.get<GetMapsResponse>(url).then(res => res.data)

const defaultProps = { limit: LIMIT, search: '', district: '', status: '', all: false }

const getKey = (page: number, previousPageData: GetMapsResponse, search: string, district: string, status: string) => {
	if (previousPageData && !previousPageData.maps.length) return null

	const skip = (page || 0) * LIMIT

	return `/maps?skip=${skip}&limit=${LIMIT}&search=${search}&district=${district}&status=${status}`
}

const useMaps = (props: Props = defaultProps) => {
	const { search = '', status = '', district = '' } = props

	const { data, error, size, isLoading, mutate, setSize } = useSWRInfinite(
		(p, prev) => getKey(p, prev, search, district, status),
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
		if (maps.length >= LIMIT && !isLoading) {
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
