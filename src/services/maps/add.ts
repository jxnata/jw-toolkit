import { api } from 'services/api/main'
import { AddMapReq, AddMapRes } from 'types/api/maps'
import { setCoordinates } from 'utils/set-coordinates'

export const add = async (req: AddMapReq) => {
	try {
		const coordinates = setCoordinates(req.coordinates)

		const { data } = await api.post<AddMapRes>('/maps', { ...req, coordinates })

		if (!data) return false

		return data
	} catch {
		return false
	}
}
