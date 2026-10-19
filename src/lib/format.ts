// تنسيق السعر: 185000 -> "185,000 د.م"
export const formatPrice = (n?: number) =>
  n == null ? '' : `${new Intl.NumberFormat('en-US').format(n)} د.م`

// تنسيق الكيلومترات: 90000 -> "90,000 كم"
export const formatKm = (n?: number) =>
  n == null ? '' : `${new Intl.NumberFormat('en-US').format(n)} كم`

// رابط واتساب برسالة جاهزة تحتوي اسم السيارة ورابطها
export const whatsappLink = (message: string) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
