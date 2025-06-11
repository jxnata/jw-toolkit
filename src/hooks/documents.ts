import { DefinedInitialDataOptions, QueryKey, useQuery, useInfiniteQuery } from '@tanstack/react-query'
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
	const { data, error, isLoading, isRefetching, refetch } = useQuery(options)

	return {
		data,
		loading: isLoading,
		refetching: isRefetching,
		error,
		mutate: refetch,
	}
}

type InfiniteQueryOptions = {
	queryKey: QueryKey
	queryFn: (context: { pageParam: number }) => Promise<Models.DocumentList<Models.Document>>
	enabled?: boolean
}

export const useInfinityDocuments = (options: InfiniteQueryOptions) => {
	const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
		queryKey: options.queryKey,
		queryFn: options.queryFn,
		getNextPageParam: (lastPage: Models.DocumentList<Models.Document>, allPages) => {
			const totalFetched = allPages.reduce((acc, page) => acc + page.documents.length, 0)

			if (totalFetched >= lastPage.total) {
				return undefined
			}
			return totalFetched
		},
		initialPageParam: 0,
		enabled: options.enabled,
	})

	const documents = data?.pages.flatMap(page => page.documents) || []

	return {
		data: documents,
		total: data?.pages[0]?.total || 0,
		loading: isLoading,
		loadingMore: isFetchingNextPage,
		error,
		hasMore: hasNextPage,
		loadMore: fetchNextPage,
		mutate: refetch,
	}
}
