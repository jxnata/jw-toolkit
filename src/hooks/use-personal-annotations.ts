import { useCallback, useEffect, useState } from 'react'
import { storage } from '@/database'

export const usePersonalAnnotations = (mapId: string, userId: string) => {
	const [annotation, setAnnotation] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const storageKey = `annotations.${mapId}.${userId}`

	const loadAnnotation = useCallback(() => {
		try {
			const savedAnnotation = storage.getString(storageKey)
			setAnnotation(savedAnnotation || null)
		} catch (error) {
			console.error('Error loading annotation:', error)
		} finally {
			setIsLoading(false)
		}
	}, [storageKey])

	useEffect(() => {
		loadAnnotation()
	}, [mapId, userId, loadAnnotation])

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
