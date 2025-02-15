import { IPublisher } from '@interfaces/models/Publisher'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const usePublisher = (id: string) => {
	const { data, error, mutate } = useSWR(`/publishers/view/${id}`, fetcher)

	const publisher: IPublisher = get(data, 'publisher', undefined)

	return {
		publisher,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default usePublisher
