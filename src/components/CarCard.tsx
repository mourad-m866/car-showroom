import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/image'
import { formatKm, formatPrice } from '@/lib/format'

// نوع بيانات البطاقة (يطابق الحقول في cardFields)
export type CarCardData = {
  _id: string
  title: string
  slug: string
  price?: number
  model?: string
  mileage?: number
  fuel?: string
  transmission?: string
  status?: string
  brand?: string
  image?: any
}

// بطاقة سيارة تظهر في القوائم؛ الضغط عليها يفتح صفحة التفاصيل
export default function CarCard({ car }: { car: CarCardData }) {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group block overflow-hidden rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg border border-line bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-petrol"
    >
      <div className="relative aspect-[4/3] bg-line">
        {car.image && (
          <Image
            src={urlFor(car.image).width(800).height(600).fit('crop').url()}
            alt={car.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {/* شارة تظهر فقط إذا كانت السيارة محجوزة */}
        {car.status === 'محجوزة' && (
          <span className="absolute start-2 top-2 rounded bg-asphalt px-2 py-1 text-xs text-white">محجوزة</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold">{car.title}</h3>
        <p className="mt-1 text-sm text-asphalt/70">
          {[car.model, formatKm(car.mileage), car.fuel].filter(Boolean).join(' – ')}
        </p>
        <p className="mt-3 text-lg font-bold text-petrol">{formatPrice(car.price)}</p>
      </div>
    </Link>
  )
}
