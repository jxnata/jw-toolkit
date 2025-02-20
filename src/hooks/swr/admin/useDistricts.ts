import { Models } from "react-native-appwrite"

const useDistricts = (maps: Models.Document[]) => {

	const districts: string[] = [...new Set(maps.map(map => map.district))].sort()

	const list = [{ label: 'Todos', value: '' }, ...districts.map(d => ({ label: d, value: d }))]

	return {
		districts,
		list: list.filter(l => l.label === 'Todos' || (l.value && !!l.value.trim())),
	}
}

export default useDistricts
