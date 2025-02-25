import { Platform } from 'react-native'
import { Client, Account, Databases, Functions } from 'react-native-appwrite'

const client = new Client()
	.setProject('ls-maps')
	.setPlatform(Platform.OS === 'ios' ? 'dev.jxnata.jwtoolkit' : 'dev.jxnata.jwmaps')
export const account = new Account(client)
export const database = new Databases(client)
export const functions = new Functions(client)
