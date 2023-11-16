import get from 'lodash/get'
import { publisherApi } from 'services/api/publisher'
import useSWR from 'swr'
import { IAssignment } from 'types/models/Assignment'

const fetcher = (url: string) => publisherApi.get(url).then((res) => res.data)

const useHistoryAssignments = () => {

    const { data, error, mutate } = useSWR('/assignments/my/history', fetcher)

    const assigments: IAssignment[] = get(data, 'assignments', [])

    return {
        assigments,
        loading: !error && !data,
        error: error,
        mutate
    }
}

export default useHistoryAssignments