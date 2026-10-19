import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/format'
import { client } from '@/sanity/client'
import { slugsQuery } from '@/sanity/queries'

// خريطة الموقع لمحركات البحث: الصفحات الثابتة + صفحة لكل سيارة
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await client.fetch<{ slug: string; _updatedAt: string }[]>(slugsQuery)
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/cars`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    ...cars.map((c) => ({ url: `${siteUrl}/cars/${c.slug}`, lastModified: new Date(c._updatedAt) })),
  ]
}
