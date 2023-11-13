import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios'

export const publisherInterceptor = (config: InternalAxiosRequestConfig) => {
    config.headers = new AxiosHeaders({
        ...config.headers,
        'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaXNoZXIiOnsiX2lkIjoiNjU0MTRiMmU2ZjJjZmU4ZTc4YWU0N2VkIiwibmFtZSI6IkphcXVlbGluZSIsImNvbmdyZWdhdGlvbiI6IjY1MzQwZTVjNzkxNTk1NWU2Zjc2ODI2YSIsImNyZWF0ZWRfYXQiOiIyMDIzLTEwLTMxVDE4OjQ1OjAyLjkyOFoiLCJfX3YiOjB9LCJpYXQiOjE2OTg3Nzc5MjV9.YDhCHfnS6_0nuTOwsMsxKoQZ1OqzdWxdpIFRFg8rV44`,
    })

    return config
}