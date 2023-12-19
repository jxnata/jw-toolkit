import { get } from 'lodash'
import { api } from 'services/api/main'
import { PublisherAuthRequest } from 'types/auth/publisher'
import { IPublisher } from 'types/models/Publisher'
import { normalizeUsername } from './normalize-username'

export const publisherAuth = async ({ username, passcode }: PublisherAuthRequest) => {
	try {
		const authResult = await api.post('/auth/publishers', { username: normalizeUsername(username), passcode })

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
