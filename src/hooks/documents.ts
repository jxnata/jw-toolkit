import { DefinedInitialDataOptions, QueryKey, useQuery } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

export const useDocuments = (
	options: DefinedInitialDataOptions<unknown, Error, Models.DocumentList<Models.Document>, QueryKey>
) => {
	const { data, error, isFetching, refetch } = useQuery(options)

	return {
		data: data ? data.documents || [] : [],
		total: data.total ? data.total : 0,
		loading: isFetching,
		error,
		mutate: refetch,
	}
}

export const useDocument = (options: DefinedInitialDataOptions<unknown, Error, Models.Document, QueryKey>) => {
	const { data, error, isLoading, refetch } = useQuery(options)

	return {
		data,
		loading: isLoading,
		error,
		mutate: refetch,
	}
}