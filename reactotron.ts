import { storage } from '@database'
import reactotron from 'reactotron-react-native'
import mmkvPlugin from 'reactotron-react-native-mmkv'

console.tron = reactotron.configure({ host: '192.168.0.102' }).useReactNative().use(mmkvPlugin({ storage })).connect()
