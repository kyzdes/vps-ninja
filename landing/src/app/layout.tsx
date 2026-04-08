import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'VPS Ninja | DevOps Inside Claude Code',
  description: 'Deploy your repositories to your VPS in one command. No pain. No DevOps.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen antialiased bg-bg-dark text-text-main selection:bg-neon-green/30">
        {children}
      </body>
    </html>
  )
}
