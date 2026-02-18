'use client'

import { useState, useEffect } from 'react'

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('voiceAppSessionId')
    if (stored) {
      setSessionId(stored)
    } else {
      const newId = crypto.randomUUID()
      localStorage.setItem('voiceAppSessionId', newId)
      setSessionId(newId)
    }
    setIsLoading(false)
  }, [])

  return { sessionId, isLoading }
}
