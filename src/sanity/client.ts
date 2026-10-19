import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

// عميل Sanity للقراءة من الخادم.
// useCdn: false لأننا نعتمد على Webhook + revalidateTag لتحديث البيانات فوراً.
export const client = createClient({ projectId, dataset, apiVersion, useCdn: false })
