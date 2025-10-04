import { useEffect } from 'react'
import { API_URL } from '@/lib/server/api'

type UseSseClientArgs = {
  url: string
  onMessage: (message: string) => void
  access_token: string
}

export const useSseClient = ({
  url,
  onMessage,
  access_token,
}: UseSseClientArgs) => {
  useEffect(() => {
    const eventSource = new EventSource(
      `${API_URL}${url}?access_token=${access_token}`,
    )
    eventSource.onmessage = (event) => onMessage(event.data)
    return () => eventSource.close()
  }, [url, onMessage])
}
