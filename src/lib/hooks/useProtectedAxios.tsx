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

import { useNavigate } from '@tanstack/react-router'
import { use, useEffect } from 'react'
import { protectedApi } from '@/lib/server/api'
import { getContext } from '@/lib/integrations/tanstack-query/root-provider'
import { session } from '@/lib/data/queries/auth/refresh'
import RefreshToken from '@/lib/hooks//useRefreshToken'

const useAxiosPrivate = () => {
  const queryClient = getContext().queryClient
  const { access_token: token } = use(queryClient.fetchQuery(session))
  const navigate = useNavigate()
  useEffect(() => {
    const requestIntercept = protectedApi.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
    const responseIntercept = protectedApi.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await RefreshToken()
          if (!newAccessToken) {
            navigate({ to: '/auth/login' })
            return Promise.reject(error)
          }
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return protectedApi(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      protectedApi.interceptors.request.eject(requestIntercept)
      protectedApi.interceptors.response.eject(responseIntercept)
    }
  }, [token])

  return protectedApi
}

export default useAxiosPrivate
