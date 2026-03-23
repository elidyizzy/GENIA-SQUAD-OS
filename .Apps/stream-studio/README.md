# StreamStudio

> Um estúdio de transmissão ao vivo de vídeo totalmente de código aberto e com zero custo (composição feita no cliente), construído com Next.js, WebRTC e FFmpeg.

O StreamStudio é basicamente um equivalente ao StreamYard, mas com um diferencial incrível: **toda a mixagem, composição e layout de vídeo acontecem direto no navegador do Anfitrião (Host)** através de um elemento HTML5 `<canvas>`. Isso elimina totalmente a necessidade de servidores na nuvem caros (SFUs/MCUs) para renderizar a sua cena.

Você pode convidar até 5 participantes via WebRTC Mesh (conexão peer-to-peer direta), organizá-los no seu Canvas local e, em seguida, transmitir o fluxo final mixado em 1920x1080 diretamente para o YouTube, Twitch ou salvá-lo localmente no seu pc.

---

## 🚀 Guia de Início Rápido

### 1. Requisitos
* Node.js (v18+)
* [FFmpeg](https://ffmpeg.org/download.html) instalado no seu sistema e disponível nas variáveis de ambiente (PATH).

### 2. Configuração do Backend (Servidor de Sinalização e Relay RTMP)
```bash
cd backend
npm install
npm start
```
*O backend roda em `http://localhost:3001`.*

### 3. Configuração do Frontend (O Estúdio)
```bash
cd frontend
npm install
npm run dev
```
*O frontend roda em `http://localhost:3000`.*

### 4. Ficando Ao Vivo (Exemplo com YouTube)
1. Abra o arquivo `.env` dentro da pasta `backend/`.
2. Adicione a sua Chave de Transmissão do YouTube: `YT_STREAM_KEY=xxxx-xxxx-xxxx-xxxx-xxxx`
3. Clique em "Transmitir para o YouTube" dentro do painel do Host.

---

## ✨ Funcionalidades

- **Composição Descentralizada:** A renderização do vídeo acontece usando `requestAnimationFrame` na máquina do Host. Zero custos de renderização na nuvem.
- **Rede WebRTC Mesh:** Conexões diretas peer-to-peer (ponto a ponto) de baixíssima latência via conexões puras de `RTCPeerConnection` (nenhum serviço de terceiros necessário).
- **Sinalização com Socket.IO:** Troca rápida e confiável de informações (SDPs e ICE Candidates) para conectar os navegadores.
- **Compartilhamento de Tela:** Hosts e Convidados podem trocar o vídeo da câmera pelas suas telas ou janelas de aplicativos instantaneamente.
- **Gravação Local (Sem complicação):** Grava a imagem composta do Canvas junto com todos os áudios mixados direto na memória do seu navegador como um arquivo `.webm`, que é baixado automaticamente (MP4 suportado por players modernos).
- **Relay RTMP (Pronto para o YouTube):** Transmite o vídeo final diretamente em pedaços usando um WebSocket leve para o backend, que usa o FFmpeg para converter de forma eficiente para H.264/AAC e envia para os servidores do YouTube.

---

## 🏗️ Arquitetura

1. **Frontend (`Next.js / React / Tailwind`)**
   - A tela inicial pergunta o "Nome da Sala" e se você é o "Anfitrião" ou "Convidado".
   - O `<StudioRoom>` utiliza o hook `useWebRTC`.
   - O WebRTC cria conexões diretas enviando o vídeo/áudio de cada participante direto para o computador do Anfitrião.
   - O Anfitrião desenha/pinta todos os vídeos de forma organizada numa tela única (`<canvas>`) tamanho 1920x1080.
2. **Backend (`Node.js / Express / Socket.io / ws`)**
   - Funciona como um simples ponto de encontro (Signaling Server com Socket.io) apenas para que os navegadores (peers) através do WebRTC se achem pela internet.
   - Mantém um WebSocket cru (`/rtmp`) para receber as partes gravadas de vídeo.
   - Envia tudo para o `fluent-ffmpeg`, que empurra esse vídeo usando o protocolo universal RTMP para servidores como a Twitch ou YouTube.

---

## ⚙️ Configurações

Configurações do backend no arquivo `.env` dentro da pasta `backend/`:

| Variável      | Descrição                                            | Padrão |
| ------------- | ---------------------------------------------------- | ------ |
| PORT          | Porta do servidor Backend e de Sinalização           | 3001   |
| YT_STREAM_KEY | Sua chave segura e privada de transmissão do YouTube | -      |

---

## 🎓 Próximos Passos & Planejamento

* **Upload para Google Drive:** Permitir que usuários autorizem com o Google (OAuth2) para salvar o vídeo final diretamente em uma pasta do Drive, poupando espaço no disco.
* **Gerenciamento de Layouts:** Botões para o Host trocar as posições no Canvas, alternando entre "Grade" (Grid), "Picture-in-Picture" e modos de foque de Orador.
* **Overlays e Gráficos:** Permitir que imagens PNG (logos/marcas) ou textos letreiros sejam adicionados por cima do Canvas.
* **Integração com Servidores TURN:** Em cenários onde clientes sofrem de redes corporativas ou Firewalls rígidos, a instalação será aprimorada ligando um servidor STUN/TURN como o `coturn` na nuvem para não deixar a chamada cair.

---

## 📄 Licença

**MIT License**

Nós aplicamos rigorosamente licenças MIT (ou extremamente permissivas) em absolutamente cada linha de código ou infraestrutura sugerida neste projeto. Ele foi criado sob demanda por inteligência artificial, você pode usá-lo livremente inclusive no trábito/âmbito corporativo ou para produtos proprietários!
