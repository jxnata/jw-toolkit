import { storage } from '@database/index'
import { useDocuments } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

type Props = {
	search?: string
}

const useRequestPublishers = ({ search }: Props = { search: '' }) => {
	const congregation = storage.getString('congregation.id')

	const { data: publishers, loading, error, mutate } = useDocuments({
		queryKey: ['request-publishers', search, congregation],
		queryFn: () => {
			const queries = [
				Query.equal('approved', false),
				Query.equal('congregation', congregation!),
				Query.limit(1000),
			]

			if (search) {
				queries.push(Query.search('name', search))
			}

			return database.listDocuments('production', 'publishers', queries)
		},
		initialData: [],
		enabled: !!congregation
	})

	return {
		publishers,
		loading,
		error,
		mutate,
	}
}

export default useRequestPublishers
