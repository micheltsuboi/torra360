import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'Torra 360',
  description: 'Sistema Multitenant de Torrefação Premium',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#c39967',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Torra 360',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.className} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  )
}
