'use client'
// نموذج «أضف إعلانك»: أقسام مرقمة، طراز يتبع الماركة، تجهيزات كأزرار، ومعاينة للصور.
import { useState } from 'react'
import { BRANDS, BRAND_MODELS, FEATURES, FUELS, GEARBOXES, MODEL_YEARS } from '@/sanity/options'

// تصغير الصورة قبل الرفع (حتى 1600px وجودة 80%) لأن Vercel يرفض الطلبات الأكبر من 4.5MB.
async function compress(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.8))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

// شكل موحد لحقول الإدخال
const input =
  'h-11 w-full rounded-lg border border-line bg-white px-3 text-base outline-none sm:text-sm transition focus:border-petrol focus:ring-2 focus:ring-petrol/20 disabled:bg-concrete disabled:text-asphalt/40'

// قسم مرقم داخل بطاقة
function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-bold">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-asphalt text-sm text-white">{n}</span>
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

// عنوان + حقل + ملاحظة اختيارية
function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-asphalt/60">{hint}</span>}
    </label>
  )
}

export default function AdForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [brand, setBrand] = useState('')
  const [variant, setVariant] = useState('')
  const [year, setYear] = useState('')
  const [previews, setPreviews] = useState<string[]>([])

  // العنوان التلقائي إن تركه فارغاً
  const autoTitle = [brand, variant, year].filter(Boolean).join(' ')

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget // نحفظه قبل أي await
    setStatus('sending')
    setMessage('')

    const data = new FormData(form)
    const files = (data.getAll('images') as File[]).filter((f) => f.size > 0).slice(0, 6)
    data.delete('images')
    for (const f of files) data.append('images', await compress(f))

    try {
      const res = await fetch('/api/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'حدث خطأ')
      form.reset()
      setBrand(''); setVariant(''); setYear(''); setPreviews([])
      setStatus('done')
    } catch (err) {
      setMessage((err as Error).message)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <h2 className="text-2xl font-bold">تم استلام إعلانك ✓</h2>
        <p className="mt-2 text-asphalt/75">سنراجعه ثم ينشر في الموقع، وسنتصل بك عند الحاجة.</p>
        <button onClick={() => setStatus('idle')} className="mt-5 font-bold text-petrol hover:underline">
          أضف إعلاناً آخر
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* حقل فخ للروبوتات: مخفي عن البشر */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <Section n={1} title="ما هي سيارتك؟">
        <Field label="الماركة">
          <select
            name="brand" required value={brand} className={input}
            onChange={(e) => { setBrand(e.target.value); setVariant('') }} // تغيير الماركة يمسح الطراز
          >
            <option value="" disabled>اختر الماركة</option>
            {BRANDS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </Field>

        {/* الطراز: قائمة تتبع الماركة (داسيا ← سانديرو، ستيبواي، لوغان...) */}
        <Field label="الطراز (اختياري)">
          <select name="variant" value={variant} disabled={!brand} onChange={(e) => setVariant(e.target.value)} className={input}>
            <option value="">{brand ? 'اختر الطراز' : 'اختر الماركة أولاً'}</option>
            {(BRAND_MODELS[brand] ?? []).map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>

        <Field label="الموديل (سنة الصنع)">
          <select name="model" required value={year} onChange={(e) => setYear(e.target.value)} className={input}>
            <option value="" disabled>اختر السنة</option>
            {MODEL_YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </Field>

        <Field label="عنوان الإعلان (اختياري)" hint="إن تركته فارغاً نكتبه لك تلقائياً.">
          <input name="title" maxLength={120} placeholder={autoTitle || 'مثال: داسيا سانديرو 2021'} className={input} />
        </Field>
      </Section>

      <Section n={2} title="المواصفات والسعر">
        <Field label="السعر (درهم)">
          <input name="price" type="number" min={1} required inputMode="numeric" className={input} />
        </Field>
        <Field label="المسافة المقطوعة (كم)">
          <input name="mileage" type="number" min={0} inputMode="numeric" className={input} />
        </Field>
        <Field label="الوقود">
          <select name="fuel" defaultValue="" className={input}>
            <option value="">غير محدد</option>
            {FUELS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="ناقل الحركة">
          <select name="transmission" defaultValue="" className={input}>
            <option value="">غير محدد</option>
            {GEARBOXES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>

        {/* التجهيزات: أزرار تتلوّن عند الاختيار (checkbox مخفي + peer) */}
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-bold">التجهيزات</legend>
          <div className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="checkbox" name="features" value={f} className="peer sr-only" />
                <span className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm transition peer-checked:border-petrol peer-checked:bg-petrol peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-petrol">
                  {f}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="وصف السيارة" wide>
          <textarea
            name="description" rows={4} maxLength={2000}
            className="w-full rounded-lg border border-line bg-white p-3 text-base outline-none sm:text-sm focus:border-petrol focus:ring-2 focus:ring-petrol/20"
          />
        </Field>
      </Section>

      <Section n={3} title="الصور">
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-line bg-concrete px-4 py-8 text-center transition hover:border-petrol">
            <span className="font-bold text-petrol">اضغط لاختيار الصور</span>
            <span className="text-sm text-asphalt/60">حتى 6 صور، والأولى هي الرئيسية</span>
            <input name="images" type="file" accept="image/*" multiple required onChange={onPick} className="sr-only" />
          </label>
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {previews.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt={`معاينة ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section n={4} title="بيانات التواصل">
        <Field label="اسمك">
          <input name="sellerName" required minLength={2} className={input} />
        </Field>
        <Field label="رقم هاتفك" hint="لا يظهر للزوار، نستعمله للتواصل معك فقط.">
          <input name="sellerPhone" type="tel" required inputMode="tel" placeholder="0600000000" className={input} />
        </Field>
      </Section>

      {status === 'error' && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p>
      )}
      <button
        disabled={status === 'sending'}
        className="h-12 w-full rounded-lg bg-petrol text-base font-bold text-white transition hover:bg-petrolDark disabled:opacity-60"
      >
        {status === 'sending' ? 'جاري الإرسال…' : 'نشر الإعلان'}
      </button>
    </form>
  )
}
