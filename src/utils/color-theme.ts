import { vars } from 'nativewind'

const primary = {
	50: '#fcf9ee',
	100: '#f6eecf',
	200: '#eddc9a',
	300: '#e3c566',
	400: '#dcb043',
	500: '#d4942c',
	600: '#bb7424',
	700: '#9c5521',
	800: '#7f4421',
	900: '#69391e',
	950: '#3c1d0c',
}

const success = {
	DEFAULT: '#719453',
	50: '#f7f9f4',
	100: '#ecf2e6',
	200: '#d9e5cd',
	300: '#b8d0a5',
	400: '#a3be8c',
	500: '#719453',
	600: '#5a7940',
	700: '#486035',
	800: '#3c4d2e',
	900: '#324027',
	950: '#182211',
}

const danger = {
	50: '#fbf5f5',
	100: '#f8ebeb',
	200: '#f1dadb',
	300: '#e6bbbe',
	400: '#d7959a',
	500: '#bf616a',
	600: '#ae505e',
	700: '#913f4d',
	800: '#7a3745',
	900: '#69323f',
	950: '#39181f',
}

const common = {
	primary,
	success,
	danger,
}

const light = {
	background: '#f2efe6',
	card: '#eae6da',
	foreground: '#605b4a',
	border: '#afab9a',
}

const dark = {
	background: '#1e1e1d',
	card: '#302f2e',
	foreground: '#eae6da',
	border: '#5b5a52',
}

const toVars = (colors: Record<string, string>) => {
	const varsObject = Object.fromEntries(Object.entries(colors).map(([key, value]) => [`--color-${key}`, value]))
	return vars(varsObject as Record<`--color-${string}`, string>)
}

export const themes = {
	light: toVars(light),
	dark: toVars(dark),
}

export const colors = {
	light: { ...light, ...common },
	dark: { ...dark, ...common },
	...common,
}