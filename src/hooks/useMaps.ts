import { storage } from '@database/index'
import { useInfinityDocuments } from '@hooks/documents'
import { database } from '@services/appwrite'
import { Query } from 'react-native-appwrite'

type Props = {
	search?: string
	city?: string
	district?: string
	status?: 'assigned' | 'unassigned' | ''
	enabled?: boolean
}

const useMaps = (props: Props = { search: '', district: '', status: '', city: '', enabled: true }) => {
	const { search = '', district = '', status = '', city = '', enabled = true } = props
	const congregation = storage.getString('congregation.id')
	const queryKey = ['infinite-maps', search, city, district, status, congregation]

	const {
		data: maps,
		loading,
		error,
		mutate,
		loadMore,
		loadingMore,
		hasMore,
		total,
	} = useInfinityDocuments({
		queryKey,
		queryFn: ({ pageParam }) => {
			const queries = [
				Query.equal('congregation', congregation!),
				Query.limit(10),
				Query.offset(pageParam),
				Query.orderAsc('visited'),
			]

			if (search) {
				queries.push(Query.or([Query.search('name', search), Query.search('district', search)]))
			}

			if (city) {
				queries.push(Query.equal('city', city))
			}

			if (district) {
				queries.push(Query.search('district', district))
			}

			if (status) {
				queries.push(status === 'assigned' ? Query.isNotNull('assigned') : Query.isNull('assigned'))
			}

			return database.listDocuments('production', 'maps', queries)
		},
		enabled,
	})

	return {
		maps,
		loading,
		error,
		mutate,
		loadMore,
		loadingMore,
		hasMore,
		total,
		queryKey,
	}
}

export default useMaps
