import { AddUserReq, AddUserRes } from '@interfaces/api/users'
import { api } from '@services/api/main'

export const add = async (body: AddUserReq) => {
	try {
		const { data } = await api.post<AddUserRes>('/users', body)

		if (!data) return false

		return data
	} catch {
		return false
	}
}
