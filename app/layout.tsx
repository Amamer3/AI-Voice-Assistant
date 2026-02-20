import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voice Productivity Platform',
  description: 'AI-powered voice recording and content generation platform',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 bg-white/90 backdrop-blur-sm px-6 py-4 text-xs text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>© {new Date().getFullYear()} Voice Productivity Platform.</span>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-noiz-primary">
                Privacy
              </a>
              <a href="/help" className="hover:text-noiz-primary">
                Help
              </a>
              <a
                href="mailto:feedback@example.com?subject=Voice%20assistant%20feedback"
                className="hover:text-noiz-primary"
              >
                Feedback
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
