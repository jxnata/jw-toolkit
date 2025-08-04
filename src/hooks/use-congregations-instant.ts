import db from '@/lib/db'

type Props = {
	search?: string
	enabled?: boolean
}

const useCongregations = ({ search, enabled = true }: Props = {}) => {
	const whereConditions: any = {
		enabled: true,
	}

	if (search) {
		whereConditions.name = { $like: `%${search}%` }
	}

	const { data, isLoading, error } = db.useQuery(
		enabled ? {
			congregations: {
				$: {
					where: whereConditions,
					order: { serverCreatedAt: 'desc' }
				},
			}
		} : null
	)

	return {
		congregations: data?.congregations || [],
		loading: isLoading,
		error,
		mutate: () => { },
	}
}

export default useCongregations