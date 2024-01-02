import get from 'lodash/get'
import { api } from 'services/api/main'
import useSWR from 'swr'
import { IAssignment } from 'types/models/Assignment'

const fetcher = (url: string) => api.get(url).then(res => res.data)

const useAssignment = (id: string) => {

    const { data, error, mutate } = useSWR(`/assignments/view/${id}`, fetcher)

    const assignment: IAssignment = get(data, 'assignment', undefined)

    return {
        assignment,
        loading: !error && !data,
        error: error,
        mutate,
    }
}

export default useAssignment
