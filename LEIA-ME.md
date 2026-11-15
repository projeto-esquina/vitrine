# Vitrine · publicar com IA de verdade

```
vitrine-site/
├── index.html            ← o protótipo (o mesmo de sempre)
├── api/gerar-pagina.js   ← servidor que manda as fotos ao Claude Sonnet
└── vercel.json           ← dá até 60 s para a IA responder
```

O site chama `/api/gerar-pagina`. Essa rota guarda a chave da Anthropic e devolve a página em JSON.
Sem a rota (aberto do computador ou em hospedagem só de arquivos), o site cai no modo demonstração sozinho.

## Publicar na Vercel (grátis)

1. Suba esta pasta para um repositório no GitHub (os dois arquivos, mantendo a pasta `api`).
2. Em vercel.com → **Add New → Project**, importe o repositório.
   Framework Preset: **Other**. Não precisa de comando de build.
3. Antes de clicar em Deploy, abra **Environment Variables** e crie:
   - `ANTHROPIC_API_KEY` = a chave gerada em platform.claude.com (API Keys)
4. Deploy. O site fica em `https://<nome>.vercel.app`.

Se mudar a chave depois, faça **Redeploy** para ela valer.

## Antes de divulgar o link

- Defina um **teto de gasto** no console da Anthropic (Settings → Limits). Cada página custa ~US$ 0,02.
- A rota aceita até 3 fotos, frase de até 500 caracteres e ~15 pedidos por pessoa a cada 10 minutos.
- A IA também faz uma moderação simples: foto ou frase imprópria volta com aviso e não vira página.
- Os erros aparecem na Vercel em **Project → Logs**.

## Trocar o modelo

Crie a variável `VITRINE_MODELO` (por exemplo `claude-haiku-5-5`, mais barato) e faça Redeploy.
