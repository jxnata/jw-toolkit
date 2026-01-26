import { LocationContext } from '@/contexts/location-provider'
import { useContext } from 'react'

export const useLocation = () => {
	const context = useContext(LocationContext)

	if (!context) {
		throw new Error('useLocation deve ser usado dentro de um LocationProvider')
	}

	return context
}
