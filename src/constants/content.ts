import { nativeApplicationVersion } from 'expo-application'

export const DEFAULT_PRIVILEGES = ['Ancião', 'Servo', 'P. Regular', 'P. Auxiliar', 'P. Especial']

export const STATUS_LIST = [
	{ label: 'Nenhum', value: '' },
	{ label: 'Estudante', value: 'estudante' },
	{ label: 'Mudou-se', value: 'mudou-se' },
	{ label: 'Não visitar', value: 'nao-visitar' },
]

export const STATUS_NAME = {
	estudante: 'Estudante',
	'mudou-se': 'Mudou-se',
	'nao-visitar': 'Não visitar',
}

export const APP_VERSION = nativeApplicationVersion
