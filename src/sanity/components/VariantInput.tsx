'use client'
// حقل «الطراز» في لوحة Studio: قائمة منسدلة تتبدل تلقائياً حسب الماركة المختارة
import { Select, Text } from '@sanity/ui'
import { set, unset, useFormValue, type StringInputProps } from 'sanity'
import { BRAND_MODELS } from '../options'

export default function VariantInput(props: StringInputProps) {
  const { value, onChange } = props
  // قراءة الماركة الحالية من نفس المستند
  const brand = useFormValue(['brand']) as string | undefined

  if (!brand) return <Text size={1} muted>اختر الماركة أولاً لتظهر الأطرزة.</Text>

  const list = BRAND_MODELS[brand] ?? []
  // إن كانت القيمة المحفوظة ليست في قائمة الماركة الجديدة نُبقيها ظاهرة
  const options = value && !list.includes(value) ? [value, ...list] : list

  return (
    <Select
      value={value ?? ''}
      onChange={(e) => {
        const v = e.currentTarget.value
        onChange(v ? set(v) : unset())
      }}
    >
      <option value="">— اختر الطراز —</option>
      {options.map((m) => <option key={m} value={m}>{m}</option>)}
    </Select>
  )
}
