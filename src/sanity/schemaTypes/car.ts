import { defineField, defineType } from 'sanity'
import VariantInput from '../components/VariantInput'
import { BRANDS, FEATURES, FUELS, GEARBOXES, MODEL_YEARS, STATUSES } from '../options'

// مخطط السيارة: كل ما تدخله هنا يظهر كنموذج في لوحة /studio
export default defineType({
  name: 'car',
  title: 'سيارة',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'العنوان', type: 'string', validation: (r) => r.required() }),
    // الـ slug يُولَّد من العنوان ويُستعمل في رابط الصفحة /cars/slug
    defineField({ name: 'slug', title: 'الرابط', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),

    // قائمة منسدلة للماركة (بدل إنشاء ماركة منفصلة)
    defineField({
      name: 'brand', title: 'الماركة', type: 'string',
      options: { list: BRANDS, layout: 'dropdown' },
      validation: (r) => r.required(),
    }),

    // الطراز (سانديرو، ستيبواي...): قائمة تتبدل حسب الماركة، وهي اختيارية
    defineField({ name: 'variant', title: 'الطراز (النوع)', type: 'string', components: { input: VariantInput } }),

    // قائمة منسدلة للموديل = سنة الصنع (تم حذف حقل «سنة الصنع» لأنه صار مكرراً)
    defineField({
      name: 'model', title: 'الموديل (السنة)', type: 'string',
      options: { list: MODEL_YEARS, layout: 'dropdown' },
      validation: (r) => r.required(),
    }),

    defineField({ name: 'price', title: 'السعر (درهم)', type: 'number', validation: (r) => r.required().positive() }),
    defineField({ name: 'mileage', title: 'المسافة المقطوعة (كم)', type: 'number', validation: (r) => r.min(0) }),
    defineField({ name: 'fuel', title: 'الوقود', type: 'string', options: { list: FUELS, layout: 'dropdown' } }),
    defineField({ name: 'transmission', title: 'ناقل الحركة', type: 'string', options: { list: GEARBOXES, layout: 'dropdown' } }),
    defineField({ name: 'status', title: 'الحالة', type: 'string', options: { list: STATUSES, layout: 'dropdown' }, initialValue: 'متوفرة' }),
    defineField({ name: 'featured', title: 'عرضها في الصفحة الرئيسية', type: 'boolean', initialValue: false }),

    // hotspot يسمح باختيار نقطة التركيز عند قص الصورة
    defineField({ name: 'images', title: 'الصور (الأولى هي الرئيسية)', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'description', title: 'الوصف', type: 'text', rows: 5 }),

    // بيانات صاحب الإعلان (تأتي من نموذج الموقع، ولا تظهر للزوار)
    defineField({ name: 'sellerName', title: 'اسم صاحب الإعلان', type: 'string' }),
    defineField({ name: 'sellerPhone', title: 'هاتف صاحب الإعلان', type: 'string' }),

    // التجهيزات: قائمة جاهزة تختار منها بالنقر (اختيار متعدد)
    defineField({
      name: 'features', title: 'التجهيزات', type: 'array',
      of: [{ type: 'string' }],
      options: { list: FEATURES.map((f) => ({ title: f, value: f })) },
    }),
  ],
  // طريقة عرض السيارة في قائمة Studio
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'images.0' },
  },
})
