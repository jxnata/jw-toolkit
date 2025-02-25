import { useDocuments } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

const useCongregations = () => {
	const {
		data: congregations,
		loading,
		error,
		mutate,
	} = useDocuments({
		queryKey: ['congregations'],
		queryFn: () => database.listDocuments('production', 'congregations', [Query.equal('enabled', true)]),
		initialData: [],
	})

	return {
		congregations,
		loading,
		error,
		mutate,
	}
}

export default useCongregations
