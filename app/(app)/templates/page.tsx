'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Mail, FileText, MessageSquare, Plus, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const templates = [
  {
    id: '1',
    name: 'Executive Summary',
    description: 'High-level overview for leadership teams.',
    type: 'meeting_notes',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-noiz-accent/10 text-noiz-accent border-noiz-accent/20'
  },
  {
    id: '2',
    name: 'Client Follow-up',
    description: 'Polished email template for post-meeting sync.',
    type: 'email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-noiz-primary/10 text-noiz-primary border-noiz-primary/20'
  },
  {
    id: '3',
    name: 'Daily Standup',
    description: 'Concise message for Slack/Teams channels.',
    type: 'message',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'bg-noiz-secondary/10 text-noiz-secondary border-noiz-secondary/20'
  },
  {
    id: '4',
    name: 'Action Items Only',
    description: 'Extracted list of tasks and responsibilities.',
    type: 'meeting_notes',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-noiz-accent/10 text-noiz-accent border-noiz-accent/20'
  },
  {
    id: '5',
    name: 'Project Proposal',
    description: 'Structured outline for new initiatives.',
    type: 'email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-noiz-primary/10 text-noiz-primary border-noiz-primary/20'
  }
]

export default function TemplatesPage() {
  const [activeType, setActiveType] = useState<'all' | 'email' | 'meeting_notes' | 'message'>('all')

  const filteredTemplates = activeType === 'all' ? templates : templates.filter((template) => template.type === activeType)

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-12 max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-8 md:space-y-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">Templates</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium mt-2">Choose a preset style for your voice outputs.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'email', label: 'Emails' },
              { id: 'meeting_notes', label: 'Meeting Notes' },
              { id: 'message', label: 'Messages' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveType(option.id as 'all' | 'email' | 'meeting_notes' | 'message')}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide border ${
                  activeType === option.id
                    ? 'bg-noiz-primary text-white border-noiz-primary'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <Button className="bg-noiz-primary text-white hover:bg-noiz-primary/90 rounded-xl md:rounded-2xl gap-2 h-12 md:h-16 px-6 md:px-10 font-bold md:text-xl shadow-lg shadow-noiz-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5 md:w-7 md:h-7" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group p-6 md:p-8 bg-white border-slate-100 hover:border-noiz-primary/30 hover:shadow-2xl hover:shadow-noiz-primary/5 transition-all cursor-pointer flex flex-col h-full rounded-[2.5rem] relative overflow-hidden shadow-sm">
            {/* Decorative background glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-noiz-primary/5 blur-[60px] group-hover:bg-noiz-primary/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-8 md:mb-10 relative z-10">
              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center border ${template.color}`}>
                <div className="scale-125 md:scale-150">
                  {template.icon}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all w-10 h-10 md:w-14 md:h-14 rounded-xl">
                <Star className="w-5 h-5 md:w-8 md:h-8" />
              </Button>
            </div>
            
            <h3 className="text-base md:text-lg font-black text-slate-900 mb-2 group-hover:text-noiz-primary transition-colors relative z-10">{template.name}</h3>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6 md:mb-8 flex-1 font-medium relative z-10">
              {template.description}
            </p>
            
            <Link href="/recorder" className="mt-auto relative z-10">
              <Button variant="outline" className="w-full h-10 md:h-12 rounded-xl md:rounded-2xl border-slate-100 bg-slate-50 text-slate-600 group-hover:bg-noiz-primary group-hover:text-white group-hover:border-noiz-primary transition-all gap-3 font-bold md:text-sm uppercase tracking-wider">
                Use Template
                <ChevronRight className="w-4 h-4 md:w-7 md:h-7" />
              </Button>
            </Link>
          </Card>
        ))}
        
        <button className="h-full min-h-[250px] md:min-h-[350px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-noiz-primary/30 hover:bg-noiz-primary/5 transition-all bg-slate-50/50 relative overflow-hidden">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-noiz-primary/10 transition-all group-hover:scale-110 duration-300">
            <Plus className="w-7 h-7 md:w-10 md:h-10 text-slate-400 group-hover:text-noiz-primary" />
          </div>
          <span className="text-base md:text-xl font-black text-slate-400 group-hover:text-noiz-primary transition-colors uppercase tracking-widest">Custom Template</span>
        </button>
      </div>
    </div>
  )
}
