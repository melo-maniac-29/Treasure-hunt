import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Treasure Hunt - Jungle Explorer',
  description: 'A real-time, interactive treasure hunt game with jungle theming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-jungle-primary via-jungle-secondary to-jungle-primary">
          {children}
        </div>
      </body>
    </html>
  )
}