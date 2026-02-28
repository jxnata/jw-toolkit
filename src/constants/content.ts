import { nativeApplicationVersion } from 'expo-application'

export const DEFAULT_PRIVILEGES = ['Ancião', 'Servo', 'P. Regular', 'P. Auxiliar', 'P. Especial']

export const MAP_TAGS = {
	NO_VISIT: 'nao-visitar',
	STUDENT: 'estudante',
	MOVED: 'mudou-se',
} as const

export const MAP_STATUS_LABELS = {
	ASSIGNED: 'DESIGNADO',
	FREE: 'LIVRE',
} as const

export const STATUS_LIST = [
	{ label: 'Nenhum', value: '' },
	{ label: 'Estudante', value: MAP_TAGS.STUDENT },
	{ label: 'Mudou-se', value: MAP_TAGS.MOVED },
	{ label: 'Não visitar', value: MAP_TAGS.NO_VISIT },
]

export const STATUS_NAME = {
	[MAP_TAGS.STUDENT]: 'Estudante',
	[MAP_TAGS.MOVED]: 'Mudou-se',
	[MAP_TAGS.NO_VISIT]: 'Não visitar',
}

export const APP_VERSION = nativeApplicationVersion
