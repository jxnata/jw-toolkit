import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IUser } from 'types/models/User'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	limit?: number
	skip?: number
}

const defaultProps = { skip: 0, limit: 10 }

const useUsers = (props: Props = defaultProps) => {
	const { data, error, mutate } = useSWR(`/users`, fetcher)

	const users: IUser[] = get(data, 'users', [])

	return {
		users,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useUsers
