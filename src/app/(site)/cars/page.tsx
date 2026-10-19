import type { Metadata } from 'next'
import CarCard, { type CarCardData } from '@/components/CarCard'
import CarFilters from '@/components/CarFilters'
import { client } from '@/sanity/client'
import { carsQuery } from '@/sanity/queries'

export const metadata: Metadata = { title: 'كل السيارات' }

const tags = { next: { tags: ['car'] } }

// في Next 15 المتغير searchParams هو Promise ويجب انتظاره
type Props = { searchParams: Promise<{ [key: string]: string | undefined }> }

export default async function CarsPage({ searchParams }: Props) {
  const sp = await searchParams
  // قراءة الفلاتر من الرابط مع قيم افتراضية (النص الفارغ = بدون فلتر)
  const q = sp.q?.trim() ?? ''
  const brand = sp.brand ?? ''
  const variant = sp.variant ?? ''
  const model = sp.model ?? ''
  const fuel = sp.fuel ?? ''
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : 1_000_000_000

  const cars = await client.fetch<CarCardData[]>(carsQuery, { q, brand, variant, model, fuel, maxPrice }, tags)

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">كل السيارات</h1>
      <div className="rounded-xl border border-line">
        <CarFilters values={{ q, brand, variant, model, fuel, maxPrice: sp.maxPrice ?? '' }} />
      </div>
      <p className="my-5 text-sm text-asphalt/70">{cars.length} سيارة</p>
      {cars.length === 0 ? (
        <p className="rounded-xl border border-line bg-white p-6">لا توجد نتائج. جرّب إزالة بعض الفلاتر.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => <CarCard key={c._id} car={c} />)}
        </div>
      )}
    </>
  )
}
