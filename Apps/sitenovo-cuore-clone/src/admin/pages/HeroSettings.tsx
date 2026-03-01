import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, ImageField, Feedback } from '../components/FormComponents';

const KEYS = ['banner.text', 'hero.subtitle', 'hero.title', 'hero.tagline', 'hero.cta_text', 'hero.bg_image'];

export default function HeroSettings() {
  const { values, set, loading, saving, save, feedback } = useAdminSettings(KEYS);

  if (loading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <FormPage title="Banner Hero" desc="Edite o banner principal do site." onSave={save} saving={saving}>
      <Feedback feedback={feedback} />
      <Field label="Aviso do topo (barra verde)" value={values['banner.text']} onChange={v => set('banner.text', v)} />
      <Field label="Subtítulo (acima do título principal)" value={values['hero.subtitle']} onChange={v => set('hero.subtitle', v)} />
      <Field label="Título principal" value={values['hero.title']} onChange={v => set('hero.title', v)} />
      <Field label="Tagline (frase abaixo do título)" value={values['hero.tagline']} onChange={v => set('hero.tagline', v)} />
      <Field label="Texto do botão" value={values['hero.cta_text']} onChange={v => set('hero.cta_text', v)} />
      <ImageField label="Imagem de fundo do banner" value={values['hero.bg_image']} onChange={v => set('hero.bg_image', v)} />
    </FormPage>
  );
}
