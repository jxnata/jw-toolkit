import { ENCRYPT_STORAGE } from 'constants/env'
import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV({
    id: 'main_storage',
    encryptionKey: ENCRYPT_STORAGE,
})
