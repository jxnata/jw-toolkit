import { storage } from "database";
import { AuthStorage } from "./types";

export const authStorage = {
    getAuth: () => {
        const token = storage.getString('auth.token')
        const type = storage.getString('auth.type')

        return { token, type } as AuthStorage
    },
    setAuth: (auth: AuthStorage) => {
        storage.set('auth.token', auth.token)
        storage.set('auth.type', auth.type)
    },
    clear: () => {
        storage.delete('auth.token')
        storage.delete('auth.type')
    },
}