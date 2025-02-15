import { Client, Account, Databases } from 'react-native-appwrite'

const client = new Client().setProject('ls-maps').setPlatform('dev.jxnata.jwmaps')
export const account = new Account(client)
export const database = new Databases(client)
