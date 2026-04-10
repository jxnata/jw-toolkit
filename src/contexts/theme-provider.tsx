import { themes } from '@/utils/color-theme'
import React, { createContext } from 'react'
import { useColorScheme, View } from 'react-native'

interface ThemeProviderProps {
	children: React.ReactNode
}

export const ThemeContext = createContext<{ theme: 'light' | 'dark' }>({ theme: 'dark' })

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const _scheme = useColorScheme()
	const scheme: 'light' | 'dark' = _scheme === 'dark' ? 'dark' : 'light'

	return (
		<ThemeContext.Provider value={{ theme: scheme }}>
			<View style={themes[scheme]} className="flex-1">
				{children}
			</View>
		</ThemeContext.Provider>
	)
}
