import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://ls-maps-api.jxnata-dev.workers.dev',
})
