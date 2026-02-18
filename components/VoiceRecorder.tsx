'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Download, Trash2, Loader2, Pause, Bookmark, ChevronRight, ChevronDown, RotateCcw, Check, X, Wand2, Mail, FileText, MessageSquare, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface VoiceRecorderProps {
  sessionId: string
}

type OutputType = 'email' | 'meeting_notes' | 'message' | null

export default function VoiceRecorder({ sessionId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [recordings, setRecordings] = useState<Array<{
    id: string
    blob: Blob
    duration: number
    transcript?: string
    isTranscribing?: boolean
    bookmarks?: number[]
    outputType?: OutputType
    generatedContent?: string
  }>>([])
  
  const [activeRecording, setActiveRecording] = useState<{
    id: string
    blob: Blob | null
    duration: number
    bookmarks: number[]
  } | null>(null)

  const [currentStep, setCurrentStep] = useState<'idle' | 'recording' | 'review' | 'output_selection' | 'final_review'>('idle')
  const [isProcessing, setIsProcessing] = useState(false)
  const [realtimeTranscript, setRealtimeTranscript] = useState('')
  const [selectedOutputType, setSelectedOutputType] = useState<OutputType>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const [finalTranscript, setFinalTranscript] = useState('')
  const [generatedOutput, setGeneratedOutput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const liveRequestInFlightRef = useRef(false)
  const lastLiveRequestRef = useRef(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  // Audio visualization logic
  useEffect(() => {
    if (isRecording && !isPaused) {
      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 128) // Normalize to 0-1
        }
        requestAnimationFrame(updateLevel)
      }
      updateLevel()
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      setFinalTranscript('')
      setGeneratedOutput('')
      setRealtimeTranscript('')
      setErrorMessage('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
        handleLiveChunk(e.data)
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)
      setCurrentStep('recording')
      setActiveRecording({ id: Date.now().toString(), blob: null, duration: 0, bookmarks: [] })
      
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const handleLiveChunk = async (_chunk: Blob) => {
    if (!isRecording || isPaused) return
    const now = Date.now()
    if (now - lastLiveRequestRef.current < 4000) return
    if (liveRequestInFlightRef.current) return

    const availableChunks = [...chunksRef.current]
    if (!availableChunks.length) return

    const liveBlob = new Blob(availableChunks, { type: 'audio/webm' })

    liveRequestInFlightRef.current = true
    lastLiveRequestRef.current = now
    try {
      const formData = new FormData()
      formData.append('audio', liveBlob, 'live-chunk.webm')
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        console.error('Live transcription request failed with status', response.status)
        return
      }

      const data = await response.json()
      const newText = (data.transcript as string) || ''
      if (!newText) return

      setRealtimeTranscript((prev) => {
        if (!prev) {
          setFinalTranscript(newText)
          return newText
        }
        const combined = `${prev} ${newText}`.replace(/\s+/g, ' ').trim()
        setFinalTranscript(combined)
        return combined
      })
    } catch (error) {
      console.error('Error during live transcription:', error)
    } finally {
      liveRequestInFlightRef.current = false
    }
  }

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
        timerRef.current = setInterval(() => {
          setDuration((d) => d + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }

  const addBookmark = () => {
    if (activeRecording) {
      setActiveRecording(prev => prev ? ({
        ...prev,
        bookmarks: [...prev.bookmarks, duration]
      }) : null)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
    setIsPaused(false)
    setCurrentStep('idle')
    setActiveRecording(null)
    setFinalTranscript('')
    setGeneratedOutput('')
    setRealtimeTranscript('')
    setErrorMessage('')
  }

  const processRecording = async (blob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Transcription failed')
      }

      const data = await response.json()
      const transcriptText = data.transcript || ''
      setFinalTranscript(transcriptText)
      setRealtimeTranscript(transcriptText)
    } catch (error) {
      console.error('Error during transcription:', error)
      setErrorMessage('Failed to transcribe your recording. You can still type or paste your text manually.')
      setFinalTranscript('')
      setRealtimeTranscript('')
    } finally {
      setIsProcessing(false)
      setCurrentStep('review')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        if (activeRecording) {
          const finalRecording = { ...activeRecording, blob, duration }
          setRecordings(prev => [...prev, finalRecording])
          processRecording(blob)
        }
        chunksRef.current = []
      }
      mediaRecorderRef.current.stop()
    }
    
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    if (timerRef.current) clearInterval(timerRef.current)
    
    setIsRecording(false)
    setIsPaused(false)
  }

  const handleOutputSelection = async (type: OutputType) => {
    if (!finalTranscript && !realtimeTranscript) {
      setErrorMessage('No transcript available. Record or paste some text before generating an output.')
      return
    }

    setSelectedOutputType(type)
    setIsProcessing(true)

    try {
      const baseTranscript = finalTranscript || realtimeTranscript
      const label =
        type === 'email'
          ? 'email'
          : type === 'meeting_notes'
          ? 'meeting notes'
          : 'message'

      const messages = [
        {
          role: 'user',
          content: `Convert the following voice note transcript into polished ${label}.\n\nTranscript:\n${baseTranscript}\n\nReturn only the final ${label} text.`,
        },
      ]

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate output')
      }

      const data = await response.json()
      setGeneratedOutput(data.response || '')
      setCurrentStep('final_review')
    } catch (error) {
      console.error('Error generating output:', error)
      setErrorMessage('Failed to generate output from your transcript. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!generatedOutput) {
      setErrorMessage('Generate an output first before saving to your library.')
      return
    }

    setIsProcessing(true)
    try {
      const baseName = selectedOutputType ? selectedOutputType.replace('_', '-') : 'voice-output'
      const blob = new Blob([generatedOutput], { type: 'text/plain' })
      const file = new File([blob], `${baseName}-${Date.now()}.txt`, { type: 'text/plain' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      setErrorMessage('')
    } catch (error) {
      console.error('Error saving to library:', error)
      setErrorMessage('Failed to save to library. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-[600px] flex flex-col pb-20 relative">
      {errorMessage && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 flex items-start justify-between gap-3">
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Processing State Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300 rounded-[2.5rem]">
          <div className="relative">
            <div className="w-20 h-20 md:w-28 md:h-28 border-4 border-noiz-primary/20 border-t-noiz-primary rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 text-noiz-primary animate-pulse" />
          </div>
          <p className="mt-6 text-lg md:text-2xl font-bold text-slate-900">AI is working its magic...</p>
          <p className="text-sm md:text-base text-noiz-primary/60">Transcribing and formatting your thoughts</p>
        </div>
      )}

      {/* Home State */}
      {currentStep === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in slide-in-from-bottom-4 py-8 md:py-16">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">VoiceFlow</h1>
            <p className="text-slate-500 max-w-[280px] md:max-w-md mx-auto font-medium text-sm md:text-base">Transform your voice into professional output instantly.</p>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 bg-noiz-primary/20 rounded-full animate-ping scale-[1.6] md:scale-[2] opacity-20" />
            <div className="absolute inset-0 bg-noiz-primary/10 rounded-full animate-pulse scale-[1.3] md:scale-[1.6] opacity-30" />
            
            <button 
              onClick={startRecording}
              className="relative z-10 w-40 h-40 md:w-56 md:h-56 bg-noiz-primary rounded-full flex flex-col items-center justify-center gap-3 text-white shadow-[0_0_50px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 group border-8 border-white"
            >
              <Mic className="w-14 h-14 md:w-20 md:h-20 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">Start</span>
            </button>
          </div>

          <div className="flex gap-3 text-slate-400">
            <Badge variant="outline" className="px-4 py-1.5 md:px-6 md:py-2 md:text-sm font-bold border-slate-200 bg-slate-50 text-noiz-primary">Email</Badge>
            <Badge variant="outline" className="px-4 py-1.5 md:px-6 md:py-2 md:text-sm font-bold border-slate-200 bg-slate-50 text-noiz-primary">Notes</Badge>
            <Badge variant="outline" className="px-4 py-1.5 md:px-6 md:py-2 md:text-sm font-bold border-slate-200 bg-slate-50 text-noiz-primary">Message</Badge>
          </div>
        </div>
      )}

      {/* Recording State */}
      {currentStep === 'recording' && (
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-100">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-noiz-primary/5 blur-[120px]"></div>
            <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] rounded-full bg-noiz-primary/5 blur-[150px]"></div>
          </div>

          <main className="flex flex-col h-full px-6 md:px-12 pb-12 pt-8 max-w-2xl mx-auto w-full relative">
            {/* Top Status & Timer */}
            <header className="flex flex-col items-center justify-center space-y-4 md:space-y-6 pt-4">
              <div className="flex items-center space-x-2 bg-noiz-primary/10 px-3 py-1 md:px-5 md:py-2 rounded-full border border-noiz-primary/20">
                <span className={`flex h-2 w-2 md:h-3 md:w-3 rounded-full bg-noiz-primary ${!isPaused ? 'animate-pulse' : ''}`}></span>
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-noiz-primary">
                  {isPaused ? 'Paused' : 'Recording'}
                </span>
              </div>
              <div className="text-6xl md:text-8xl font-light tracking-tight tabular-nums text-slate-900">
                {formatTime(duration)}
              </div>
            </header>

            {/* Waveform Visualizer Section */}
            <div className="flex-grow flex flex-col items-center justify-center relative my-8 md:my-16">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-noiz-primary/10 blur-[100px] rounded-full opacity-40"></div>
              {/* Fluid Waveform Visualization */}
              <div className="w-full flex items-center justify-center space-x-1.5 md:space-x-3 h-48 md:h-64 overflow-hidden">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1.5 md:w-3 bg-noiz-primary rounded-full transition-all duration-150 ease-out"
                    style={{ 
                      height: isPaused ? '8px' : `${20 + Math.random() * (audioLevel * 100 + 20)}%`,
                      opacity: 0.3 + (Math.sin(i * 0.5) * 0.2),
                      boxShadow: !isPaused ? '0 0 15px rgba(124,58,237,0.3)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Transcription Area */}
            <div className="h-40 md:h-56 overflow-y-auto mb-12 relative group">
              {/* Fade masks for smooth scrolling text */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-10"></div>
              
              <div className="space-y-4 px-2 md:px-8">
                {realtimeTranscript ? (
                  <p className="text-noiz-primary text-xl md:text-3xl font-medium leading-relaxed">
                    {realtimeTranscript}
                    <span className="inline-block w-1.5 h-6 md:w-2 md:h-8 bg-noiz-primary ml-1 align-middle opacity-75 animate-pulse"></span>
                  </p>
                ) : (
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    Start speaking and your live transcript will appear here.
                  </p>
                )}
              </div>
            </div>

            {/* Controls Footer */}
            <div className="flex items-center justify-between w-full px-4 md:px-12 mb-8">
              {/* Cancel Button */}
              <button 
                onClick={cancelRecording}
                className="group flex flex-col items-center space-y-2 focus:outline-none"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 group-active:scale-95 transition-transform hover:bg-slate-100">
                  <X className="w-6 h-6 md:w-8 md:h-8 text-slate-400" />
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">Cancel</span>
              </button>

              {/* Finish Session Button (Primary Action) */}
              <button 
                onClick={stopRecording}
                className="relative group focus:outline-none"
              >
                <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-xl group-active:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] group-active:scale-90 transition-transform relative z-10 group-hover:bg-red-500">
                  <Square className="w-7 h-7 md:w-10 md:h-10 text-white fill-current" />
                </div>
                <span className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-400 whitespace-nowrap">Finish Session</span>
              </button>

              {/* Pause/Resume Button */}
              <button 
                onClick={togglePause}
                className="group flex flex-col items-center space-y-2 focus:outline-none"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-noiz-primary/10 border border-noiz-primary/20 group-active:scale-95 transition-transform hover:bg-noiz-primary/20">
                  {isPaused ? (
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-noiz-primary fill-current" />
                  ) : (
                    <Pause className="w-6 h-6 md:w-8 md:h-8 text-noiz-primary fill-current" />
                  )}
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-noiz-primary/70">
                  {isPaused ? 'Resume' : 'Pause'}
                </span>
              </button>
            </div>
          </main>
        </div>
      )}

      {/* Post-Recording Review */}
      {currentStep === 'review' && (
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-right-4 duration-300">
          <div className="p-8 md:p-12 flex-1 flex flex-col space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Review Transcript</h2>
            
            <div className="flex-1 bg-slate-50 rounded-2xl md:rounded-[2rem] p-6 md:p-10 border border-slate-100 overflow-y-auto">
                  <textarea 
                    className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-700 leading-relaxed resize-none text-base md:text-xl"
                    value={finalTranscript}
                    onChange={(e) => setFinalTranscript(e.target.value)}
                    placeholder="Your transcript will appear here. You can edit it before generating an output."
                  />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep('recording')} className="flex-1 h-12 md:h-16 gap-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:text-lg rounded-xl md:rounded-2xl">
                <RotateCcw className="w-4 h-4 md:w-6 md:h-6" />
                Redo
              </Button>
              <Button onClick={() => setCurrentStep('output_selection')} className="flex-1 h-12 md:h-16 gap-2 bg-noiz-primary text-white hover:bg-noiz-primary/90 md:text-lg rounded-xl md:rounded-2xl shadow-lg shadow-noiz-primary/25">
                Next
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Output Selection */}
      {currentStep === 'output_selection' && (
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-right-4 duration-300">
          <div className="p-6 md:p-12 flex-1 flex flex-col space-y-6 md:space-y-8">
            {/* Header with Progress */}
            <div className="flex items-center justify-between w-full mb-2">
              <button 
                onClick={() => setCurrentStep('review')}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-noiz-primary hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex-1 mx-4 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-noiz-primary rounded-full" />
              </div>

              <button 
                onClick={cancelRecording}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Select Output</h2>

            {/* Raw Transcript Collapsible */}
            <div className="w-full">
              <button 
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                className="w-full p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-slate-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-noiz-primary/10 flex items-center justify-center text-noiz-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Raw Transcript</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isTranscriptOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTranscriptOpen && (
                <div className="mt-2 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    {finalTranscript || realtimeTranscript || 'No transcript available yet.'}
                  </p>
                </div>
              )}
            </div>

            {/* Output Type Cards */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'email', title: 'Email Draft', desc: 'Professional structure with subject line and formal greeting.', icon: Mail, color: 'text-noiz-primary', bg: 'bg-noiz-primary/10' },
                { id: 'meeting_notes', title: 'Meeting Notes', desc: 'Bulleted key points, decisions made, and clear action items.', icon: FileText, color: 'text-noiz-accent', bg: 'bg-noiz-accent/10' },
                { id: 'message', title: 'Quick Message', desc: 'Concise and casual summary for Slack, Teams, or SMS.', icon: MessageSquare, color: 'text-noiz-secondary', bg: 'bg-noiz-secondary/10' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleOutputSelection(item.id as OutputType)}
                  className="flex items-center gap-4 md:gap-6 p-5 md:p-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] text-left hover:border-noiz-primary/30 hover:bg-slate-100 transition-all group"
                >
                  <div className={`w-14 h-14 md:w-20 md:h-20 ${item.bg} ${item.color} rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 md:w-10 md:h-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-slate-300 group-hover:text-noiz-primary group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Final Output Review */}
      {currentStep === 'final_review' && (
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in slide-in-from-right-4 duration-300">
          <div className="p-8 md:p-12 flex-1 flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900">Final Output</h2>
              <Badge className="bg-noiz-primary/10 text-noiz-primary border-noiz-primary/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
                {selectedOutputType?.replace('_', ' ')}
              </Badge>
            </div>

            <div className="flex-1 bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100 overflow-y-auto space-y-6">
              {generatedOutput ? (
                <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {generatedOutput}
                </div>
              ) : (
                <p className="text-slate-400 text-sm md:text-base">
                  No output generated yet.
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep('output_selection')} className="flex-1 h-12 md:h-16 gap-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 md:text-lg rounded-xl md:rounded-2xl">
                <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
                Back
              </Button>
              <Button onClick={handleSaveToLibrary} className="flex-1 h-12 md:h-16 gap-2 bg-noiz-primary text-white hover:bg-noiz-primary/90 md:text-lg rounded-xl md:rounded-2xl shadow-lg shadow-noiz-primary/25">
                <Download className="w-4 h-4 md:w-6 md:h-6" />
                Save to Library
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
