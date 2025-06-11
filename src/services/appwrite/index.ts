import { Platform } from 'react-native'
import { Client, Account, Functions } from 'react-native-appwrite'
import { database } from './database'

const client = new Client()
	.setProject('ls-maps')
	.setPlatform(Platform.OS === 'ios' ? 'dev.jxnata.jwtoolkit' : 'dev.jxnata.jwmaps')

export const account = new Account(client)
export const functions = new Functions(client)
export { database }
