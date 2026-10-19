import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { siteUrl } from '@/lib/format'

// خط عربي من Google Fonts يُحمَّل تلقائياً ومحلياً (دون طلب خارجي من المتصفح)
const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-plex',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'معرض السيارات', template: '%s | معرض السيارات' },
  description: 'سيارات جديدة ومستعملة بأسعار واضحة وفحص موثوق.',
}

// ضبط العرض على الهاتف: عرض الشاشة الحقيقي + لون شريط المتصفح
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E2530',
}

// التخطيط الجذري: اللغة العربية والاتجاه من اليمين لليسار
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={plex.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
