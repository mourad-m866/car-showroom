import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Gallery from '@/components/Gallery'
import WhatsAppButton from '@/components/WhatsAppButton'
import { formatKm, formatPrice, siteUrl } from '@/lib/format'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { carBySlugQuery } from '@/sanity/queries'

type Props = { params: Promise<{ slug: string }> }

// دالة مساعدة لجلب السيارة (تُستعمل في الصفحة وفي generateMetadata)
const getCar = (slug: string) =>
  client.fetch(carBySlugQuery, { slug }, { next: { tags: ['car'] } })

// بيانات SEO وOpen Graph (تظهر عند مشاركة الرابط على واتساب وفيسبوك)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) return { title: 'سيارة غير موجودة' }
  const og = car.images?.[0] ? urlFor(car.images[0]).width(1200).height(630).url() : undefined
  return {
    title: car.title,
    description: `${car.title} – ${formatPrice(car.price)}`,
    openGraph: { images: og ? [og] : [] },
  }
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) notFound() // يعرض صفحة 404

  // تحويل صور Sanity إلى روابط جاهزة للمعرض
  const images: string[] = (car.images ?? []).map((img: any) =>
    urlFor(img).width(1200).height(900).fit('crop').url(),
  )

  // الجدول الصغير للمواصفات؛ نحذف الصفوف الفارغة
  const specs = [
    ['الماركة', car.brand], ['الطراز', car.variant], ['الموديل', car.model],
    ['المسافة', formatKm(car.mileage)], ['الوقود', car.fuel],
    ['ناقل الحركة', car.transmission], ['الحالة', car.status],
  ].filter(([, v]) => v)

  // رسالة واتساب جاهزة تتضمن رابط السيارة
  const waMessage = `مرحباً، أنا مهتم بالسيارة: ${car.title}\n${siteUrl}/cars/${car.slug}`

  return (
    <div className="grid gap-8 pb-20 lg:grid-cols-[3fr_2fr] lg:pb-0">
      <Gallery images={images} title={car.title} />

      <div>
        <h1 className="text-3xl font-bold">{car.title}</h1>
        <p className="mt-3 text-3xl font-bold text-petrol">{formatPrice(car.price)}</p>

        <dl className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
          {specs.map(([k, v]) => (
            <div key={k as string} className="flex justify-between px-4 py-3 text-sm">
              <dt className="text-asphalt/70">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>

        {/* رسالة واتساب جاهزة تتضمن رابط السيارة */}
        {/* على الشاشات الكبيرة: الزر هنا. على الهاتف: شريط ثابت أسفل الشاشة */}
        <div className="mt-6 hidden lg:block">
          <WhatsAppButton message={waMessage} />
        </div>
      </div>

      {(car.description || car.features?.length) && (
        <div className="lg:col-span-2">
          {car.description && <p className="max-w-2xl whitespace-pre-line leading-8">{car.description}</p>}
          {car.features?.length > 0 && (
            <ul className="mt-6 grid max-w-2xl gap-2 sm:grid-cols-2">
              {car.features.map((f: string) => (
                <li key={f} className="rounded border border-line bg-white px-3 py-2 text-sm">{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* شريط ثابت أسفل الهاتف: السعر + زر واتساب. env(safe-area...) يراعي الحافة السفلية في الآيفون */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <p className="text-lg font-bold text-petrol">{formatPrice(car.price)}</p>
        <WhatsAppButton message={waMessage} label="واتساب" />
      </div>
    </div>
  )
}
