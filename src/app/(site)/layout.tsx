import Footer from '@/components/Footer'
import Header from '@/components/Header'

// تخطيط صفحات الموقع. min-h-screen + flex-1 يثبّتان التذييل أسفل الصفحة دائماً.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
