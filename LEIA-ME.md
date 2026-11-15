# Vitrine · publicar na Vercel

```
vitrine-site/
├── index.html             ← o site
├── vercel.json            ← dá até 60 s para a IA responder
├── supabase.sql           ← cria o banco no Supabase (colar uma vez no SQL Editor)
└── api/
    ├── gerar-pagina.js    ← manda as fotos ao Claude Sonnet (usa ANTHROPIC_API_KEY)
    ├── publicar.js        ← grava a vitrine nova no Supabase
    ├── vitrines.js        ← devolve as vitrines publicadas para o mapa e o telão
    ├── apagar.js          ← tira uma vitrine do mapa (moderação, com senha)
    └── _supabase.js       ← peças comuns (não vira endereço)
```

Sem as variáveis do Supabase, o site continua funcionando como antes: cada vitrine fica só no celular de quem criou.
Com elas, toda vitrine publicada aparece no mapa e no telão de todo mundo em até 10 segundos.

## Variáveis na Vercel (Settings → Environment Variables)

| Nome | Valor | Para quê |
|---|---|---|
| `ANTHROPIC_API_KEY` | chave `sk-ant-…` (platform.claude.com → API Keys) | IA que lê as fotos |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Endereço do banco |
| `SUPABASE_SECRET_KEY` | chave secreta `sb_secret_…` (ou a antiga `service_role`) | Acesso do servidor ao banco |
| `MODERACAO_SENHA` | uma senha do grupo, com 6 caracteres ou mais | Tirar vitrines do mapa pelo telão |

Depois de criar ou mudar variáveis: **Deployments → ⋯ no último → Redeploy**.

Nunca coloque essas chaves no GitHub, no `index.html` ou no grupo do WhatsApp.

## Ligar o Supabase (uma vez)

1. Em supabase.com, entre com o GitHub → **New project** → nome `vitrine`, região **South America (São Paulo)**. Guarde a senha do banco.
2. No projeto, abra **SQL Editor → New query**, cole o conteúdo de `supabase.sql` e clique em **Run**. Deve aparecer "Success".
3. Pegue o endereço e a chave em **Project Settings**:
   - **Project URL** (em *Data API*, ou no botão **Connect**) → vira `SUPABASE_URL`;
   - **Secret key** (em *API Keys*, clique em revelar e copie) → vira `SUPABASE_SECRET_KEY`.
4. Na Vercel, cadastre `SUPABASE_URL`, `SUPABASE_SECRET_KEY` e `MODERACAO_SENHA`, e faça **Redeploy**.

## Testar

1. Abra `https://<seu-site>/api/vitrines` no navegador. Deve aparecer `{"vitrines":[]}`.
   - `{"erro":"Supabase ainda não configurado"}` → faltam variáveis ou o Redeploy.
   - `{"erro":"Não consegui ler o banco"}` → veja **Logs** na Vercel (chave errada ou SQL não rodado).
2. Abra o **Telão** no computador.
3. No celular, crie e publique uma vitrine. Em até 10 segundos ela aparece no telão.
4. No telão, clique em **Moderar vitrines**, digite a senha e teste **Tirar do mapa**.

## Limites e proteções

- IA: até 3 fotos, frase de até 500 caracteres, ~15 pedidos por pessoa a cada 10 minutos.
- Publicar: ~10 vitrines por pessoa a cada 10 minutos; fotos até ~1 MB; textos com tamanho máximo.
- A moderação não apaga do banco: marca a vitrine como `oculta`. Para voltar, mude `oculta` para `false` no **Table Editor** do Supabase.
- O Supabase grátis **pausa após 7 dias sem uso**: abra o site na véspera e no dia da feira.
- Defina um **teto de gasto** na Anthropic. Cada vitrine com IA custa ~US$ 0,02.

## Trocar o modelo da IA

Crie a variável `VITRINE_MODELO` (por exemplo `claude-haiku-5-5`, mais barato) e faça Redeploy.
