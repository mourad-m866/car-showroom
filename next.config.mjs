/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  typescript: {
    // تجاهل أخطاء الـ TypeScript أثناء الـ Build
    ignoreBuildErrors: true,
  },
  eslint: {
    // تجاهل أخطاء الـ ESLint أثناء الـ Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;