import Link from 'next/link'

// تذييل الموقع: ثلاثة أعمدة (تعريف، روابط، تواصل). عدّل بيانات التواصل حسب معرضك.
export default function Footer() {
  return (
    <footer className="mt-12 bg-asphalt text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="h-3 w-3 rounded-full bg-signal" aria-hidden="true" />
            معرض السيارات
          </p>
          <p className="mt-3 text-sm leading-7">سيارات مفحوصة بأسعار واضحة وصور حقيقية، وتواصل مباشر مع المعرض.</p>
        </div>
        <div>
          <p className="font-bold text-white">روابط سريعة</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cars" className="hover:text-signal">كل السيارات</Link></li>
            <li><Link href="/add" className="hover:text-signal">أضف إعلانك</Link></li>
            <li><Link href="/contact" className="hover:text-signal">اتصل بنا</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-white">تواصل معنا</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>الدار البيضاء، شارع ... (عدّله)</li>
            <li dir="ltr" className="text-right">06 00 00 00 00</li>
            <li>الاثنين – السبت: 9:00 – 19:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} معرض السيارات. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
