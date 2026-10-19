// قراءة متغيرات البيئة مع التأكد من وجودها
function need(value: string | undefined, name: string): string {
  if (!value) throw new Error(`المتغير ${name} غير موجود في ملف .env.local`)
  return value
}

export const projectId = need(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'NEXT_PUBLIC_SANITY_PROJECT_ID')
export const dataset = need(process.env.NEXT_PUBLIC_SANITY_DATASET, 'NEXT_PUBLIC_SANITY_DATASET')
export const apiVersion = '2025-01-01'
