import { authStorage } from '@database/auth'
import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios'

export const interceptor = (config: InternalAxiosRequestConfig) => {
	const { token } = authStorage.getAuth()

	if (token) {
		config.headers = new AxiosHeaders({
			...config.headers,
			authorization: `Bearer ${token}`,
		})
	}

	return config
}
