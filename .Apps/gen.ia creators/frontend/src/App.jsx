import { useMemo, useState } from 'react'
import {
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Palette,
  ArrowRight,
  Settings,
  LayoutDashboard,
  History,
  Copy as CopyIcon,
  Wand2,
  RefreshCcw
} from 'lucide-react'
import {
  uploadReference,
  generateCopy,
  approveCopy,
  generateImages,
  generateAiImage
} from './api/client'

const steps = [
  { id: 1, title: 'Upload', desc: 'Referência visual' },
  { id: 2, title: 'Briefing', desc: 'Estratégia e copy' },
  { id: 3, title: 'Copy', desc: 'Revisão e aprovação' },
  { id: 4, title: 'Imagens', desc: 'Geração final' },
]

const defaultStyle = {
  primary: '#0d0d0f',
  secondary: '#131316',
  accent: '#d4a012',
  background: '#1a1a1f',
  text: '#ffffff',
  use_gradient: true,
  include_grid: false,
  include_logo: true,
  custom_backgrounds: {}
}

const defaultBriefing = {
  theme: '',
  hook: '',
  tone: 'Provocativo',
  slide_count: 8,
  narrative_structure: 'Hook → Problema → Solução → Prova → CTA',
  handle: '@genia_creators',
  name: '',
  title: '',
  tagline: '',
  header_left: 'Powered by GEN.IA',
  user_images: [],
  extra_instructions: ''
}

