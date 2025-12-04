import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kiroween Kinship: Ultimate Monster Matchmaker',
  description: 'Discover your inner monster through personality analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg text-white antialiased">
        <div className="relative min-h-screen animated-gradient">
          {/* Atmospheric fog layers */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fog to-transparent opacity-40" 
                 style={{ animation: 'fog-drift 12s ease-in-out infinite' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-fog to-transparent opacity-30" 
                 style={{ animation: 'fog-drift 15s ease-in-out infinite reverse' }} />
          </div>
          
          {/* Radial gradient spotlight */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-neon-violet/10 via-transparent to-transparent opacity-50" />
          </div>
          
          {/* Vignette effect */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-transparent to-black/60" />
          </div>
          
          {/* Main content */}
          <main className="relative z-10 min-h-screen pb-20">
            {children}
          </main>
          
          {/* Footer with neon accent */}
          <footer className="relative z-10 py-8 text-center border-t border-dark-border backdrop-blur-sm">
            <div className="container mx-auto px-4">
              <p className="text-sm text-gray-500 hover:text-neon-violet transition-all-smooth font-gothic">
                Kiroween Kinship © 2024
              </p>
              <div className="mt-2 flex justify-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-neon-violet pulse-glow" />
                <span className="inline-block w-2 h-2 rounded-full bg-neon-violet pulse-glow" style={{ animationDelay: '1s' }} />
                <span className="inline-block w-2 h-2 rounded-full bg-neon-violet pulse-glow" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
