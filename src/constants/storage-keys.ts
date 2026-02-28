export const STORAGE_KEYS = {
	CONGREGATION_ID: 'congregation.id',
	CONGREGATION_NAME: 'congregation.name',
	USER_PUBLISHER: 'user.publisher',
	annotations: (mapId: string, userId: string) => `annotations.${mapId}.${userId}`,
} as const
