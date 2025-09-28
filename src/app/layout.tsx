import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Theater Production App',
  description: 'Collaboration tool for theater productions',
  icons: {
    icon: '/b2s_curtain_logo.svg',
    shortcut: '/b2s_curtain_logo.svg',
    apple: '/b2s_curtain_logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}