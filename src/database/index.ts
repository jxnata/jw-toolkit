import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
    id: 'main_storage',
    encryptionKey: process.env.ENCRYPT_STORAGE,
})
