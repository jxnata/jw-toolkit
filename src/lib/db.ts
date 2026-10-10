import { INSTANT_APP_ID } from '@/constants/env'
import schema from '@/interfaces/schema'
import { init } from '@instantdb/react-native'
import InstantStore from './instant-store'

const db = init({
	appId: INSTANT_APP_ID!,
	schema,
	// Enable offline support
	devtool: __DEV__,
	Store: InstantStore,
})

export default db
