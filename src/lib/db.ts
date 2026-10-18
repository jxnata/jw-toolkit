import schema from '@/interfaces/schema'
import { init } from '@instantdb/react-native'
import InstantStore from './instant-store'
import { resolveInstantConfig } from './remote-config'

const db = init({
	...resolveInstantConfig(),
	schema,
	// Enable offline support
	devtool: __DEV__,
	Store: InstantStore,
})

export default db
