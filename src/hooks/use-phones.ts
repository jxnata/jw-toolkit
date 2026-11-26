import { useSession } from '@/contexts/session-provider'
import { Phone } from '@/interfaces'
import db from '@/lib/db'
import { normalizePhone } from '@/utils/phone-number'

export type PhoneStatus = 'assigned' | 'unassigned' | ''

type Props = {
	search?: string
	status?: PhoneStatus
}

const usePhones = ({ search = '', status = '' }: Props = {}) => {
	const { congregation } = useSession()

	const whereConditions: any = {
		congregation: congregation?.id,
	}

	const digits = normalizePhone(search)
	if (digits) {
		whereConditions.number = { $ilike: `%${digits}%` }
	}

	if (status === 'assigned') {
		whereConditions.assigned = { $isNull: false }
	} else if (status === 'unassigned') {
		whereConditions.assigned = { $isNull: true }
	}

	const { data, isLoading, error } = db.useQuery(
		congregation
			? {
					phones: {
						$: {
							where: whereConditions,
							order: { called: 'asc' },
						},
						assigned: {},
					},
				}
			: null
	)

	const phones = (data?.phones as Phone[]) || []

	return {
		phones,
		loading: isLoading,
		error,
		total: phones.length,
	}
}

export default usePhones
