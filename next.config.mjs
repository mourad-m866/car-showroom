/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // السماح بعرض الصور المستضافة على CDN الخاص بـ Sanity عبر next/image
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}
export default nextConfig
