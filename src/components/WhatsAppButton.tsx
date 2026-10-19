import { whatsappLink } from '@/lib/format'

// زر واتساب: يفتح محادثة برسالة جاهزة
export default function WhatsAppButton({ message, label = 'تواصل عبر واتساب' }: { message: string; label?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded bg-petrol px-5 py-3 text-center font-bold text-white hover:bg-petrolDark"
    >
      {label}
    </a>
  )
}
