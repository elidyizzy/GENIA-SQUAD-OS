import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, ImageField, Feedback, SectionDivider } from '../components/FormComponents';

const KEYS = [
  'produto1.title', 'produto1.subtitle', 'produto1.image',
  'produto2.title', 'produto2.subtitle', 'produto2.image',
  'produto3.title', 'produto3.subtitle', 'produto3.image',
];

export default function ProductsSettings() {
  const { values, set, loading, saving, save, feedback } = useAdminSettings(KEYS);

  if (loading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <FormPage title="Produtos" desc="Edite as 3 categorias de produtos exibidas na grade." onSave={save} saving={saving}>
      <Feedback feedback={feedback} />
      <SectionDivider label="Produto 1" />
      <Field label="Título" value={values['produto1.title']} onChange={v => set('produto1.title', v)} />
      <Field label="Subtítulo" value={values['produto1.subtitle']} onChange={v => set('produto1.subtitle', v)} />
      <ImageField label="Imagem" value={values['produto1.image']} onChange={v => set('produto1.image', v)} />
      <SectionDivider label="Produto 2" />
      <Field label="Título" value={values['produto2.title']} onChange={v => set('produto2.title', v)} />
      <Field label="Subtítulo" value={values['produto2.subtitle']} onChange={v => set('produto2.subtitle', v)} />
      <ImageField label="Imagem" value={values['produto2.image']} onChange={v => set('produto2.image', v)} />
      <SectionDivider label="Produto 3" />
      <Field label="Título" value={values['produto3.title']} onChange={v => set('produto3.title', v)} />
      <Field label="Subtítulo" value={values['produto3.subtitle']} onChange={v => set('produto3.subtitle', v)} />
      <ImageField label="Imagem" value={values['produto3.image']} onChange={v => set('produto3.image', v)} />
    </FormPage>
  );
}
