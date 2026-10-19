import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

// عميل بصلاحية الكتابة: يستعمل التوكن السري، ويُستدعى من الخادم فقط (api/submit).
// لا تضع التوكن في متغير يبدأ بـ NEXT_PUBLIC حتى لا يصل إلى المتصفح.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
