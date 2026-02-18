'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, Trash2, Search, Loader2, Mail, FileText, MessageSquare, Clock, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface KnowledgeBaseProps {
  sessionId: string
}

interface VoiceOutputItem {
  id: string
  type: 'email' | 'meeting_notes' | 'message'
  title: string
  preview: string
  createdAt: string
}

interface KnowledgeItem {
  id: string
  fileName: string
  preview: string
  createdAt: string
  similarity?: number
}

export default function KnowledgeBase({ sessionId }: KnowledgeBaseProps) {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [voiceOutputs, setVoiceOutputs] = useState<VoiceOutputItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()

      setItems((prev) => [
        ...prev,
        {
          id: data.id,
          fileName: file.name,
          preview: data.preview || file.name,
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error uploading file:', error)
      setErrorMessage('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      setErrorMessage('Failed to delete item. Please refresh and try again.')
    }
  }

  const deleteVoiceOutput = (id: string) => {
    if (!confirm('Are you sure you want to delete this recording?')) return
    setVoiceOutputs(prev => prev.filter(item => item.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'meeting_notes': return <FileText className="w-4 h-4" />
      case 'message': return <MessageSquare className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-noiz-primary/10 text-noiz-primary border-noiz-primary/20'
      case 'meeting_notes': return 'bg-noiz-accent/10 text-noiz-accent border-noiz-accent/20'
      case 'message': return 'bg-noiz-secondary/10 text-noiz-secondary border-noiz-secondary/20'
      default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
    }
  }

  return (
    <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-8 px-4 py-8 lg:py-12">
      {errorMessage && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 flex items-start justify-between gap-3">
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">Library</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium mt-2">All your recordings and reference docs in one place.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-500">
              Voice outputs: <span className="ml-1 text-slate-900">{voiceOutputs.length}</span>
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full border-slate-200 bg-white text-xs md:text-sm font-bold text-slate-500">
              Knowledge docs: <span className="ml-1 text-slate-900">{items.length}</span>
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64 lg:w-80 2xl:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-noiz-primary/20 transition-all md:text-lg"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl border-slate-200 bg-white h-12 w-12 md:h-14 md:w-14 hover:bg-slate-50 hover:border-noiz-primary/30">
            <Filter className="w-5 h-5 md:w-6 md:h-6 text-slate-500" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="outputs" className="w-full">
        <TabsList className="bg-slate-50 p-1.5 rounded-[2rem] mb-12 border border-slate-100 inline-flex h-auto">
          <TabsTrigger value="outputs" className="rounded-[1.5rem] px-8 py-3 md:px-12 md:py-4 md:text-lg data-[state=active]:bg-noiz-primary data-[state=active]:text-white text-slate-500 font-black transition-all">Voice Outputs</TabsTrigger>
          <TabsTrigger value="knowledge" className="rounded-[1.5rem] px-8 py-3 md:px-12 md:py-4 md:text-lg data-[state=active]:bg-noiz-primary data-[state=active]:text-white text-slate-500 font-black transition-all">Knowledge</TabsTrigger>
        </TabsList>

        <TabsContent value="outputs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
            {voiceOutputs.map((output) => (
              <Card key={output.id} className="group p-6 md:p-8 bg-white border-slate-100 hover:border-noiz-primary/20 hover:shadow-2xl hover:shadow-noiz-primary/5 transition-all cursor-pointer flex flex-col h-full rounded-[2.5rem] relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-noiz-primary/5 blur-[60px] pointer-events-none group-hover:bg-noiz-primary/10 transition-all"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <Badge variant="outline" className={`gap-1.5 px-3 py-1 md:px-4 md:py-1.5 font-bold md:text-xs border-none ${getTypeColor(output.type)}`}>
                    {getIcon(output.type)}
                    <span className="capitalize">{output.type.replace('_', ' ')}</span>
                  </Badge>
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(output.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-noiz-primary transition-colors relative z-10">{output.title}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed line-clamp-3 mb-8 flex-1 relative z-10 font-medium">
                  {output.preview}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm font-bold text-slate-400 hover:text-slate-900 p-0 h-auto group-hover:translate-x-1 transition-transform">
                    View Details
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-10 h-10 md:w-12 md:h-12 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteVoiceOutput(output.id)
                    }}
                  >
                    <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                </div>
              </Card>
            ))}
            
            <a href="/recorder" className="h-full min-h-[250px] md:min-h-[320px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-noiz-primary/30 hover:bg-slate-50 transition-all">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-noiz-primary/10 transition-all">
                <Plus className="w-8 h-8 md:w-10 md:h-10 text-slate-400 group-hover:text-noiz-primary" />
              </div>
              <span className="text-base md:text-lg font-bold text-slate-400 group-hover:text-noiz-primary">Create from Recorder</span>
            </a>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-8">
          <Card className="p-12 md:p-20 border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center text-center space-y-6 md:space-y-8 rounded-[3rem] relative overflow-hidden shadow-none">
            <div className="absolute inset-0 bg-noiz-primary/5 blur-[100px] pointer-events-none"></div>
            
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-white shadow-lg border border-slate-100 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 md:w-14 md:h-14 text-noiz-primary" />
            </div>
            <div className="max-w-md space-y-3 relative z-10">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Upload Knowledge</h3>
              <p className="text-sm md:text-xl text-slate-500 font-medium">Add PDFs, documents, or notes to give the AI more context about your projects.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              accept=".txt,.pdf,.md,.json"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-noiz-primary text-white hover:bg-noiz-primary/90 h-14 md:h-20 px-10 md:px-16 rounded-2xl md:rounded-3xl font-black md:text-xl relative z-10 shadow-xl shadow-noiz-primary/20"
            >
              {isUploading ? <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" /> : 'Select Files'}
            </Button>
          </Card>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {items.map((item) => (
                <Card key={item.id} className="p-8 md:p-10 bg-white border-slate-100 hover:border-noiz-primary/20 transition-all rounded-[2.5rem] group shadow-sm">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-noiz-primary/10 flex items-center justify-center text-noiz-primary">
                          <FileText className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <p className="font-bold text-slate-900 text-xl md:text-2xl tracking-tight">{item.fileName}</p>
                      </div>
                      <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm md:text-lg text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {item.preview}
                      </p>
                    </div>
                    <Button
                      onClick={() => deleteItem(item.id)}
                      size="icon"
                      variant="ghost"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl w-12 h-12 md:w-14 md:h-14 transition-all"
                    >
                      <Trash2 className="w-6 h-6 md:w-7 md:h-7" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 md:py-32 text-center">
              <p className="text-slate-400 text-lg md:text-2xl font-medium italic opacity-50">No documents uploaded yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
