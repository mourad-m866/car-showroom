import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { dataset, projectId } from './env'

const builder = imageUrlBuilder({ projectId, dataset })

// تحويل كائن صورة Sanity إلى رابط جاهز: urlFor(img).width(800).url()
export const urlFor = (source: SanityImageSource) => builder.image(source)
