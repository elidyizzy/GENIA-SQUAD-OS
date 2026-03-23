# StreamStudio MVP - Handover Document

## 📌 Status Atual do Projeto
**Projeto:** StreamStudio (Clone Open-Source do StreamYard usando WebRTC Mesh, Canvas e RTMP Relay).
**Stack:** Next.js (Frontend), Tailwind CSS v4, Node.js + Socket.IO + FFmpeg (Backend).
**Design System:** "GEN.IA - Segundo Cérebro" (Temas Graphite e Yolk).

## ✅ O que já está implementado e funcionando:
1. **Infraestrutura WebRTC Mesh:** Conexão par-a-par de vídeo e áudio entre Host e Convidados.
2. **Motor de Composição Visual (Canvas):** O Host renderiza o layout do estúdio em um Canvas HTML5 local (rodando a 30fps), misturando todos os feeds de vídeo.
3. **Gravação Local:** Funcionalidade de download do stream final misturado (Áudio Web Audio API + Vídeo do Canvas) em formato `.webm`.
4. **Transmissão RTMP (Relay):** Envio de WebM via WebSocket para o servidor Node.js, que usa FFmpeg para converter para `.flv` e transmitir para a chave do YouTube.
5. **Compartilhamento de Tela:** API `getDisplayMedia` integrada, permitindo trocar a câmera local pela tela.
6. **Design System Moderno:** UI atualizada para Tailwind v4 usando temas escuros (Graphite) e destaquess em amarelo (Yolk).
7. **Internacionalização:** Toda a interface está em PT-BR.

## 🚧 O que acabou de ser feito (Precisa de Teste/Ajustes amanhã):
Na última sessão, implementamos os seguintes recursos no arquivo principal do estúdio (`StudioRoom.tsx`) e no backend (`server.js`):

1. **Bate-Papo ao Vivo (Live Chat):**
   - **Backend:** Adicionada rota de socket `chat-message` no `server.js` para retransmitir mensagens para a sala.
   - **Frontend:** Painel direito adicionado na interface do Host e Convidados. Lista mensagens em tempo real e faz scroll automático.
2. **Layout Picture-in-Picture (PiP) no Compartilhamento de Tela:**
   - Quando o Host compartilha a tela, o código no `renderLoop` do Canvas foi alterado.
   - A tela compartilhada ocupa o fundo (Full Canvas).
   - A câmera do Host é mantida ativa (escondida no DOM usando a ref `localScreenRef` para a tela, e `localVideoRef` para a câmera) e é desenhada com tamanho reduzido (320x180) no canto inferior direito, com um contorno amarelo (Yolk).
   - *Nota:* Os convidados ainda são ocultados do Canvas durante o compartilhamento de tela neste design atual.

## 🚀 Próximos Passos (Para Amanhã):

1. **Testar Câmera + Tela (PiP):**
   - Suba o frontend (`npm run dev`) e backend (`node server.js`).
   - Múltiplas abas: Entre como Host e como Convidado na mesma sala.
   - Como Host, ligue a câmera e, em seguida, compartilhe a tela. Verifique se o Canvas mostra a tela de fundo e sua câmera no canto inferior.
2. **Testar Chat:**
   - Envie mensagens no chat e garanta que elas estão sendo recebidas por todos na sala usando a conexão Socket.IO.
3. **Refinamento de Layouts Manager (Opcional):**
   - Atualmente, ou a malha divide a tela igualmente, ou ativa o modo PiP. No futuro, pode-se adicionar botões para o Host alternar layouts (Ex: Foco no Orador, Grade, Tela Cheia).

## 💻 Como continuar:
Leia este arquivo e continue desenvolvendo a partir destas anotações. Você pode usar os scripts de verificação (como `lint_runner.py` ou `ux_audit.py`) no seu diretório de agentes para validar o código atual antes de fazer grandes mudanças amanhã.
