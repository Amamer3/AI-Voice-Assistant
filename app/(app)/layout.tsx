'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mic, BookOpen, Loader2, LayoutGrid } from 'lucide-react'
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
    { href: '/recorder', label: 'Recorder', icon: Mic },
    { href: '/knowledge', label: 'Library', icon: BookOpen },
    { href: '/templates', label: 'Templates', icon: LayoutGrid },
  ]

  return (
    <div className="flex min-h-screen bg-white text-slate-900 flex-col font-sans">

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 flex items-center justify-around z-50">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? 'text-noiz-primary' : 'text-slate-400'
              }`}
            >
              <div className={`p-2 rounded-xl ${isActive ? 'bg-noiz-primary/10' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          )
        })}
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
