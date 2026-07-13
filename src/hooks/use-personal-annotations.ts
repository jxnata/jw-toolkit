import { useState } from 'react'
import { storage } from '@/database'
import { STORAGE_KEYS } from '@/constants/storage-keys'

const loadAnnotation = (storageKey: string) => {
	try {
		return storage.getString(storageKey) || null
	} catch (error) {
		console.error('Error loading annotation:', error)
		return null
	}
}

export const usePersonalAnnotations = (mapId: string, userId: string) => {
	const storageKey = STORAGE_KEYS.annotations(mapId, userId)

	const [loadedKey, setLoadedKey] = useState(storageKey)
	const [annotation, setAnnotation] = useState<string | null>(() => loadAnnotation(storageKey))

	if (loadedKey !== storageKey) {
		setLoadedKey(storageKey)
		setAnnotation(loadAnnotation(storageKey))
	}

	const isLoading = false

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
