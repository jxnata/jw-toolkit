import { api } from 'services/api/main'
import { AddUserReq, AddUserRes } from 'types/api/users'

export const add = async (body: AddUserReq) => {
	try {
		const { data } = await api.post<AddUserRes>('/users', body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
