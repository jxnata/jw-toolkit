import { IAssignment } from '@interfaces/models/Assignment'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useAssignment = (id: string) => {
	const { data, error, mutate } = useSWR(`/assignments/view/${id}`, fetcher)

	const assignment: IAssignment = get(data, 'assignment', undefined)

	return {
		assignment,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useAssignment
