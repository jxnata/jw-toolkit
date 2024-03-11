import axios from 'axios'
import { TOMTOM_MAPS_API } from 'constants/urls'

import { tomtomInterceptor } from './interceptor'

export const tomtomApi = axios.create({ baseURL: TOMTOM_MAPS_API })

tomtomApi.interceptors.request.use(tomtomInterceptor, error => Promise.reject(error))
