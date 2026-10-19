'use client'
// مكوّن عميل (Client Component) لأنه يحتاج حالة: الصورة المختارة
import Image from 'next/image'
import { useState } from 'react'

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  if (images.length === 0) return <div className="aspect-[4/3] rounded-md bg-line" />

  return (
    <div>
      {/* الصورة الكبيرة */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-line">
        <Image src={images[active]} alt={`${title} – صورة ${active + 1}`} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
      </div>
      {/* الصور المصغرة: الضغط على واحدة يغيّر الصورة الكبيرة */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`عرض الصورة ${i + 1}`}
            className={`relative aspect-[4/3] overflow-hidden rounded border-2 ${i === active ? 'border-petrol' : 'border-transparent'}`}
          >
            <Image src={src} alt="" fill sizes="120px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
