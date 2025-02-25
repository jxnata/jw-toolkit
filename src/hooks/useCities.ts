import { storage } from '@database/index'
import { useDocuments } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

type Props = {
	search?: string
}

const useCities = ({ search }: Props = { search: '' }) => {
	const congregation = storage.getString('congregation.id')

	const {
		data: cities,
		loading,
		error,
		mutate,
	} = useDocuments({
		queryKey: ['cities', search, congregation],
		queryFn: () => {
			const queries = [Query.equal('congregation', congregation!), Query.limit(1000)]

			if (search) {
				queries.push(Query.search('name', search))
			}

			return database.listDocuments('production', 'cities', queries)
		},
		initialData: [],
		enabled: !!congregation,
	})

	return {
		cities,
		loading,
		error,
		mutate,
	}
}

export default useCities
