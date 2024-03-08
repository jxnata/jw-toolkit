import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { ICityListItem } from 'types/models/City'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	skip?: number
	limit?: number
	search?: string
}

const defaultProps = { skip: 0, limit: 20, search: '' }

const useCities = (props: Props = defaultProps) => {
	const { skip = 0, limit = 10, search = '' } = props

	const { data, error, mutate } = useSWR(`/cities?skip=${skip}&limit=${limit}&search=${search}`, fetcher)

	const cities: ICityListItem[] = get(data, 'cities', [])

	return {
		cities,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useCities
