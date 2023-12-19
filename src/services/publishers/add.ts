import { api } from 'services/api/main'
import { AddPublisherReq, AddPublisherRes } from 'types/api/publishers'

export const add = async (req: AddPublisherReq) => {
    try {
        const { data } = await api.post<AddPublisherRes>('/publishers', req)

        if (!data) return false

        return data
    } catch (error) {
        return false
    }
}
