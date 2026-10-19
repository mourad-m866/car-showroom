import type { Metadata } from 'next'
import AdForm from '@/components/AdForm'

export const metadata: Metadata = { title: 'أضف إعلانك' }

// صفحة إضافة إعلان جديد
export default function AddPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold sm:text-4xl">أضف إعلانك</h1>
      <p className="mb-8 mt-2 text-asphalt/70">
        أربع خطوات قصيرة. يظهر إعلانك في الموقع بعد مراجعته.
      </p>
      <AdForm />
    </div>
  )
}
