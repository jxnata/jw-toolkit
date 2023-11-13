import { InternalAxiosRequestConfig } from 'axios'

export const tomtomInterceptor = (config: InternalAxiosRequestConfig) => {
    config.params = { ...config.params, key: process.env.TOMTOM_API_KEY }

    return config
}