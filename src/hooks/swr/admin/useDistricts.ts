import { Models } from "react-native-appwrite"

const useDistricts = (maps: Models.Document[]) => {

	const districts: string[] = [...new Set(maps.map(map => map.district))].sort()

	const list = [{ label: 'Todos', value: '' }, ...districts.map(d => ({ label: d, value: d }))]

	return {
		districts,
		list,
	}
}

export default useDistricts
