import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IAssignment } from 'types/models/Assignment'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useMyAssignments = () => {
	const { data, error, mutate } = useSWR('/assignments/my', fetcher)

	const assigments: IAssignment[] = get(data, 'assignments', [])

	return {
		assigments,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useMyAssignments
