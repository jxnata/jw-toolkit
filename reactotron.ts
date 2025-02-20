import reactotron from 'reactotron-react-native'

console.tron = reactotron.configure({ host: '192.168.0.7' }).useReactNative().connect()
