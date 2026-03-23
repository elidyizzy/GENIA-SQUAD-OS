import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, TextareaField, Feedback, SectionDivider } from '../components/FormComponents';

const KEYS = [
  'footer.description', 'footer.copyright',
  'social.instagram_url', 'social.tiktok_url',
  'social.whatsapp_number', 'social.whatsapp_message',
];

export default function FooterSettings() {
  const { values, set, loading, saving, save, feedback } = useAdminSettings(KEYS);

  if (loading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <FormPage title="Rodapé & Redes Sociais" desc="Configure os textos do rodapé, links sociais e número do WhatsApp." onSave={save} saving={saving}>
      <Feedback feedback={feedback} />
      <SectionDivider label="Rodapé" />
      <TextareaField label="Descrição da marca" value={values['footer.description']} onChange={v => set('footer.description', v)} />
      <Field label="Texto de copyright" value={values['footer.copyright']} onChange={v => set('footer.copyright', v)} />
      <SectionDivider label="WhatsApp" />
      <Field
        label="Número do WhatsApp (só números, com DDI)"
        value={values['social.whatsapp_number']}
        onChange={v => set('social.whatsapp_number', v)}
        placeholder="5511999999999"
        hint="Ex: 5511999999999 (55 = Brasil, 11 = DDD, resto = número)"
      />
      <TextareaField
        label="Mensagem pré-definida do WhatsApp"
        value={values['social.whatsapp_message']}
        onChange={v => set('social.whatsapp_message', v)}
        hint="Esta mensagem aparece quando o cliente clica em qualquer botão de WhatsApp do site"
      />
      <SectionDivider label="Redes Sociais" />
      <Field
        label="Link do Instagram"
        value={values['social.instagram_url']}
        onChange={v => set('social.instagram_url', v)}
        placeholder="https://instagram.com/cuore"
      />
      <Field
        label="Link do TikTok"
        value={values['social.tiktok_url']}
        onChange={v => set('social.tiktok_url', v)}
        placeholder="https://tiktok.com/@cuore"
      />
    </FormPage>
  );
}
