import { themes } from '@/utils/color-theme'
import React, { createContext } from 'react'
import { useColorScheme, View } from 'react-native'

interface ThemeProviderProps {
	children: React.ReactNode
}

export const ThemeContext = createContext<{ theme: 'light' | 'dark' }>({ theme: 'dark' })

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const scheme = useColorScheme()

	return (
		<ThemeContext.Provider value={{ theme: scheme || 'dark' }}>
			<View style={themes[scheme || 'dark']} className='flex-1'>
				{children}
			</View>
		</ThemeContext.Provider>
	)
}
