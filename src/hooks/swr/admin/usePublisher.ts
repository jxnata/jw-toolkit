import { useDocument } from '@hooks/documents'
import { database } from '@services/appwrite'

const usePublisher = (id?: string) => {
	const { data, loading, error, mutate } = useDocument({
		queryKey: ['publisher', id],
		queryFn: () => database.getDocument(
			'production',
			'publishers',
			id!
		),
		enabled: !!id,
		initialData: null
	})

	return {
		publisher: data,
		loading,
		error,
		mutate,
	}
}

export default usePublisher
