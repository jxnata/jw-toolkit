import { toLower, trim, upperFirst } from 'lodash'
import { Models } from 'react-native-appwrite'

const useDistricts = (maps: Models.Document[]) => {
	const districts: string[] = [...new Set(maps.map(map => toLower(trim(map.district))))].sort()

	const list = [
		{ label: 'Todos', value: '' },
		...districts.map(d => ({
			label: d
				.split(' ')
				.map(word => upperFirst(word))
				.join(' '),
			value: d,
		})),
	]

	return {
		districts,
		list: list.filter(l => l.label === 'Todos' || (l.value && !!l.value.trim())),
	}
}

export default useDistricts
