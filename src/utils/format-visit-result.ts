import { notFoundOptions } from '@/constants/visit-results'

const notFoundReasons = new Set(notFoundOptions.map((option) => option.value))

/**
 * Label for the result of the last visit to a map.
 *
 * Visits saved as "not found" before the reasons existed may still carry an old
 * `found_info` from a previous "found" visit, so for not found visits only the
 * known reasons are shown.
 */
export const formatVisitResult = (found?: boolean | null, foundInfo?: string | null): string => {
	if (found) return foundInfo ? `Encontrado - ${foundInfo}` : 'Encontrado'
	if (foundInfo && notFoundReasons.has(foundInfo)) return `Não encontrado - ${foundInfo}`
	return 'Não encontrado'
}
