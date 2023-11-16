import { get } from "lodash"
import { publisherApi } from "services/api/publisher"
import { AdminAuthRequest } from "types/auth/admin"
import { IUser } from "types/models/User"
import { normalizeUsername } from "./normalize-username"

export const adminAuth = async ({ username, password }: AdminAuthRequest) => {
    try {

        const authResult = await publisherApi.post('/auth/users', { username: normalizeUsername(username), password })

        const user: IUser = get(authResult, 'data.user', undefined)
        const token: string = get(authResult, 'data.token', undefined)

        if (!!user && !!token) {
            return { user, token }
        }

        return false

    } catch (error) {
        return false
    }
}