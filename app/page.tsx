'use client'

import Link from 'next/link'
import { 
  Mic, 
  Home,
  BookOpen,
  BarChart3,
  ChevronRight,
  LayoutGrid,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSession } from '@/hooks/use-session'
import BlurText from '@/components/BlurText'
import TextPressure from '@/components/TextPressure'

export default function HomePage() {
  const { sessionId } = useSession()

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-4 transition-all duration-300">
        <div className="w-full flex items-center justify-between rounded-full bg-white/10 backdrop-blur-xl border border-white/25 ring-1 ring-white/10 shadow-[0_18px_60px_rgba(15,23,42,0.65)] px-6 py-3">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-noiz-primary rounded-2xl flex items-center justify-center shadow-lg shadow-noiz-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Mic className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-slate-900">VoiceFlow</h1>
          </div>

          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="text-base lg:text-lg font-black text-noiz-primary tracking-wide relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-noiz-primary">Home</Link>
            <Link href="/knowledge" className="text-base lg:text-lg font-bold text-slate-500 hover:text-slate-900 transition-all tracking-wide">Library</Link>
            <Link href="/templates" className="text-base lg:text-lg font-bold text-slate-500 hover:text-slate-900 transition-all tracking-wide">Templates</Link>
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

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-10 md:py-20 2xl:py-32 relative z-10">
        <div className="relative flex flex-col items-center">
          <div className="text-center mb-10 md:mb-16 space-y-3 max-w-3xl px-4">
            <div className="w-full max-w-3xl mx-auto pt-6 md:pt-12">
              <TextPressure
                text="AI-Powered Voice Assistant"
                className="text-2xl md:text-4xl 2xl:text-5xl font-black tracking-tighter leading-tight"
                textColor="#0f172a"
                minFontSize={18}
              />
            </div>
            <BlurText
              text="Your Voice, Professional Output"
              className="text-lg md:text-2xl 2xl:text-3xl font-black text-slate-400 italic tracking-tight"
            />
            <p className="text-slate-500 text-sm md:text-base 2xl:text-lg font-medium max-w-2xl mx-auto leading-relaxed pt-3">
              Transform voice notes into polished emails, meeting minutes, and messages. Just speak — the assistant handles structure and wording for you.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-4">
              <Link href="/recorder">
                <Button className="h-11 md:h-12 px-7 md:px-9 rounded-full bg-noiz-primary text-white hover:bg-noiz-primary/90 font-black text-sm md:text-base shadow-lg shadow-noiz-primary/30">
                  Start Recording
                </Button>
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/templates">
                  <Button variant="outline" className="h-12 md:h-14 px-6 md:px-8 rounded-full border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 font-bold md:text-base">
                    Browse Templates
                  </Button>
                </Link>
                {/* <Link href="/knowledge">
                  <Button variant="ghost" className="h-12 md:h-14 px-4 md:px-6 rounded-full text-slate-500 hover:text-noiz-primary hover:bg-noiz-primary/5 font-bold md:text-base">
                    View Library
                  </Button>
                </Link> */}
              </div>
              <div className="pt-3 flex flex-col items-center gap-2">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] md:text-xs font-semibold text-slate-400 uppercase tracking-[0.24em]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-noiz-primary" />
                    Step 1 Record
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-noiz-primary" />
                    Step 2 Review
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-noiz-primary" />
                    Step 3 Choose output
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-slate-400">
                  You control where audio is processed. Switch between local and cloud modes in the recorder.
                </p>
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
                <span className="text-noiz-primary font-black text-xl md:text-2xl animate-pulse tracking-tighter">TAP</span>
                <span className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-[0.3em]">Tap to start recording your voice note</span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <section className="w-full max-w-[1800px] mx-auto px-6 md:px-8 pb-16 md:pb-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-noiz-primary">
            Built for real workflows
          </p>
          <h3 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Turn rough voice notes into clear, shareable updates
          </h3>
          <p className="mt-3 text-sm md:text-base text-slate-500 leading-relaxed">
            Whether you are running meetings, building products, or journaling for yourself, the assistant
            keeps everything structured and easy to reuse.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="rounded-3xl border-slate-100 bg-white/90 shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-noiz-primary">
              For busy days
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900">Meetings that write themselves</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture long conversations once and get clean email follow-ups, decision logs, and task lists without rewriting everything.
            </p>
          </Card>

          <Card className="rounded-3xl border-slate-100 bg-white/90 shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-noiz-primary">
              For makers
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900">Talk through ideas, ship faster</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Brain-dump features, specs, or updates out loud and turn them into polished status emails, release notes, or docs.
            </p>
          </Card>

          <Card className="rounded-3xl border-slate-100 bg-white/90 shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-noiz-primary">
              For personal notes
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900">Clearer check-ins and reflections</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture journals, self-check-ins, and reminders as voice notes and turn them into tidy summaries you can revisit later.
            </p>
          </Card>
        </div>
      </section>

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
              <div className="space-y-3">
                <p className="text-sm md:text-base text-slate-500">
                  No recent activity yet. Start a recording to see your outputs here.
                </p>
                <Link href="/recorder">
                  <Button
                    variant="outline"
                    className="mt-1 h-10 md:h-11 px-4 rounded-full border-slate-200 text-sm font-semibold text-slate-700 hover:text-noiz-primary hover:border-noiz-primary/40"
                  >
                    Start your first recording
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <section className="w-full max-w-[1800px] mx-auto px-6 md:px-8 pb-20 md:pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-noiz-primary">
            Simple workflow
          </p>
          <h3 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Go from rough voice note to ready-to-send in minutes
          </h3>
          <p className="mt-3 text-sm md:text-base text-slate-500 leading-relaxed">
            Record once, then reuse the same thoughts as emails, updates, tickets, and more without rewriting
            everything from scratch.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="rounded-3xl border-slate-100 bg-white shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noiz-primary/10 text-noiz-primary text-xs font-black">
              1
            </span>
            <h4 className="text-base md:text-lg font-black text-slate-900">Talk through what happened</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture decisions, context, and next steps out loud while everything is still fresh in your head.
            </p>
          </Card>
          <Card className="rounded-3xl border-slate-100 bg-white shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noiz-primary/10 text-noiz-primary text-xs font-black">
              2
            </span>
            <h4 className="text-base md:text-lg font-black text-slate-900">Let the AI clean it up</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Turn the transcript into clear structure: bullet points, sections, and actions tailored to your use case.
            </p>
          </Card>
          <Card className="rounded-3xl border-slate-100 bg-white shadow-md shadow-slate-200/40 p-6 flex flex-col gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-noiz-primary/10 text-noiz-primary text-xs font-black">
              3
            </span>
            <h4 className="text-base md:text-lg font-black text-slate-900">Export where you work</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Copy results into email, docs, tickets, or chat so everyone gets the same crisp summary.
            </p>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-[1800px] mx-auto px-6 md:px-8 pb-28 md:pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-noiz-primary">
            Questions, answered
          </p>
          <h3 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Built for people who care about clarity and control
          </h3>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 md:p-6">
            <h4 className="text-sm md:text-base font-black text-slate-900 mb-1.5">
              What makes this different from a generic AI chatbot?
            </h4>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              VoiceFlow is tuned for turning spoken thoughts into finished outputs. It keeps structure, decisions,
              and tone instead of giving you a one-off reply that is hard to reuse.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 md:p-6">
            <h4 className="text-sm md:text-base font-black text-slate-900 mb-1.5">
              Do I need to clean up my speech for it to work?
            </h4>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              No. Speak the way you normally do. The system is designed to handle pauses, restarts, and half-finished
              sentences while keeping the important parts.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 md:p-6">
            <h4 className="text-sm md:text-base font-black text-slate-900 mb-1.5">
              Can I keep everything private on my device?
            </h4>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              Yes. Use the local processing mode in the recorder when you want audio to stay in your browser and skip
              cloud features.
            </p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 p-5 md:p-6">
            <h4 className="text-sm md:text-base font-black text-slate-900 mb-1.5">
              Who is this best suited for?
            </h4>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
              People who speak more than they type: founders, managers, ICs, and anyone who wants crisp updates without
              staring at a blank document.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/25 ring-1 ring-white/10 rounded-[32px] p-2 flex justify-around items-center shadow-[0_18px_60px_rgba(15,23,42,0.65)]">
          <Link
            href="/"
            className="p-4 bg-noiz-primary/10 text-noiz-primary rounded-2xl"
            aria-label="Home"
          >
            <Home className="w-6 h-6" />
          </Link>
          <Link
            href="/recorder"
            className="p-4 text-slate-400 hover:text-noiz-primary transition-colors"
            aria-label="Recorder"
          >
            <Mic className="w-6 h-6" />
          </Link>
          <Link
            href="/knowledge"
            className="p-4 text-slate-400 hover:text-noiz-primary transition-colors"
            aria-label="Library"
          >
            <BookOpen className="w-6 h-6" />
          </Link>
          <Link
            href="/templates"
            className="p-4 text-slate-400 hover:text-noiz-primary transition-colors"
            aria-label="Templates"
          >
            <BarChart3 className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}
