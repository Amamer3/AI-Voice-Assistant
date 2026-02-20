'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, BookOpen, Loader2, Home, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { sessionId, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/recorder', label: 'Recorder', icon: Mic },
    { href: '/knowledge', label: 'Library', icon: BookOpen },
    { href: '/templates', label: 'Templates', icon: BarChart3 },
  ]

  return (
    <div className="flex min-h-screen bg-white text-slate-900 flex-col font-sans">

      {/* Desktop Top Navigation (hidden on Recorder page) */}
      {pathname !== '/recorder' && (
        <nav className="hidden md:flex h-20 md:h-24 border-b border-slate-100 bg-white/80 backdrop-blur-2xl px-8 items-center justify-center sticky top-0 z-40">
          <div className="w-full max-w-[1800px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-11 h-11 md:w-12 md:h-12 bg-noiz-primary rounded-2xl flex items-center justify-center shadow-lg shadow-noiz-primary/20"
                aria-label="Go to home"
              >
                <Mic className="w-6 h-6 text-white" />
              </Link>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.24em] uppercase text-slate-400">
                  Voice assistant
                </span>
                <span className="text-lg md:text-xl font-black tracking-tight text-slate-900">
                  VoiceFlow
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/recorder"
                className={`text-sm lg:text-base font-semibold tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                  pathname === '/recorder'
                    ? 'bg-noiz-primary/10 text-noiz-primary'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Recorder
              </Link>
              <Link
                href="/knowledge"
                className={`text-sm lg:text-base font-semibold tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                  pathname === '/knowledge'
                    ? 'bg-noiz-primary/10 text-noiz-primary'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Library
              </Link>
              <Link
                href="/templates"
                className={`text-sm lg:text-base font-semibold tracking-wide px-3 py-1.5 rounded-full transition-colors ${
                  pathname === '/templates'
                    ? 'bg-noiz-primary/10 text-noiz-primary'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Templates
              </Link>
            </div>
          </div>
        </nav>
      )}

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/25 ring-1 ring-white/10 rounded-[32px] p-2 flex justify-around items-center shadow-[0_18px_60px_rgba(15,23,42,0.65)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-4 rounded-2xl transition-colors ${
                  isActive ? 'bg-noiz-primary/10 text-noiz-primary' : 'text-slate-400 hover:text-noiz-primary'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-6 h-6" />
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-noiz-primary/5 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-noiz-accent/5 blur-[100px]"></div>
        </div>

        {/* Mobile Header - Hidden on Desktop */}
        <header className="md:hidden h-20 border-b border-slate-100 bg-white/50 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 bg-noiz-primary rounded-xl flex items-center justify-center shadow-lg shadow-noiz-primary/20">
              <Mic className="w-5 h-5 text-white" />
            </Link>
            <h2 className="text-lg font-black text-slate-900">
              {pathname === '/recorder' && 'Voice Recorder'}
              {pathname === '/knowledge' && 'Library'}
              {pathname === '/templates' && 'Templates'}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}
