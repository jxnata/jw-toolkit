import { storage } from '@database/index'
import { useDocuments } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

type Props = {
	search?: string
	city?: string
	district?: string
	status?: string
}

const useMaps = (props: Props = { search: '', district: '', status: '', city: '' }) => {
	const { search = '', district = '', status = '', city = '' } = props
	const congregation = storage.getString('congregation.id')

	const { data: maps, loading, error, mutate } = useDocuments({
		queryKey: ['maps', search, district, status, congregation],
		queryFn: () => {
			const queries = [
				Query.equal('congregation', congregation!),
				Query.limit(1000),
			]

			if (search) {
				queries.push(Query.search('name', search))
			}

			if (city) {
				queries.push(Query.equal('city', city))
			}

			if (district) {
				queries.push(Query.equal('district', district))
			}

			if (status) {
				queries.push(Query.equal('status', status))
			}

			return database.listDocuments('production', 'maps', queries)
		},
		initialData: [],
		enabled: !!congregation
	})

	return {
		maps,
		loading,
		error,
		mutate,
	}
}

export default useMaps
