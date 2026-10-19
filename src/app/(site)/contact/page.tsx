import type { Metadata } from 'next'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata: Metadata = { title: 'اتصل بنا' }

// صفحة الاتصال. عدّل العنوان والهاتف وساعات العمل حسب معرضك.
export default function ContactPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">اتصل بنا</h1>
      <ul className="mt-6 space-y-2 leading-8">
        <li>العنوان: الدار البيضاء، شارع ... (عدّله)</li>
        <li>الهاتف: 06 00 00 00 00 (عدّله)</li>
        <li>ساعات العمل: من الاثنين إلى السبت، 9:00 – 19:00</li>
      </ul>
      <div className="mt-6">
        <WhatsAppButton message="مرحباً، أريد الاستفسار عن سيارة." label="راسلنا على واتساب" />
      </div>
    </div>
  )
}
