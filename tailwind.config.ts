import type { Config } from 'tailwindcss'

// ألوان المعرض: رمادي أسفلت + خلفية رمادية باردة + أخضر مزرق للأزرار
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: '#1E2530', // النص والعناوين والرأس
        concrete: '#F2F4F5', // خلفية الصفحة
        petrol: '#0B5C66', // لون الأزرار الأساسي
        petrolDark: '#084650',
        line: '#D9DEE2', // الحدود الفاصلة
        signal: '#F2B544', // لون إبراز لزر «أضف إعلانك»
      },
      fontFamily: { sans: ['var(--font-plex)', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
