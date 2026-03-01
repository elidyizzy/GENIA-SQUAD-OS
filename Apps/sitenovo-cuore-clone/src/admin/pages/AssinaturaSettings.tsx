import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, TextareaField, ImageField, Feedback, SectionDivider } from '../components/FormComponents';

const KEYS = [
  'assinatura.title', 'assinatura.description',
  'assinatura.step1_title', 'assinatura.step1_desc',
  'assinatura.step2_title', 'assinatura.step2_desc',
  'assinatura.step3_title', 'assinatura.step3_desc',
  'assinatura.quote', 'assinatura.cta_text', 'assinatura.box_image',
];

export default function AssinaturaSettings() {
  const { values, set, loading, saving, save, feedback } = useAdminSettings(KEYS);

  if (loading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <FormPage title="Seção Assinatura" desc="Edite a seção 'Conversar para Cuidar' e a box de assinatura." onSave={save} saving={saving}>
      <Feedback feedback={feedback} />
      <Field label="Título da seção" value={values['assinatura.title']} onChange={v => set('assinatura.title', v)} />
      <TextareaField label="Descrição da seção" value={values['assinatura.description']} onChange={v => set('assinatura.description', v)} />
      <SectionDivider label="Passo 1" />
      <Field label="Título" value={values['assinatura.step1_title']} onChange={v => set('assinatura.step1_title', v)} />
      <TextareaField label="Descrição" value={values['assinatura.step1_desc']} onChange={v => set('assinatura.step1_desc', v)} />
      <SectionDivider label="Passo 2" />
      <Field label="Título" value={values['assinatura.step2_title']} onChange={v => set('assinatura.step2_title', v)} />
      <TextareaField label="Descrição" value={values['assinatura.step2_desc']} onChange={v => set('assinatura.step2_desc', v)} />
      <SectionDivider label="Passo 3" />
      <Field label="Título" value={values['assinatura.step3_title']} onChange={v => set('assinatura.step3_title', v)} />
      <TextareaField label="Descrição" value={values['assinatura.step3_desc']} onChange={v => set('assinatura.step3_desc', v)} />
      <SectionDivider label="Box de Assinatura" />
      <TextareaField label="Frase em destaque (aspas)" value={values['assinatura.quote']} onChange={v => set('assinatura.quote', v)} rows={4} />
      <Field label="Texto do botão CTA" value={values['assinatura.cta_text']} onChange={v => set('assinatura.cta_text', v)} />
      <ImageField label="Imagem da box" value={values['assinatura.box_image']} onChange={v => set('assinatura.box_image', v)} />
    </FormPage>
  );
}