function PaletteSwatch({ colors = [] }) {
  if (!colors.length) return null
  return (
    <div className="flex gap-2">
      {colors.slice(0, 5).map((color, i) => (
        <div 
          key={i} 
          className="h-8 w-8 rounded-full border border-white/10 shadow-sm" 
          style={{ backgroundColor: color }} 
          title={color} 
        />
      ))}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(1)
  const [referenceFiles, setReferenceFiles] = useState([])
  const [insights, setInsights] = useState(null)
  const [briefing, setBriefing] = useState(defaultBriefing)
  const [copy, setCopy] = useState(null)
  const [images, setImages] = useState([])
  const [zipUrl, setZipUrl] = useState('')
  const [style, setStyle] = useState(defaultStyle)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // State handles AI Image Generation Loaders
  const [generatingBg, setGeneratingBg] = useState({})

  const handleAnalyze = async () => {
    if (!referenceFiles.length) {
      setError('Selecione pelo menos uma imagem para referência.')
      return
    }
    setLoading(true)
    setError('')
    setMessage('Analisando estilo com Claude Vision...')
    try {
      const data = await uploadReference(referenceFiles)
      setInsights(data)
      // Pré-preenche estilo com paleta detectada
      if (data.palette && data.palette.length >= 4) {
        setStyle(prev => ({
          ...prev,
          primary: data.palette[0],
          secondary: data.palette[1],
          accent: data.palette[2] || prev.accent,
          background: data.palette[3] || prev.background,
        }))
      }
      setStep(2)
      setMessage('Análise concluída. Preencha o briefing da marca.')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erro ao analisar referência')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCopy = async () => {
    if (!briefing.theme || !briefing.hook || !briefing.handle) {
       setError('Preencha os campos obrigatórios (Tema, Hook, Handle).')
       return
    }
    setLoading(true)
    setError('')
    setMessage('Gerando copy com estruturação de dados (Claude)...')
    try {
      const payload = { briefing, reference_insights: insights }
      const data = await generateCopy(payload)
      setCopy(data)
      setStep(3)
      setMessage('Copy gerada! Revise, edite e aprove para os slides da Fase 4.')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erro ao gerar copy')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCopy = async () => {
    if (!copy) return
    setLoading(true)
    setError('')
    setMessage('Registrando aprovação...')
    try {
      await approveCopy(copy)
      setStep(4)
      setMessage('Copy aprovada. Configure a estética e gere os slides.')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erro ao aprovar copy')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImages = async () => {
    if (!copy) return
    setLoading(true)
    setError('')
    setMessage('Gerando PNGs com Pillow usando as 10 Regras Visuais...')
    try {
      const payload = { copy, style, reference_insights: insights }
      const data = await generateImages(payload)
      setImages(data.slides || [])
      setZipUrl(data.zip_url || '')
      setMessage('Slides prontos! Faça o download do carrossel finalizado.')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Erro ao gerar imagens')
    } finally {
      setLoading(false)
    }
  }

  const updateCopyText = (idx, field, value) => {
    if (!copy) return
    const updated = {
      ...copy,
      slides: copy.slides.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }
    setCopy(updated)
  }

  const handleGenerateAIBackground = async (idx, prompt) => {
    if (!prompt) {
      setError(`O slide ${idx + 1} não possui um prompt válido na prop notes. Edite as notes ou o AI-prompt e tente de novo.`);
      return;
    }
    setGeneratingBg(prev => ({ ...prev, [idx]: true }))
    try {
      const resp = await generateAiImage(prompt)
      if (resp && resp.base64) {
        setStyle(prev => ({
          ...prev,
          custom_backgrounds: {
            ...prev.custom_backgrounds,
            [idx]: resp.base64
          }
        }))
        setMessage(`Imagem do Slide ${idx + 1} gerada e incluída com sucesso!`)
      }
    } catch(err) {
      setError(`Falha ao gerar IA para o Slide ${idx + 1}`)
    } finally {
      setGeneratingBg(prev => ({ ...prev, [idx]: false }))
    }
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="p-6 border-b border-white/5">
          <div className="badge w-fit mb-2">
             GEN.IA CREATORS
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-white/40 mb-4 uppercase tracking-wider">Fluxo de Criação</p>
          <ul className="space-y-1">
            {steps.map((s) => (
              <li 
                key={s.id} 
                className={`nav-item ${step === s.id ? 'active' : ''}`}
              >
                <div 
                  className={`w-6 h-6 flex items-center justify-center rounded-full border text-[10px] flex-shrink-0
                  ${step === s.id ? 'border-current' : step > s.id ? 'border-emerald-500 text-emerald-500' : 'border-white/20'}`}
                >
                   {step > s.id ? <CheckCircle2 size={12} /> : s.id}
                </div>
                <div>
                  <p className="font-semibold text-sm leading-none">{s.title}</p>
                  <p className="text-xs mt-1 font-normal opacity-70">{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <hr className="divider my-6" />

          <p className="text-xs font-bold text-white/40 mb-4 uppercase tracking-wider">Sistema</p>
          <ul className="space-y-1">
            <li className="nav-item">
               <LayoutDashboard size={16} /> <span className="font-semibold">Dashboard</span>
            </li>
            <li className="nav-item">
               <Settings size={16} /> <span className="font-semibold">Configurações</span>
            </li>
            <li className="nav-item">
               <History size={16} /> <span className="font-semibold">Histórico</span>
            </li>
          </ul>
        </div>
        
        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-2 text-xs font-semibold text-white/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Online
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content p-6 lg:p-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <header className="mb-2">
             <h1 className="text-3xl font-bold tracking-tight text-white">Criador Inteligente <span className="text-white/30 text-2xl font-normal ml-2">(Fase {step} de 4)</span></h1>
             <p className="text-white/50 mt-2">Siga o funil guiado. Os próximos passos dependem da aprovação da fase atual.</p>
          </header>

          {error && <div className="alert-error animate-fade-in">{error}</div>}
          {message && <div className="alert-info animate-fade-in">{message}</div>}

          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
              
              {/* FASE 1: UPLOAD */}
              {step === 1 && (
                <div className="card animate-fade-in">
                   <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><UploadCloud size={20} className="text-[var(--gema)]" /> Referência Visual</h2>
                   <p className="text-sm text-white/50 mb-8">Envie as imagens de um carrossel que você quer usar como inspiração estrutural e visual.</p>
                   
                   <label htmlFor="file" className="upload-zone">
                      <div className="rounded-full bg-white/5 text-white p-4 shadow-lg mb-2">
                        <UploadCloud size={32} className="opacity-80" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">Arraste ou selecione imagens</p>
                        <p className="text-sm text-white/40 mt-1">Formatos: PNG, JPG (ideal de 1 a 10 telas)</p>
                      </div>
                      <input
                        id="file" type="file" accept="image/*" multiple className="hidden"
                        onChange={(e) => setReferenceFiles(Array.from(e.target.files || []))}
                      />
                      {referenceFiles.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                           {referenceFiles.map((f, i) => (
                             <div key={i} className="badge-neutral">
                               {f.name}
                             </div>
                           ))}
                        </div>
                      )}
                   </label>

                   <div className="mt-8 flex justify-end">
                      <button className="btn-primary" onClick={handleAnalyze} disabled={loading || referenceFiles.length === 0}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        Analisar Referência →
                      </button>
                   </div>
                </div>
              )}

              {/* FASE 2: BRIEFING */}
              {step === 2 && (
                <div className="card animate-fade-in space-y-8">
                   <div>
                      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-[var(--gema)]" /> 
                        Estratégia e Copy
                      </h2>
                      <p className="text-sm text-white/50">Forneça as diretrizes para a IA redigir o post guiado na estrutura aprovada.</p>
                   </div>

                   {/* Bloco 1: Sobre */}
                   <div className="space-y-4">
                      <h3 className="font-semibold text-white/80 border-b border-white/10 pb-2">1. Sobre o Conteúdo</h3>
                      <div>
                         <label className="mb-1 block">Sobre o que é o carrossel?</label>
                         <textarea className="input min-h-[80px]" value={briefing.theme} onChange={e => setBriefing({...briefing, theme: e.target.value})} placeholder="Ex: O problema das agências tradicionais..." />
                      </div>
                      <div>
                         <label className="mb-1 block">Mensagem central / Hook <span className="text-[10px] font-normal opacity-60 ml-2">(A frase que para o scroll)</span></label>
                         <textarea className="input min-h-[60px]" value={briefing.hook} onChange={e => setBriefing({...briefing, hook: e.target.value})} placeholder="Ex: Pare de depender de indicações. Sistema previsível de vendas." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="mb-1 block">Tom</label>
                           <select className="input" value={briefing.tone} onChange={e => setBriefing({...briefing, tone: e.target.value})}>
                              <option>Provocativo</option>
                              <option>Educativo</option>
                              <option>Inspiracional</option>
                              <option>Técnico</option>
                              <option>Story</option>
                           </select>
                         </div>
                         <div>
                           <label className="mb-1 block">Qtd Slides</label>
                           <input type="number" min={4} max={12} className="input" value={briefing.slide_count} onChange={e => setBriefing({...briefing, slide_count: parseInt(e.target.value)})} />
                         </div>
                      </div>
                   </div>

                   {/* Bloco 2: Estrutura */}
                   <div className="space-y-4">
                      <h3 className="font-semibold text-white/80 border-b border-white/10 pb-2">2. Estrutura Narrativa</h3>
                      <select className="input block w-full" value={briefing.narrative_structure} onChange={e => setBriefing({...briefing, narrative_structure: e.target.value})}>
                         <option>Hook → Problema → Solução → Prova → CTA (Padrão)</option>
                         <option>Hook → História → Virada → Lição → CTA</option>
                         <option>Hook → Lista → Desenvolvimento → CTA</option>
                      </select>
                   </div>

                   {/* Bloco 3: Branding */}
                   <div className="space-y-4">
                      <h3 className="font-semibold text-white/80 border-b border-white/10 pb-2">3. Branding</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="mb-1 block">Handle Instagram</label>
                           <input type="text" className="input" value={briefing.handle} onChange={e => setBriefing({...briefing, handle: e.target.value})} placeholder="@genia_creators" />
                         </div>
                         <div>
                           <label className="mb-1 block">Header Esquerdo</label>
                           <input type="text" className="input" value={briefing.header_left} onChange={e => setBriefing({...briefing, header_left: e.target.value})} />
                         </div>
                         <div>
                           <label className="mb-1 block">Nome Completo (Opc.)</label>
                           <input type="text" className="input" value={briefing.name} onChange={e => setBriefing({...briefing, name: e.target.value})} />
                         </div>
                         <div>
                           <label className="mb-1 block">Tagline (Opc.)</label>
                           <input type="text" className="input" value={briefing.tagline} onChange={e => setBriefing({...briefing, tagline: e.target.value})} />
                         </div>
                      </div>
                   </div>

                   <hr className="divider" />

                   <div className="flex justify-end pt-2">
                      <button className="btn-primary" onClick={handleGenerateCopy} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                        Gerar Copy Completa →
                      </button>
                   </div>
                </div>
              )}

              {/* FASE 3: COPY */}
              {step === 3 && copy && (
                <div className="animate-fade-in space-y-6">
                   {copy.slides.map((slide, idx) => (
                      <div key={idx} className="card relative transition-all hover:border-[rgba(255,255,255,0.1)]">
                         <div className="absolute top-6 right-6">
                            <span className="badge-neutral border-0 bg-white/5">
                               {slide.background_type.toUpperCase()}
                            </span>
                         </div>
                         <h3 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                           <span className="text-[var(--gema)] opacity-50">#</span>
                           Slide {slide.slide_number}
                         </h3>
                         
                         <div className="space-y-5">
                           <div>
                              <label className="mb-2 block text-[10px]">Headline</label>
                              <input type="text" className="input text-lg font-bold" value={slide.headline} onChange={e => updateCopyText(idx, 'headline', e.target.value)} />
                              <div className="flex items-center gap-3 mt-3 px-1">
                                 <input type="text" className="input flex-1 py-2 text-sm bg-black/20 border-white/5 focus:border-[var(--gema)]" placeholder="Palavra p/ destaque numérico/cor..." value={slide.highlight_word || ''} onChange={e => updateCopyText(idx, 'highlight_word', e.target.value)} />
                                 <span className="text-xs text-white/30 truncate w-48">→ Será pintada com a Cor Accent</span>
                              </div>
                           </div>
                           
                           <div>
                              <label className="mb-2 block text-[10px]">Body (Corpo do Slide)</label>
                              <textarea className="input min-h-[100px] leading-relaxed" value={slide.body} onChange={e => updateCopyText(idx, 'body', e.target.value)} />
                           </div>

                           <div className="grid grid-cols-2 gap-5 mt-2">
                              <div>
                                 <label className="mb-2 block text-[10px]">Frase de Destaque (Sublinhada)</label>
                                 <input type="text" className="input text-sm" value={slide.highlight_phrase || ''} onChange={e => updateCopyText(idx, 'highlight_phrase', e.target.value)} placeholder="Frase importante para sublinhar..." />
                              </div>
                              <div>
                                 <label className="mb-2 block text-[10px]">Label de Imagem (Reference)</label>
                                 <input type="text" className="input text-sm" value={slide.image_ref || ''} onChange={e => updateCopyText(idx, 'image_ref', e.target.value)} placeholder="Ex: foto_autor.jpg" />
                              </div>
                              <div className="col-span-2">
                                 <label className="mb-2 block text-[10px]">Footer Block (Zero Espaço Morto)</label>
                                 <input type="text" className="input text-sm bg-black/20" value={slide.footer_block || ''} onChange={e => updateCopyText(idx, 'footer_block', e.target.value)} placeholder="Usado caso sobre espaço vertical no slide..." />
                              </div>
                              <div className="col-span-2">
                                 <label className="mb-2 block text-[10px] text-[var(--gema)] flex items-center gap-1.5"><Sparkles size={12}/> Prompt de IA / Notes Visuais (Imagen 3)</label>
                                 <textarea className="input text-sm bg-[rgba(212,160,18,0.05)] border-[rgba(212,160,18,0.2)] focus:border-[var(--gema)]" value={slide.notes || ''} onChange={e => updateCopyText(idx, 'notes', e.target.value)} placeholder="Prompt para gerar a imagem..." />
                              </div>
                           </div>
                         </div>
                      </div>
                   ))}

                   <div className="card border border-white/10 bg-black/40 mb-6">
                      <label className="mb-2 block text-sm font-semibold text-[var(--gema)] flex flex-row items-center gap-2"><Sparkles size={16}/> Opcional: Ajuste Fino com IA</label>
                      <p className="text-xs text-white/50 mb-4">Caso a copy não tenha ficado ideal, descreva as mudanças abaixo e peça para o Claude reescrever a copy (ex: "Cortar as gírias e deixar mais sério").</p>
                      <div className="flex items-start gap-4">
                         <textarea className="input flex-1 min-h-[60px]" placeholder="Sua instrução de melhoria..." value={briefing.extra_instructions || ''} onChange={e => setBriefing({...briefing, extra_instructions: e.target.value})} />
                         <button className="btn-ghost flex flex-col items-center justify-center p-4 border border-white/10 bg-white/5 hover:border-[var(--gema)] text-white/80 hover:text-[var(--gema)] transition disabled:opacity-50 min-h-[60px]" onClick={handleGenerateCopy} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mb-1" size={18} /> : <RefreshCcw className="mb-1" size={18} />}
                            <span className="text-xs font-semibold whitespace-nowrap">Refazer Copy</span>
                         </button>
                      </div>
                   </div>

                   <div className="card border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-emerald-400 text-lg">Tudo revisado?</p>
                        <p className="text-sm text-white/50 mt-1">Ao aprovar, você avança para a formatação final do Motor Pillow.</p>
                      </div>
                      <button className="btn-primary" onClick={handleApproveCopy} disabled={loading} style={{ background: '#10b981', color: '#111827', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)' }}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        Aprovar Copy →
                      </button>
                   </div>
                </div>
              )}

              {/* FASE 4: IMAGENS */}
              {step === 4 && copy && (
                <div className="animate-fade-in space-y-6">
                   {/* Controles de Estética Finais */}
                   <div className="card">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Palette size={20} className="text-[var(--gema)]" />
                        Geração Final Visual
                      </h2>
                      <div className="grid grid-cols-3 gap-8 mb-8">
                         <div>
                            <label className="mb-3 block">Paleta Extraída/Aplicada</label>
                            <div className="grid grid-cols-5 gap-3">
                               {['primary', 'secondary', 'accent', 'background', 'text'].map(c => (
                                  <div key={c} className="flex flex-col items-center">
                                    <input type="color" className="border-0 p-0" value={style[c]} onChange={e => setStyle({...style, [c]: e.target.value})} />
                                    <span className="text-[10px] mt-2 text-white/40 uppercase font-semibold">{c}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                         <div className="col-span-2 flex items-center gap-6 border-l border-white/10 pl-8">
                            <label className="flex items-center gap-3 text-sm font-semibold text-white/80 cursor-pointer">
                              <input type="checkbox" checked={style.use_gradient} onChange={e => setStyle({...style, use_gradient: e.target.checked})} /> 
                              Overlay Gradiente
                            </label>
                            <label className="flex items-center gap-3 text-sm font-semibold text-white/80 cursor-pointer">
                              <input type="checkbox" checked={style.include_logo} onChange={e => setStyle({...style, include_logo: e.target.checked})} /> 
                              Header Customizado
                            </label>
                         </div>
                      </div>
                      
                      {/* Botões Mágicos de IA Direta no Slide */}
                      <hr className="divider my-6" />
                      
                      <div>
                          <h3 className="font-bold mb-2 flex items-center gap-2 text-lg">
                            <Sparkles className="text-emerald-400" size={18}/> 
                            Substituição de Fundo (Imagen 3)
                          </h3>
                          <p className="text-sm text-white/50 mb-6">Injete I.A nas telas que necessitam de uma imagem visual no pano de fundo antes de finalizar a formatação Pillow.</p>
                          
                          <div className="space-y-2">
                             {copy.slides.map((slide, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                  <div className="flex items-center gap-4 w-2/3">
                                     <span className="badge">Slide {i+1}</span>
                                     <span className="text-xs text-white/50 truncate pr-4">{slide.notes ? slide.notes : 'Sem recomendação visual da IA...'}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {style.custom_backgrounds[i] && <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: '#34d399' }}><CheckCircle2 size={12}/> Gerado</span>}
                                    <button 
                                        className="btn-ghost"
                                        style={slide.notes ? {} : { opacity: 0.3, pointerEvents: 'none' }}
                                        disabled={!slide.notes || generatingBg[i]}
                                        onClick={() => handleGenerateAIBackground(i, slide.notes)}
                                      >
                                      {generatingBg[i] ? <Loader2 size={14} className="animate-spin text-emerald-400" /> : <Wand2 size={14} className="text-emerald-400" />}
                                      <span className="text-xs">{generatingBg[i] ? 'Processando (10s)' : 'Gerar Imagem AI'}</span>
                                    </button>
                                  </div>
                               </div>
                             ))}
                          </div>
                      </div>

                   </div>

                   <div className="flex justify-end pt-4">
                      <button className="btn-primary px-8 py-4 text-lg shadow-2xl pulse-gema" onClick={handleGenerateImages} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                        GERAR O CARROSSEL (PILLOW)
                      </button>
                   </div>

                   {/* Resultado! */}
                   {images.length > 0 && (
                    <div className="card mt-10 animate-slide-up border border-[var(--gema)]">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="font-bold text-2xl text-white">Preview dos Slides Formato FInal</h3>
                         {zipUrl && (
                          <a className="btn-primary" href={zipUrl} download>
                            <ArrowRight size={18} /> Baixar Pacote (.ZIP)
                          </a>
                        )}
                      </div>
                      <div className="grid md:grid-cols-4 gap-4">
                        {images.map((img) => (
                          <div key={img.filename} className="relative group rounded-xl overflow-hidden border border-white/10">
                            <img src={img.url} alt={img.filename} className="w-full object-cover aspect-[4/5] opacity-90 transition group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                               <a href={img.url} download className="btn-ghost border-white/50 text-white hover:border-white hover:bg-white/10">Baixar PNG</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Context Sidebar (Right) */}
            <aside className="lg:col-span-1">
               <div className="card sticky top-10 space-y-8">
                  <div>
                     <label className="mb-3 block text-[10px]">Situação do Projeto</label>
                     <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white font-semibold flex items-center gap-3">
                       <span className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-[var(--gema)] animate-pulse' : 'bg-emerald-500'}`} />
                       {loading ? 'Sincronizando I.A...' : step === 4 ? 'Aguardando Geração' : `Fase ${step} ativa`}
                     </div>
                  </div>

                  {insights && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <div>
                          <label className="mb-2 block text-[10px] text-[var(--gema)]">Insights Visuais (Claude)</label>
                          <p className="text-white/80 text-sm leading-relaxed">{insights.summary}</p>
                      </div>
                      <div>
                          <label className="mb-2 block text-[10px]">Paleta de Referência Extraída</label>
                          <PaletteSwatch colors={insights.palette} />
                      </div>
                      {(insights.typography && insights.typography.length > 0) && (
                        <div>
                          <label className="mb-1 block text-[10px]">Famílias Tipográficas</label>
                          <p className="text-sm font-semibold text-white/90">{insights.typography.join(', ')}</p>
                        </div>
                      )}
                      {insights.layout_notes && (
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                          <label className="mb-2 block text-[10px]">Regras Extras da IAM</label>
                          <p className="text-xs text-white/70 leading-relaxed">{insights.layout_notes}</p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
