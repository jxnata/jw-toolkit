import { TOMTOM_MAPS_API } from '@/constants/urls'
import { create } from 'axios'

import { tomtomInterceptor } from './interceptor'

export const tomtomApi = create({ baseURL: TOMTOM_MAPS_API })

tomtomApi.interceptors.request.use(tomtomInterceptor, (error) => Promise.reject(error))
