import axios from 'axios'
import { JW_TOOLKIT_API } from 'constants/urls'
import { publisherInterceptor } from './interceptor'

export const publisherApi = axios.create({ baseURL: JW_TOOLKIT_API })

publisherApi.interceptors.request.use(publisherInterceptor, error => Promise.reject(error))