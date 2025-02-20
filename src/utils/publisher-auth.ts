import { PublisherAuthRequest } from '@interfaces/auth/publisher'
import { IPublisher } from '@interfaces/models/Publisher'
import get from 'lodash/get'
import { api } from '@services/api/main'

import { normalizeUsername } from './normalize-username'

export const publisherAuth = async ({ username, passcode, congregation }: PublisherAuthRequest) => {
	try {
		const authResult = await api.post('/auth/publishers', {
			username: normalizeUsername(username),
			passcode,
			congregation,
		})

		const publisher: IPublisher = get(authResult, 'data.publisher', undefined)
		const token: string = get(authResult, 'data.token', undefined)

		if (!!publisher && !!token) {
			return { publisher, token }
		}

		return false
	} catch {
		return false
	}
}
