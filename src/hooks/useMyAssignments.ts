import { useDocuments } from '@hooks/documents'
import { useSession } from '@contexts/session'
import { storage } from '@database/index'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

const useMyAssignments = () => {
	const { publisher } = useSession()
	const congregation = storage.getString('congregation.id')

	const {
		data: assignments,
		loading,
		error,
		mutate,
	} = useDocuments({
		queryKey: ['my-assignments', publisher, congregation],
		queryFn: () => {
			const queries = [
				Query.equal('assigned', publisher!),
				Query.equal('congregation', congregation!),
				Query.limit(100),
			]

			return database.listDocuments('production', 'maps', queries)
		},
		initialData: [],
		enabled: !!publisher && !!congregation,
	})

	return {
		assignments,
		loading,
		error,
		mutate,
	}
}

export default useMyAssignments
