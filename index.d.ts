import Reactotron, { ReactotronReactNative } from 'reactotron-react-native'

declare global {
	interface Console {
		//@ts-ignore
		tron: typeof Reactotron<ReactotronReactNative>
	}
}