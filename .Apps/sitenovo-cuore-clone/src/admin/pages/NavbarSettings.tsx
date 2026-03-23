import { useAdminSettings } from '../useAdminSettings';
import { FormPage, Field, ImageField, Feedback } from '../components/FormComponents';

const KEYS = ['navbar.brand', 'navbar.logo_image'];

export default function NavbarSettings() {
  const { values, set, loading, saving, save, feedback } = useAdminSettings(KEYS);

  if (loading) return <div className="p-8 text-text-secondary">Carregando...</div>;

  return (
    <FormPage title="Navbar" desc="Configure a logo e o nome da marca exibidos no topo do site." onSave={save} saving={saving}>
      <Feedback feedback={feedback} />
      <ImageField label="Logo (imagem)" value={values['navbar.logo_image']} onChange={v => set('navbar.logo_image', v)} />
      <Field label="Nome da marca (fallback sem logo)" value={values['navbar.brand']} onChange={v => set('navbar.brand', v)} />
    </FormPage>
  );
}
