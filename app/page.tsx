'use client'

import Link from 'next/link'
import { 
  Mic, 
  Search, 
  Mail, 
  Users, 
  MessageSquare, 
  Copy, 
  Share2,
  Home,
  BookOpen,
  BarChart3,
  Settings,
  ChevronRight,
  LayoutGrid,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSession } from '@/hooks/use-session'

export default function HomePage() {
  const { sessionId } = useSession()

  const recentOutputs = [
    {
      id: '1',
      title: 'Client Follow-up Email',
      time: '2 mins ago',
      type: 'email',
      icon: <Mail className="w-5 h-5 text-noiz-primary" />,
      color: 'bg-noiz-primary/10'
    },
    {
      id: '2',
      title: 'Team Weekly Sync Minutes',
      time: '1 hour ago',
      type: 'meeting_notes',
      icon: <Users className="w-5 h-5 text-noiz-secondary" />,
      color: 'bg-noiz-secondary/10'
    },
    {
      id: '3',
      title: 'Slack Update: Project Nova',
      time: '4 hours ago',
      type: 'message',
      icon: <MessageSquare className="w-5 h-5 text-noiz-accent" />,
      color: 'bg-noiz-accent/10'
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      {/* Premium background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.03),transparent_50%)] pointer-events-none" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-noiz-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-noiz-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Desktop Top Navigation */}
      <nav className="hidden md:flex h-20 md:h-28 border-b border-slate-100 bg-white/80 backdrop-blur-2xl px-8 items-center justify-center sticky top-0 z-50 transition-all duration-300">
        <div className="w-full max-w-[1800px] flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-noiz-primary rounded-2xl flex items-center justify-center shadow-lg shadow-noiz-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Mic className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-slate-900">VoiceFlow</h1>
          </div>

          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="text-lg lg:text-xl font-black text-noiz-primary tracking-wide relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-noiz-primary">Home</Link>
            <Link href="/knowledge" className="text-lg lg:text-xl font-bold text-slate-500 hover:text-slate-900 transition-all tracking-wide">Library</Link>
            <Link href="/templates" className="text-lg lg:text-xl font-bold text-slate-500 hover:text-slate-900 transition-all tracking-wide">Templates</Link>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl border border-slate-100 bg-white shadow-md flex items-center justify-center hover:border-noiz-primary transition-all cursor-pointer">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section (Mobile Profile Only) */}
      <header className="pt-8 px-6 pb-0 max-w-lg mx-auto w-full md:hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-noiz-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase italic text-slate-900">VF</span>
          </div>
          <div className="h-9 w-9 rounded-xl border border-slate-100 bg-white shadow-md flex items-center justify-center">
            <User className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-24 2xl:py-32 relative z-10">
        <div className="relative flex flex-col items-center">
          <div className="text-center mb-10 md:mb-16 space-y-3 max-w-4xl px-4">
            <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
              AI-Powered <span className="text-noiz-primary">Voice Assistant</span>
            </h2>
            <h3 className="text-xl md:text-3xl 2xl:text-4xl font-black text-slate-400 italic tracking-tight">
              Your Voice, Professional Output
            </h3>
            <p className="text-slate-500 text-sm md:text-lg 2xl:text-xl font-medium max-w-2xl mx-auto leading-relaxed pt-3">
              Transform voice notes into polished emails, meeting minutes, and messages. Just speak — we'll handle the rest.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
              <Link href="/recorder">
                <Button className="h-12 md:h-14 px-8 md:px-10 rounded-full bg-noiz-primary text-white hover:bg-noiz-primary/90 font-black md:text-lg shadow-lg shadow-noiz-primary/30">
                  Start Recording
                </Button>
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/templates">
                  <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 rounded-full border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 font-bold md:text-base">
                    Browse Templates
                  </Button>
                </Link>
                <Link href="/knowledge">
                  <Button variant="ghost" className="h-12 md:h-14 px-4 md:px-6 rounded-full text-slate-500 hover:text-noiz-primary hover:bg-noiz-primary/5 font-bold md:text-base">
                    View Library
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 bg-noiz-primary/10 rounded-full animate-ping scale-[1.5] md:scale-[2] opacity-20 duration-[3s]" />
            <div className="absolute inset-0 bg-noiz-secondary/5 rounded-full animate-pulse scale-[1.2] md:scale-[1.5] opacity-30 duration-[2s]" />

            <Link href="/recorder" className="relative flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-noiz-primary/20 blur-[40px] md:blur-[80px] rounded-full group-hover:bg-noiz-primary/30 transition-all duration-500" />
                <button className="relative z-10 w-40 h-40 md:w-64 md:h-64 2xl:w-80 2xl:h-80 bg-noiz-primary rounded-full flex items-center justify-center shadow-2xl shadow-noiz-primary/40 hover:scale-110 active:scale-95 transition-all duration-500 border-[14px] md:border-[20px] border-white">
                  <Mic className="w-16 h-16 md:w-28 md:h-28 2xl:w-36 2xl:h-36 text-white group-hover:scale-110 transition-transform duration-500" />
                </button>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-noiz-primary font-black text-2xl md:text-3xl animate-pulse tracking-tighter">TAP</span>
                <span className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-[0.3em]">Tap to start recording your voice note</span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Quick Actions & Recent Activity */}
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-8 pb-24 md:pb-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-12 items-start">
          {/* Quick Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-[0.28em] uppercase text-slate-400">Quick Actions</h3>
            </div>
            <Card className="bg-white border-slate-100 shadow-lg shadow-slate-200/40 p-5 md:p-6 rounded-3xl flex flex-col gap-4">
              <Link href="/recorder" className="flex items-center justify-between px-4 py-3 rounded-2xl bg-noiz-primary text-white hover:bg-noiz-primary/90 transition-colors">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-bold">Start a new recording</p>
                    <p className="text-xs text-white/80">Capture a fresh voice note</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/templates" className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-noiz-primary" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Use a template</p>
                    <p className="text-xs text-slate-500">Skip setup with preset styles</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/knowledge" className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-noiz-accent" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">View your library</p>
                    <p className="text-xs text-slate-500">Browse saved outputs and docs</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-[0.28em] uppercase text-slate-400">Recent Activity</h3>
            </div>
            <Card className="bg-white border-slate-100 shadow-lg shadow-slate-200/40 p-4 md:p-6 rounded-3xl">
              <div className="space-y-2">
                {recentOutputs.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between px-3 py-3 md:px-4 md:py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-[32px] p-2 flex justify-around items-center shadow-2xl">
          <Link href="/" className="p-4 bg-noiz-primary/10 text-noiz-primary rounded-2xl">
            <Home className="w-6 h-6" />
          </Link>
          <Link href="/knowledge" className="p-4 text-slate-400 hover:text-noiz-primary transition-colors">
            <BookOpen className="w-6 h-6" />
          </Link>
          <Link href="/templates" className="p-4 text-slate-400 hover:text-noiz-primary transition-colors">
            <BarChart3 className="w-6 h-6" />
          </Link>
          <Link href="/settings" className="p-4 text-slate-400 hover:text-noiz-primary transition-colors">
            <Settings className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}
