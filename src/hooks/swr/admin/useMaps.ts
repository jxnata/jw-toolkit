import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IMap } from 'types/models/Map'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	skip?: number
	limit?: number
	search?: string
}

const defaultProps = { skip: 0, limit: 10, search: '' }

const useMaps = (props: Props = defaultProps) => {
	const { skip = 0, limit = 10, search = '' } = props

	const { data, error, mutate } = useSWR(`/maps?skip=${skip}&limit=${limit}&search=${search}`, fetcher)

	const maps: IMap[] = get(data, 'maps', [])

	return {
		maps,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useMaps
