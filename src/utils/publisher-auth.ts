import { get } from "lodash"
import { publisherApi } from "services/api/publisher"
import { IPublisher } from "types/models/Publisher"
import { normalizeUsername } from "./normalize-username"

export type AuthRequest = {
    username: string,
    passcode: string
}

export const publisherAuth = async ({ username, passcode }: AuthRequest) => {
    try {

        const authResult = await publisherApi.post('/auth/publishers', { username: normalizeUsername(username), passcode })

        const publisher: IPublisher = get(authResult, 'data.publisher', undefined)
        const token: string = get(authResult, 'data.token', undefined)

        if (!!publisher && !!token) {
            return { publisher, token }
        }

        return false

    } catch (error) {
        return false
    }
}