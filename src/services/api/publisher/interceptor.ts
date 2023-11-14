import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios'
import { authStorage } from 'database/auth'

export const publisherInterceptor = (config: InternalAxiosRequestConfig) => {
    const { token } = authStorage.getAuth()

    if (token) {
        config.headers = new AxiosHeaders({
            ...config.headers,
            'authorization': `Bearer ${token}`,
        })
    }

    return config
}