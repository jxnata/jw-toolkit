import { api } from 'services/api/main'
import { EditMapReq, EditMapRes } from 'types/api/maps'
import { setCoordinates } from 'utils/set-coordinates'

export const edit = async (id: string, body: EditMapReq) => {
	try {
		const coordinates = setCoordinates(body.coordinates)

		const { data } = await api.put<EditMapRes>(`/maps/${id}`, { ...body, coordinates })

		if (!data) return false

		return data
	} catch {
		return false
	}
}
