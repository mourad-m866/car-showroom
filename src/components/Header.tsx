import Link from 'next/link'

// رأس الموقع. على الهاتف: صف أول (الشعار + زر الإعلان) وصف ثانٍ (الروابط). على الشاشات الكبيرة: صف واحد.
export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-asphalt text-white shadow-md">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <span className="h-3 w-3 rounded-full bg-signal" aria-hidden="true" />
          معرض السيارات
        </Link>

        <Link href="/add" className="order-2 rounded-lg bg-signal px-4 py-2 text-sm font-bold text-asphalt hover:brightness-95 sm:order-3 sm:text-base">
          أضف إعلانك
        </Link>

        {/* الروابط: صف كامل أسفل الشعار على الهاتف */}
        <div className="order-3 flex w-full gap-6 border-t border-white/10 pt-1 text-sm sm:order-2 sm:w-auto sm:gap-7 sm:border-0 sm:pt-0 sm:text-base">
          <Link href="/cars" className="py-2 hover:text-signal">السيارات</Link>
          <Link href="/contact" className="py-2 hover:text-signal">اتصل بنا</Link>
        </div>
      </nav>
    </header>
  )
}
