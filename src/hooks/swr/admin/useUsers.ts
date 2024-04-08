import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWRInfinite from 'swr/infinite'
import { IUser } from 'types/models/User'

type GetUsersResponse = {
	users: IUser[]
}

const LIMIT = 20

const fetcher = (url: string) => api.get<GetUsersResponse>(url).then(res => res.data)

const getKey = (page: number, previousPageData: GetUsersResponse) => {
	if (previousPageData && !previousPageData.users.length) return null

	const skip = (page || 0) * LIMIT

	return `/users?skip=${skip}&limit=${LIMIT}`
}

const useUsers = () => {
	const { data, error, size, isLoading, mutate, setSize } = useSWRInfinite(getKey, fetcher, { revalidateAll: true })

	const users: IUser[] = []

	if (data) {
		for (const item of data) {
			const items: IUser[] = get(item, 'users', [])
			users.push(...items)
		}
	}

	const next = () => {
		if (users.length >= LIMIT && !isLoading) {
			setSize(old => old + 1)
		}
	}

	return {
		users,
		page: size,
		loading: !error && !data,
		error,
		next,
		mutate,
	}
}

export default useUsers
