import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IAssignment } from 'types/models/Assignment'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type Props = {
	skip?: number
	limit?: number
	search?: string
	map?: string
}

const defaultProps = { skip: 0, limit: 10, search: '', map: undefined }

const useAssignments = (props: Props = defaultProps) => {
	const { skip = 0, limit = 10, search = '', map } = props

	let route = `/assignments?skip=${skip}&limit=${limit}`
	if (map) route = `/assignments/map/${map}?skip=${skip}&limit=${limit}`
	if (search) route = `/assignments?search=${search}&skip=${skip}&limit=${limit}`

	const { data, error, mutate } = useSWR(route, fetcher)

	const assignments: IAssignment[] = get(data, 'assignments', [])

	return {
		assignments,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useAssignments
