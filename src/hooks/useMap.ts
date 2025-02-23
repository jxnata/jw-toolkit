import { useDocument } from '@hooks/documents'
import { database } from '@services/appwrite'

const useMap = (id?: string) => {
	const { data, loading, error, mutate } = useDocument({
		queryKey: ['map', id],
		queryFn: () => database.getDocument('production', 'maps', id!),
		enabled: !!id,
		initialData: null,
	})

	return {
		map: data,
		loading,
		error,
		mutate,
	}
}

export default useMap
