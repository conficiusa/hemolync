import { useEffect, useState } from 'react'
import { API_URL } from '@/lib/server/api'

type UseSseClientArgs = {
  url: string
  access_token: string
}

export const useSseClient = ({ url, access_token }: UseSseClientArgs) => {
  const [message, setMessage] = useState<Array<any> | null>(null)
  useEffect(() => {
    console.log('calling useSseClient')
    const eventSource = new EventSource(
      `${API_URL}${url}?access_token=${access_token}`,
    )
    eventSource.onmessage = (event) =>
      setMessage((prev) => [...(prev || []), JSON.parse(event.data)])
    return () => eventSource.close()
  }, [url, access_token])

  return { message }
}
