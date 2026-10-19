// يستقبل نموذج «أضف إعلانك»، يرفع الصور إلى Sanity، وينشئ السيارة كمسودة (Draft).
// المسودة لا تظهر في الموقع حتى تراجعها وتضغط Publish من /studio.
//
// ملاحظة: نتصل بـ Sanity عبر fetch المدمج في Node مباشرة (بدل مكتبة العميل)
// لأن طبقة HTTP في المكتبة قد تفشل على بعض الشبكات بخطأ isNetworkError.
import { NextRequest, NextResponse } from 'next/server'
import { BRANDS, BRAND_MODELS, FEATURES, FUELS, GEARBOXES, MODEL_YEARS } from '@/sanity/options'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const runtime = 'nodejs'

const MAX_IMAGES = 6
const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4 ميغابايت للصورة الواحدة

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

// عنوان واجهة Sanity لمشروعك
const API = `https://${projectId}.api.sanity.io/v${apiVersion}`

// طلب إلى Sanity مع مهلة 60 ثانية وإعادة المحاولة 3 مرات عند انقطاع الشبكة
async function sanityRequest(url: string, init: RequestInit) {
  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}` },
        signal: AbortSignal.timeout(60_000),
      })
      if (!res.ok) {
        // أخطاء Sanity الواضحة (401، 403...) لا تفيد معها إعادة المحاولة
        throw Object.assign(new Error(`Sanity ${res.status}: ${await res.text()}`), { noRetry: true })
      }
      return await res.json()
    } catch (e) {
      lastError = e
      if ((e as { noRetry?: boolean }).noRetry) break
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
  throw lastError
}

// رفع صورة واحدة والحصول على معرّفها
async function uploadImage(f: File): Promise<string> {
  const body = new Uint8Array(await f.arrayBuffer())
  const json = await sanityRequest(`${API}/assets/images/${dataset}?filename=${encodeURIComponent(f.name)}`, {
    method: 'POST',
    headers: { 'Content-Type': f.type },
    body,
  })
  return json.document._id as string
}

export async function POST(req: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return fail('إعداد الخادم ناقص: أضف SANITY_API_WRITE_TOKEN', 500)
  }

  const form = await req.formData()

  // حقل مخفي يملؤه الروبوتات فقط: نتجاهل الطلب بصمت
  if (form.get('website')) return NextResponse.json({ ok: true })

  const get = (k: string) => String(form.get(k) ?? '').trim()

  // ---- التحقق من القيم (لا نثق بما يأتي من المتصفح) ----
  const rawTitle = get('title') // اختياري
  const variant = get('variant') // اختياري
  const brand = get('brand')
  const model = get('model')
  const fuel = get('fuel')
  const transmission = get('transmission')
  const price = Number(get('price'))
  const mileage = get('mileage') ? Number(get('mileage')) : undefined
  const sellerName = get('sellerName')
  const sellerPhone = get('sellerPhone')

  if (rawTitle.length > 120) return fail('العنوان طويل جداً')
  if (!BRANDS.includes(brand)) return fail('اختر الماركة')
  if (!MODEL_YEARS.includes(model)) return fail('اختر الموديل')
  if (variant && !(BRAND_MODELS[brand] ?? []).includes(variant)) return fail('الطراز غير صحيح')
  // إن لم يكتب العنوان نكوّنه تلقائياً: الماركة + الطراز + الموديل
  const title = rawTitle || [brand, variant, model].filter(Boolean).join(' ')
  if (!(price > 0)) return fail('اكتب السعر')
  if (mileage !== undefined && !(mileage >= 0)) return fail('المسافة المقطوعة غير صحيحة')
  if (fuel && !FUELS.includes(fuel)) return fail('نوع الوقود غير صحيح')
  if (transmission && !GEARBOXES.includes(transmission)) return fail('ناقل الحركة غير صحيح')
  if (sellerName.length < 2) return fail('اكتب اسمك')
  if (!/^[0-9+\s]{9,16}$/.test(sellerPhone)) return fail('رقم الهاتف غير صحيح')

  const features = form.getAll('features').map(String).filter((f) => FEATURES.includes(f))

  const files = form
    .getAll('images')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_IMAGES)
  if (files.length === 0) return fail('أضف صورة واحدة على الأقل')

  try {
    // ---- رفع الصور إلى Sanity ----
    const images = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) return fail('الملفات المرفوعة يجب أن تكون صوراً')
      if (f.size > MAX_IMAGE_BYTES) return fail('حجم الصورة كبير، الحد الأقصى 4 ميغابايت')
      const assetId = await uploadImage(f)
      images.push({ _key: crypto.randomUUID(), _type: 'image', asset: { _type: 'reference', _ref: assetId } })
    }

    // ---- إنشاء السيارة كمسودة: المعرّف يبدأ بـ drafts. ----
    const id = crypto.randomUUID()
    await sanityRequest(`${API}/data/mutate/${dataset}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mutations: [
          {
            create: {
              _id: `drafts.${id}`,
              _type: 'car',
              title,
              slug: { _type: 'slug', current: `car-${id.slice(0, 8)}` },
              brand,
              variant: variant || undefined,
              model,
              price,
              mileage,
              fuel: fuel || undefined,
              transmission: transmission || undefined,
              status: 'متوفرة',
              featured: false,
              description: get('description') || undefined,
              features,
              images,
              sellerName,
              sellerPhone,
            },
          },
        ],
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('submit error', err)
    // أثناء التطوير نعرض السبب الحقيقي في الصفحة لتسهيل الإصلاح (لا يظهر بعد النشر)
    const reason = process.env.NODE_ENV !== 'production' ? ` (${(err as Error).message.slice(0, 200)})` : ''
    return fail('تعذر حفظ الإعلان، حاول مرة أخرى' + reason, 500)
  }
}