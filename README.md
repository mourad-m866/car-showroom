# معرض السيارات (Next.js + Sanity + Vercel)

## التشغيل المحلي
1. افتح المجلد في VS Code ثم في الطرفية: `npm install`
2. أنشئ مشروعاً في https://www.sanity.io/manage وانسخ الـ Project ID.
3. انسخ `.env.local.example` إلى `.env.local` واملأ القيم.
4. شغّل `npm run dev` ثم افتح:
   - الموقع: http://localhost:3000
   - لوحة التحكم: http://localhost:3000/studio (سجّل الدخول وأضف ماركة ثم سيارة)
5. في manage.sanity.io ← API ← CORS origins أضف `http://localhost:3000` مع تفعيل Allow credentials.

## النشر على Vercel
1. ارفع المشروع إلى GitHub ثم Import في Vercel.
2. أضف نفس متغيرات `.env.local` في Settings ← Environment Variables
   (وغيّر NEXT_PUBLIC_SITE_URL إلى رابط موقعك).
3. أضف رابط Vercel ونطاقك في CORS origins (مع Allow credentials).
4. التحديث الفوري: في Sanity ← API ← Webhooks أنشئ Webhook:
   - URL: `https://موقعك/api/revalidate`
   - Method: POST، Trigger: Create, Update, Delete
   - Secret: نفس قيمة SANITY_REVALIDATE_SECRET
