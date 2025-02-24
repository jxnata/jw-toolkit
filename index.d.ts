import 'styled-components/native'
import Reactotron, { ReactotronReactNative } from 'reactotron-react-native'

declare global {
	interface Console {
		//@ts-ignore
		tron: typeof Reactotron<ReactotronReactNative>
	}
}

declare module 'styled-components/native' {
	export interface DefaultTheme {
		[key: string]: string
	}
}

