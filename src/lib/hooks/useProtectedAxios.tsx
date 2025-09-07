// import { useEffect } from 'react'
// import { protectedApi } from '@/lib/server/api'
// import useRefreshToken from '@/lib/hooks/useRefreshToken'

// const useProtectedAxios = (token: string | null) => {
//   const refresh = useRefreshToken()
//   useEffect(() => {
//     let isRefreshing = false
//     let failedQueue: Array<{
//       resolve: (value?: unknown) => void
//       reject: (reason?: any) => void
//     }> = []

//     const processQueue = (error: any = null) => {
//       failedQueue.forEach((prom) => {
//         if (error) {
//           prom.reject(error)
//         } else {
//           prom.resolve()
//         }
//       })
//       failedQueue = []
//     }

//     const requestIntercept = protectedApi.interceptors.request.use(
//       (config) => {
//         if (!config.headers['Authorization']) {
//           config.headers['Authorization'] = `Bearer ${token}`
//         }
//         return config
//       },
//       (error) => Promise.reject(error),
//     )

//     const responseIntercept = protectedApi.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config

//         if (error.response?.status !== 401 || originalRequest._retry) {
//           return Promise.reject(error)
//         }

//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject })
//           })
//             .then(() => protectedApi(originalRequest))
//             .catch((err) => Promise.reject(err))
//         }

//         originalRequest._retry = true
//         isRefreshing = true

//         try {
//           const newAccessToken = await refresh()
//           protectedApi.defaults.headers.common['Authorization'] =
//             `Bearer ${newAccessToken}`
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

//           processQueue()
//           return protectedApi(originalRequest)
//         } catch (refreshError) {
//           processQueue(refreshError)
//           return Promise.reject(refreshError)
//         } finally {
//           isRefreshing = false
//         }
//       },
//     )

//     return () => {
//       protectedApi.interceptors.request.eject(requestIntercept)
//       protectedApi.interceptors.response.eject(responseIntercept)
//     }
//   }, [token, refresh])

//   return protectedApi
// }

// export default useProtectedAxios
