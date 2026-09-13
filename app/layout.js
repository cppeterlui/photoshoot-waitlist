import './globals.css'

export const metadata = {
  title: 'Photoshoot Lineup Waitlist',
  description: 'Real-time waitlist management for photo booths and photography sessions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  )
}
