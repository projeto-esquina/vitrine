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
    ├── apagar.js          ← tira uma vitrine do mapa (moderação com senha, ou o próprio dono logado)
    ├── config.js          ← entrega ao navegador os dados públicos (login com Google e número do estande)
    ├── minhas.js          ← "Minhas vitrines" de quem entrou com o Google
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
| `SUPABASE_PUBLISHABLE_KEY` | chave pública `sb_publishable_…` (ou a antiga `anon`) | Login com Google (opcional). Essa chave é feita para ficar no navegador |
| `WHATSAPP_ESTANDE` | número do celular do estande, com DDD (ex.: `11987654321`) | **Feira:** pedidos das vitrines de exemplo e das vitrines sem WhatsApp próprio chegam de verdade nesse celular, marcados como "[Demonstração na feira · vitrine …]" |

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

## Login com Google (opcional)

Criar vitrine continua sem login. Com o login ligado, aparece o botão **Entrar** no topo; quem entra antes de publicar encontra as próprias vitrines em **Minhas vitrines** e pode tirá-las do mapa.

**1. Supabase · pegar o endereço de retorno**
Em **Authentication → Sign In / Providers → Google**, copie a **Callback URL** (formato `https://xxxx.supabase.co/auth/v1/callback`). Deixe essa aba aberta.

**2. Google · criar o "cliente" de login** (console.cloud.google.com, com a conta Google do grupo)
1. Crie um projeto (`vitrine`) e abra **Google Auth Platform** (ou "APIs e serviços → Tela de consentimento OAuth") → **Get started**.
2. **Branding:** nome do app `Vitrine`, e-mail de suporte e e-mail de contato.
3. **Audience:** **External**. Depois de testar, clique em **Publish app** para qualquer conta Google conseguir entrar (em "Testing", só os e-mails da lista de testadores entram).
4. **Clients → Create client → Web application**:
   - **Authorized JavaScript origins:** `https://vitrine-ufabc-ieng.vercel.app`
   - **Authorized redirect URIs:** a Callback URL do Supabase (passo 1), idêntica, sem barra no fim.
5. **Create** e copie o **Client ID** e o **Client secret**.

**3. Supabase · ligar o Google**
1. Volte em **Authentication → Sign In / Providers → Google**, ative, cole o Client ID e o Client secret e salve.
2. Em **Authentication → URL Configuration**:
   - **Site URL:** `https://vitrine-ufabc-ieng.vercel.app`
   - **Redirect URLs → Add URL:** `https://vitrine-ufabc-ieng.vercel.app/**`
3. No **SQL Editor**, rode o bloco **4** do `supabase.sql` (coluna `dono_id`).

**4. Vercel**
Crie `SUPABASE_PUBLISHABLE_KEY` com a **Publishable key** (Supabase → Project Settings → API Keys) e faça Redeploy.

**5. Testar**
`/api/config` deve mostrar o endereço do Supabase. No site, **Entrar → conta Google → volta ao site com as iniciais no topo**. Publique uma vitrine e confira em **Minhas vitrines**.

| Erro | Causa |
|---|---|
| `Error 400: redirect_uri_mismatch` (tela do Google) | A redirect URI no Google não é idêntica à Callback URL do Supabase |
| Volta ao site sem estar logado | Falta `https://vitrine-ufabc-ieng.vercel.app/**` em Redirect URLs, ou a Site URL está errada |
| "Acesso bloqueado: app em teste" | O app ainda está em Testing no Google: publique em Audience ou adicione o e-mail como testador |
| Botão Entrar não aparece | Falta `SUPABASE_PUBLISHABLE_KEY` ou o Redeploy |

## Trocar o modelo da IA

Crie a variável `VITRINE_MODELO` (por exemplo `claude-haiku-5-5`, mais barato) e faça Redeploy.
