import { QueryClient } from '@tanstack/react-query'
import { Models } from 'react-native-appwrite'

export const updateMapsCache = (queryClient: QueryClient, queryKey: unknown[], newMap: Models.Document) => {
	if (!queryKey) return
	if (!queryKey.length) return

	queryClient.setQueryData(queryKey, (oldData: any) => {
		if (!oldData) return { documents: [newMap], total: 1 }
		return {
			...oldData,
			documents: [...oldData.documents, newMap],
			total: oldData.total + 1,
		}
	})
}
