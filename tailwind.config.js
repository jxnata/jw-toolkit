/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: 'var(--color-background)',
				},
				card: {
					DEFAULT: 'var(--color-card)',
				},
				foreground: {
					DEFAULT: 'var(--color-foreground)',
				},
				border: {
					DEFAULT: 'var(--color-border)',
				},
				primary: {
					DEFAULT: '#bb7424',
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
				},
				success: {
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
				},
				danger: {
					DEFAULT: '#bf616a',
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
				},
			},
			fontFamily: {
				regular: ['urbanist-regular'],
				medium: ['urbanist-medium'],
				semibold: ['urbanist-semibold'],
				bold: ['urbanist-bold'],
				extrabold: ['urbanist-extrabold'],
				black: ['urbanist-black'],
			},
		},
	},
	plugins: [],
}
