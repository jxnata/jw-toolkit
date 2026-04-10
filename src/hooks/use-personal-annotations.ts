import { useEffect, useState } from 'react'
import { storage } from '@/database'
import { STORAGE_KEYS } from '@/constants/storage-keys'

export const usePersonalAnnotations = (mapId: string, userId: string) => {
	const [annotation, setAnnotation] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const storageKey = STORAGE_KEYS.annotations(mapId, userId)

	const loadAnnotation = () => {
		try {
			const savedAnnotation = storage.getString(storageKey)
			setAnnotation(savedAnnotation || null)
		} catch (error) {
			console.error('Error loading annotation:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadAnnotation()
	}, [mapId, userId])

	const saveAnnotation = (text: string) => {
		try {
			if (text.trim()) {
				storage.set(storageKey, text.trim())
				setAnnotation(text.trim())
			} else {
				storage.remove(storageKey)
				setAnnotation(null)
			}
			return true
		} catch (error) {
			console.error('Error saving annotation:', error)
			return false
		}
	}

	const removeAnnotation = () => {
		try {
			storage.remove(storageKey)
			setAnnotation(null)
			return true
		} catch (error) {
			console.error('Error removing annotation:', error)
			return false
		}
	}

	return {
		annotation,
		isLoading,
		saveAnnotation,
		removeAnnotation,
		hasAnnotation: !!annotation,
	}
}
