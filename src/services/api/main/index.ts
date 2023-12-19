import axios from 'axios'
import { JW_TOOLKIT_API } from 'constants/urls'
import { interceptor } from './interceptor'

export const api = axios.create({ baseURL: JW_TOOLKIT_API })

api.interceptors.request.use(interceptor, error => Promise.reject(error))