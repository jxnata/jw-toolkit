import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IPublisher } from 'types/models/Publisher'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	all?: boolean
	search?: string
}

const usePublishers = (props?: Props) => {
	const { all, search } = props || { all: false, search: '' }

	const { data, error, mutate } = useSWR(`/publishers${all ? '/all' : ''}?search=${search}`, fetcher)

	const publishers: IPublisher[] = get(data, 'publishers', [])

	return {
		publishers,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default usePublishers
