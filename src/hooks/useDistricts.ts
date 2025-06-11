import { database } from '@/services/appwrite'
import { upperFirst } from 'lodash'
import { Query } from 'react-native-appwrite'
import { useDocuments } from './documents'

const useDistricts = (city?: string) => {
	const { data: districts } = useDocuments({
		queryKey: ['districts', city],
		queryFn: () => {
			return database.listDocuments('production', 'districts', [
				Query.equal('city', city || 'undefined'),
				Query.limit(100),
				Query.orderAsc('name'),
				Query.select(['name', '$id']),
			])
		},
		initialData: [],
		enabled: !!city,
	})

	const list = [
		{ label: 'Todos', value: '' },
		...districts.map(d => ({
			label: d.name
				.split(' ')
				.map((word: string) => upperFirst(word))
				.join(' '),
			value: d.name,
		})),
	]

	return {
		districts,
		list: list.filter(l => l.label === 'Todos' || (l.value && !!l.value.trim())),
	}
}

export default useDistricts
