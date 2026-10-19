// Webhook يستدعيه Sanity عند نشر/تعديل/حذف محتوى لتحديث الموقع فوراً
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    // التحقق من توقيع الطلب باستعمال السر المشترك
    const { isValidSignature } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )
    if (!isValidSignature) {
      return new Response('توقيع غير صالح', { status: 401 })
    }
    // إبطال كاش البيانات الموسومة
    revalidateTag('car')
    revalidateTag('brand')
    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
