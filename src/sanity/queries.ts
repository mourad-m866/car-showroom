// استعلامات GROQ. الحقول المشتركة لبطاقة السيارة:
// (الماركة والموديل صارا نصوصاً مباشرة، والموديل = سنة الصنع)
const cardFields = `
  _id, title, "slug": slug.current, price, model, variant, mileage,
  fuel, transmission, status, brand,
  "image": images[0]
`

// قائمة السيارات مع فلاتر اختيارية (الماركة، الوقود، أقصى سعر، بحث نصي)
// القيمة الفارغة "" تعني تجاهل الفلتر. السيارات المباعة لا تظهر.
export const carsQuery = `*[_type == "car" && status != "مباعة"
  && ($brand == "" || brand == $brand)
  && ($variant == "" || variant == $variant)
  && ($model == "" || model == $model)
  && ($fuel == "" || fuel == $fuel)
  && price <= $maxPrice
  && ($q == "" || title match $q + "*")
] | order(_createdAt desc){ ${cardFields} }`

// السيارات المميزة للصفحة الرئيسية (6 كحد أقصى)
export const featuredQuery = `*[_type == "car" && featured == true && status != "مباعة"]
  | order(_createdAt desc)[0...6]{ ${cardFields} }`

// تفاصيل سيارة واحدة عبر الـ slug
export const carBySlugQuery = `*[_type == "car" && slug.current == $slug][0]{
  title, "slug": slug.current, price, model, variant, mileage, fuel, transmission,
  status, description, features, brand, images
}`

// الماركات المستعملة فعلاً في السيارات (لعناصر الفلتر)
export const brandsQuery = `array::unique(*[_type == "car" && defined(brand)].brand)`

// كل الـ slugs لخريطة الموقع
export const slugsQuery = `*[_type == "car" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
