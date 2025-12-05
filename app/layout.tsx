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
      <body className="min-h-screen bg-[#050505] text-gray-200 antialiased">
        <div className="relative min-h-screen">
          {/* Deep darkness overlay */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          
          {/* Creeping fog layers */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(142,72,255,0.03)] to-transparent opacity-60" 
                 style={{ animation: 'fog-drift 15s ease-in-out infinite' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(142,72,255,0.02)] to-transparent opacity-40" 
                 style={{ animation: 'fog-drift 20s ease-in-out infinite reverse' }} />
          </div>
          
          {/* Eerie spotlight from above */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[rgba(142,72,255,0.08)] via-transparent to-transparent opacity-70 blur-3xl" />
          </div>
          
          {/* Heavy vignette - darker corners */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0" style={{ 
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' 
            }} />
          </div>
          
          {/* Subtle noise texture overlay */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          
          {/* Main content */}
          <main className="relative z-10 min-h-screen pb-20">
            {children}
          </main>
          
          {/* Haunting footer */}
          <footer className="relative z-10 py-8 text-center border-t border-[rgba(142,72,255,0.15)] backdrop-blur-sm bg-black/30">
            <div className="container mx-auto px-4">
              <p className="text-sm text-gray-600 hover:text-neon-violet transition-all-smooth font-gothic tracking-widest">
                Kiroween Kinship © 2025
              </p>
              <div className="mt-3 flex justify-center gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-violet/60 pulse-glow" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-violet/60 pulse-glow" style={{ animationDelay: '1s' }} />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-violet/60 pulse-glow" style={{ animationDelay: '2s' }} />
              </div>
              <p className="mt-2 text-xs text-gray-700 italic">The darkness knows your name...</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
