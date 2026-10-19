import Link from 'next/link'

// صفحة 404 عامة
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-3">ربما بيعت السيارة أو تغيّر الرابط.</p>
      <Link href="/cars" className="mt-6 inline-block text-petrol underline">تصفح السيارات المتوفرة</Link>
    </div>
  )
}
