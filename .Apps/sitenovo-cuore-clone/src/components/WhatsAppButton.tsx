import { MessageCircle } from 'lucide-react';

interface Props {
  url: string;
}

export function WhatsAppButton({ url }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20b858] transition-all hover:scale-110"
      title="Falar no WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
