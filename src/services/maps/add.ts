import { api } from 'services/api/main'
import { AddMapReq, AddMapRes } from 'types/api/maps'

export const add = async (req: AddMapReq) => {
	try {
		const { data } = await api.post<AddMapRes>('/maps', req)

		if (!data) return false

		return data
	} catch (error) {
		return false
	}
}
