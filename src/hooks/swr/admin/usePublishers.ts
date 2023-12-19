import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IPublisher } from 'types/models/Publisher'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const usePublishers = () => {
	const { data, error, mutate } = useSWR('/publishers', fetcher)

	const publishers: IPublisher[] = get(data, 'publishers', [])

	return {
		publishers,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default usePublishers
