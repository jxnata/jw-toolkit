import { IPublisher } from '@interfaces/models/Publisher'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	all?: boolean
	search?: string
	limit?: number
	skip?: number
}

const defaultProps = { all: true, skip: 0, limit: 10, search: '' }

const usePublishers = (props: Props = defaultProps) => {
	const { all, search } = props

	const { data, error, mutate } = useSWR(`/publishers${all ? '/all' : ''}?search=${search || ''}`, fetcher)

	const publishers: IPublisher[] = get(data, 'publishers', [])

	return {
		publishers,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default usePublishers
