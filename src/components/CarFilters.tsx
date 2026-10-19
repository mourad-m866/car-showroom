'use client'
// شريط البحث: الماركة ← الطراز (يتبع الماركة) ← الموديل (سنة الصنع) + الوقود + السعر + بحث نصي.
// هو نموذج GET عادي: عند الإرسال تُضاف القيم إلى الرابط (/cars?brand=...) وتجلب الصفحة النتائج.
import { useState } from 'react'
import { formatPrice } from '@/lib/format'
import { BRANDS, BRAND_MODELS, FUELS, MODEL_YEARS } from '@/sanity/options'

type Props = {
  values: { q: string; brand: string; variant: string; model: string; fuel: string; maxPrice: string }
}

export default function CarFilters({ values }: Props) {
  // الماركة والطراز في حالة لأن قائمة الطراز تتغير حسب الماركة
  const [brand, setBrand] = useState(values.brand)
  const [variant, setVariant] = useState(values.variant)

  // text-asphalt ضروري: داخل اللوحة الداكنة يرث النص اللون الأبيض فيختفي على الخلفية البيضاء
  const field =
    'h-11 w-full rounded-lg border border-line bg-white px-3 text-base text-asphalt sm:text-sm outline-none transition focus:border-petrol focus:ring-2 focus:ring-petrol/20 disabled:bg-concrete disabled:text-asphalt/40'

  return (
    <form method="get" action="/cars" className="grid grid-cols-2 gap-3 rounded-xl bg-white p-3 text-asphalt sm:p-4 lg:grid-cols-4">
      {/* 1) نوع السيارة (الماركة) */}
      <select
        name="brand" value={brand} className={field} aria-label="نوع السيارة"
        onChange={(e) => { setBrand(e.target.value); setVariant('') }} // تغيير الماركة يمسح الطراز
      >
        <option value="">كل الماركات</option>
        {BRANDS.map((b) => <option key={b}>{b}</option>)}
      </select>

      {/* 2) تفريعات الماركة: داسيا ← سانديرو، ستيبواي، لوغان... */}
      <select
        name="variant" value={variant} disabled={!brand} className={field} aria-label="الطراز"
        onChange={(e) => setVariant(e.target.value)}
      >
        <option value="">{brand ? 'كل الأطرزة' : 'اختر الماركة أولاً'}</option>
        {(BRAND_MODELS[brand] ?? []).map((m) => <option key={m}>{m}</option>)}
      </select>

      {/* 3) الموديل = سنة الصنع */}
      <select name="model" defaultValue={values.model} className={field} aria-label="الموديل (سنة الصنع)">
        <option value="">كل الموديلات</option>
        {MODEL_YEARS.map((y) => <option key={y}>{y}</option>)}
      </select>

      <select name="fuel" defaultValue={values.fuel} className={field} aria-label="الوقود">
        <option value="">كل أنواع الوقود</option>
        {FUELS.map((f) => <option key={f}>{f}</option>)}
      </select>

      <input name="q" defaultValue={values.q} placeholder="ابحث باسم السيارة" className={`${field} col-span-2`} aria-label="بحث" />

      <select name="maxPrice" defaultValue={values.maxPrice} className={field} aria-label="أقصى سعر">
        <option value="">أي سعر</option>
        {[100000, 150000, 200000, 300000, 500000].map((p) => (
          <option key={p} value={p}>حتى {formatPrice(p)}</option>
        ))}
      </select>

      <button className="h-11 rounded-lg bg-petrol px-4 text-sm font-bold text-white transition hover:bg-petrolDark">بحث</button>
    </form>
  )
}
