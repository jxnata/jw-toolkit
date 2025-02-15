import { ICongregation } from '@interfaces/models/Congregation'
import get from 'lodash/get'
import { api } from '@services/api/main'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useCongregations = () => {
	const { data, error, mutate } = useSWR('/congregations', fetcher)

	const congregations: ICongregation[] = get(data, 'congregations', [])

	return {
		congregations,
		loading: !error && !data,
		error,
		mutate,
	}
}

export default useCongregations
