import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IMap } from 'types/models/Map'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	skip?: number
	limit?: number
	search?: string
	all?: boolean
}

const defaultProps = { skip: 0, limit: 10, search: '', all: false }

const useMaps = (props: Props = defaultProps) => {
	const { skip = 0, limit = 10, search = '', all = false } = props

	const { data, error, mutate } = useSWR(
		`/maps?${all ? 'all&' : ''}skip=${skip}&limit=${limit}&search=${search}`,
		fetcher
	)

	const maps: IMap[] = get(data, 'maps', [])

	return {
		maps,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useMaps
