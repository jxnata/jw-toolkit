import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

type IResume = {
	publishers: number
	maps: number
	assignments: number
	cities: number
}

const useResume = () => {
	const { data, error, mutate } = useSWR('/general/resume', fetcher)

	const resume: IResume = {
		publishers: get(data, 'publishers', 0),
		maps: get(data, 'maps', 0),
		assignments: get(data, 'assignments', 0),
		cities: get(data, 'cities', 0),
	}

	return {
		resume,
		loading: !error && !data,
		error: error,
		mutate,
	}
}

export default useResume
