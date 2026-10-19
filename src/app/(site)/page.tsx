import Link from 'next/link'
import CarCard, { type CarCardData } from '@/components/CarCard'
import CarFilters from '@/components/CarFilters'
import { client } from '@/sanity/client'
import { featuredQuery } from '@/sanity/queries'

// الوسم يسمح بتحديث الصفحة عند استدعاء Webhook من Sanity
const tags = { next: { tags: ['car', 'brand'] } }

export default async function HomePage() {
  // جلب السيارات المميزة
  const cars = await client.fetch<CarCardData[]>(featuredQuery, {}, tags)

  return (
    <>
      {/* القسم الرئيسي: لوحة داكنة فيها العنوان والبحث */}
      <section className="rounded-2xl bg-asphalt px-5 py-10 text-white sm:px-10 sm:py-14">
        <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
          سيارة بسعر واضح، وحالة موثقة.
        </h1>
        <p className="mt-4 max-w-xl text-white/75">
          كل سيارة في معرضنا مفحوصة، وصورها حقيقية. اختر ما يناسبك وتواصل معنا مباشرة.
        </p>
        <div className="mt-8">
          <CarFilters values={{ q: '', brand: '', variant: '', model: '', fuel: '', maxPrice: '' }} />
        </div>
        <Link
          href="/add"
          className="mt-5 inline-block rounded-lg bg-signal px-5 py-3 font-bold text-asphalt hover:brightness-95"
        >
          أضف إعلانك
        </Link>
      </section>

      {/* السيارات المميزة */}
      <section className="mt-12">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">سيارات مميزة</h2>
          <Link href="/cars" className="text-sm font-bold text-petrol hover:underline">عرض كل السيارات ←</Link>
        </div>
        {cars.length === 0 ? (
          <p className="rounded-xl border border-line bg-white p-6">
            لا توجد سيارات مميزة بعد. أضف سيارة من لوحة /studio وفعّل خيار «عرضها في الصفحة الرئيسية».
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((c) => <CarCard key={c._id} car={c} />)}
          </div>
        )}
      </section>
    </>
  )
}
