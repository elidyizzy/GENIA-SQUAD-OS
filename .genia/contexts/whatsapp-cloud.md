# Contexto: WhatsApp Cloud API

> Base de conhecimento para integracao com WhatsApp Cloud API (Meta).

## Configuracao

### Credenciais
```
Base URL: https://graph.facebook.com/v21.0
Phone Number ID: [ver .env - WA_PHONE_NUMBER_ID]
Access Token: [ver .env - WA_ACCESS_TOKEN]
Verify Token: [ver .env - WA_VERIFY_TOKEN]
```

## Enviar Mensagens

### Mensagem de Texto
```python
import requests

url = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}",
    "Content-Type": "application/json"
}
data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "text",
    "text": {
        "preview_url": False,
        "body": "Mensagem aqui"
    }
}
response = requests.post(url, headers=headers, json=data)
```

### Template
```python
data = {
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "template",
    "template": {
        "name": "nome_template",
        "language": {"code": "pt_BR"},
        "components": [
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": "valor1"},
                    {"type": "text", "text": "valor2"}
                ]
            }
        ]
    }
}
```

### Imagem
```python
data = {
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "image",
    "image": {
        "link": "https://url-da-imagem.jpg"
    }
}
```

### Documento
```python
data = {
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "document",
    "document": {
        "link": "https://url-do-documento.pdf",
        "filename": "arquivo.pdf"
    }
}
```

### Botoes Interativos
```python
data = {
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {"text": "Escolha uma opcao:"},
        "action": {
            "buttons": [
                {"type": "reply", "reply": {"id": "btn1", "title": "Opcao 1"}},
                {"type": "reply", "reply": {"id": "btn2", "title": "Opcao 2"}}
            ]
        }
    }
}
```

## Webhook

### Verificacao
```python
@app.get("/webhook")
def verify_webhook(hub_mode: str, hub_verify_token: str, hub_challenge: str):
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return int(hub_challenge)
    return {"error": "Invalid token"}, 403
```

### Receber Mensagens
```python
@app.post("/webhook")
def receive_message(payload: dict):
    entry = payload.get("entry", [{}])[0]
    changes = entry.get("changes", [{}])[0]
    value = changes.get("value", {})

    messages = value.get("messages", [])
    for msg in messages:
        from_number = msg.get("from")
        msg_type = msg.get("type")

        if msg_type == "text":
            text = msg.get("text", {}).get("body")
        elif msg_type == "interactive":
            button_reply = msg.get("interactive", {}).get("button_reply", {})
            button_id = button_reply.get("id")

    return {"status": "ok"}
```

## Status de Mensagem

### Marcar como Lida
```python
data = {
    "messaging_product": "whatsapp",
    "status": "read",
    "message_id": "wamid.xxx"
}
requests.post(url, headers=headers, json=data)
```

## Gotchas
1. Telefone com codigo do pais (5511...)
2. Templates precisam ser aprovados
3. Janela de 24h para mensagens normais
4. Fora da janela, so templates
5. Media precisa ser URL publica ou upload

## Rate Limits
- 80 mensagens/segundo (Business)
- 1000 mensagens/dia (free tier)

## Templates

### Criar Template
Via Business Manager ou API

### Estrutura
```
Header (opcional): texto, imagem, documento, video
Body (obrigatorio): texto com {{1}}, {{2}}...
Footer (opcional): texto
Buttons (opcional): ate 3 botoes
```

---

*Contexto carregado automaticamente quando detectado uso de WhatsApp.*
