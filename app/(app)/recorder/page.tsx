'use client'

import Link from 'next/link'
import VoiceRecorder from '@/components/VoiceRecorder'
import { useSession } from '@/hooks/use-session'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function RecorderPage() {
  const { sessionId, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto mb-6 space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-500 hover:text-noiz-primary transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noiz-primary/5 text-noiz-primary text-xs font-bold uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-noiz-primary" />
          Live Recorder
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Capture your thoughts in one flow
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          Step 1 Record, Step 2 Review, Step 3 Choose your output format.
        </p>
      </div>
      <VoiceRecorder sessionId={sessionId} />
    </div>
  )
}
