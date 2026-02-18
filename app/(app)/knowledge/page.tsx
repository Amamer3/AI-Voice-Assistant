'use client'

import KnowledgeBase from '@/components/KnowledgeBase'
import { useSession } from '@/hooks/use-session'
import { Loader2 } from 'lucide-react'

export default function KnowledgePage() {
  const { sessionId, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <KnowledgeBase sessionId={sessionId} />
    </div>
  )
}
