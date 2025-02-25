import { storage } from '@database/index'
import { useDocument } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Models } from 'react-native-appwrite'

const useAssignment = (id: string, initialData?: Models.Document) => {
	const congregation = storage.getString('congregation.id')

	const {
		data: assignment,
		loading,
		error,
		mutate,
	} = useDocument({
		queryKey: ['assignment', id, congregation],
		queryFn: () => {
			return database.getDocument('production', 'assignments', id)
		},
		enabled: !!id && !!congregation,
		initialData: initialData,
	})

	return {
		assignment,
		loading,
		error,
		mutate,
	}
}

export default useAssignment
