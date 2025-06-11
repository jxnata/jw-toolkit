import { useDocument } from '@/hooks/documents'
import { database } from '@/services/appwrite'
import { Models } from 'react-native-appwrite'

const useMap = (id?: string, initialData?: Models.Document) => {
	const { data, loading, error, mutate, refetching } = useDocument({
		queryKey: ['map', id],
		queryFn: () => database.getDocument('production', 'maps', id!),
		enabled: !!id,
		initialData,
	})

	return {
		map: data,
		loading,
		refetching,
		error,
		mutate,
	}
}

export default useMap
