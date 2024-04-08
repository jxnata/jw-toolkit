import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWRInfinite from 'swr/infinite'
import { IAssignment } from 'types/models/Assignment'

const LIMIT = 20

const fetcher = (url: string) => api.get<GetAssignmentResponse>(url).then(res => res.data)

type Props = {
	search?: string
	map?: string
}

type GetAssignmentResponse = {
	assignments: IAssignment[]
}

const defaultProps = { limit: 10, search: '', map: undefined }

const getKey = (page: number, previousPageData: GetAssignmentResponse, route: string) => {
	if (previousPageData && !previousPageData.assignments.length) return null

	const skip = (page || 0) * LIMIT

	return `${route}&skip=${skip}`
}

const useAssignments = (props: Props = defaultProps) => {
	const { search = '', map } = props

	let route = `/assignments?limit=${LIMIT}`
	if (map) route = `/assignments/map/${map}?limit=${LIMIT}`
	if (search) route = `/assignments?search=${search}&limit=${LIMIT}`

	const { data, error, size, isLoading, mutate, setSize } = useSWRInfinite(
		(p, prev) => getKey(p, prev, route),
		fetcher,
		{ revalidateAll: true }
	)

	const assignments: IAssignment[] = []

	if (data) {
		for (const item of data) {
			const items: IAssignment[] = get(item, 'assignments', [])
			assignments.push(...items)
		}
	}

	const next = () => {
		if (assignments.length >= LIMIT && !isLoading) {
			setSize(old => old + 1)
		}
	}

	return {
		assignments,
		page: size,
		loading: !error && !data,
		error,
		next,
		mutate,
	}
}

export default useAssignments
