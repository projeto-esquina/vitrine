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
    ├── denunciar.js       ← recebe denúncias de vitrines e mensagens da Ouvidoria (com protocolo)
    ├── ouvidoria.js       ← painel do grupo: listar, resolver, arquivar e devolver vitrine ao mapa
    ├── avaliacoes.js      ← avaliações dos vizinhos (ler e enviar; 1 por pessoa por vitrine)
    ├── _golpes.js         ← base de padrões de golpe (checagem de risco e IA)
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

## Checagem contra golpes (IA + base de padrões)

Não precisa de configuração nova.

- **Base de padrões:** 15 padrões de golpe (pagamento integral adiantado, chave Pix/CPF na vitrine, link externo, outro canal, pedido de senha ou código, dinheiro fácil, empréstimo, taxa antecipada, órgão oficial, sorteio, urgência, eletrônico barato, ilegal, promessa impossível, sinal em encomenda) + preço típico por categoria. Fica em `api/_golpes.js` e, igual, na constante `GOLPES` do `index.html`: ao mudar um, mude o outro.
- **Na revisão da vitrine:** o painel **"Checagem de segurança"** mostra o resultado (verde, atenção ou análise), com o motivo e o trecho. Editar o texto refaz a checagem na hora.
- **Com a IA:** os padrões mais parecidos com a frase vão junto no pedido ao Sonnet (a "recuperação" do RAG). Ela devolve os padrões que reconheceu, com o trecho, inclusive casos que as regras não pegam ("só no zap do meu primo"). Esses aparecem como "apontado pela IA".
- **Risco alto:** a vitrine **não entra no mapa**. O servidor refaz a checagem (não confia no navegador), grava a vitrine como oculta e abre uma manifestação na fila do grupo, com protocolo. O grupo decide em **Telão → Moderar vitrines → Denúncias e ouvidoria** (botão **Devolver ao mapa**).
- **Dica de segurança:** no agendamento e no "Chamar no WhatsApp", conforme o tipo de negócio (serviço em casa, encomenda, bazar, aulas).

## Avaliações dos vizinhos

**Ligar (uma vez):** no **SQL Editor** do Supabase, rode o **bloco 6** do `supabase.sql` (tabela `avaliacoes`).

- Cada vitrine aberta tem a área **"Avaliações dos vizinhos"**: nota média, total, barras de 5 a 1 estrela, as avaliações mais recentes e o formulário para avaliar.
- Na lista do mapa, a nota ("★ 4,9 · 23 vizinhos") é um atalho direto para essa área.
- Uma avaliação por pessoa por vitrine (o servidor guarda só o resumo do IP). Quem chamou no WhatsApp ou agendou pelo app ganha o selo **"✓ contato pelo app"**. No protótipo esse selo é marcado pelo próprio navegador, não é uma prova.
- Vitrines de exemplo mostram avaliações fictícias, sinalizadas na tela.

## Denúncias e Ouvidoria

**Ligar (uma vez):** no Supabase, **SQL Editor**, rode o **bloco 5** do `supabase.sql` (tabela `manifestacoes`). Não precisa de variável nova: usa a `MODERACAO_SENHA`.

**Como funciona:**
- Cada vitrine tem o link **"Denunciar esta vitrine"**, com 6 motivos (golpe, impróprio, enganoso, ilegal, dados de terceiros, outro), texto e contato opcionais.
- **Ouvidoria** (rodapé, seção de confiança e FAQ): reclamação, sugestão, elogio, pedido sobre dados pessoais (LGPD) ou denúncia geral.
- Toda mensagem recebe um **protocolo** (`VT-AAMMDD-XXXXX`).
- **3 denúncias abertas de pessoas diferentes** tiram a vitrine do mapa sozinhas. O IP nunca é guardado: só um resumo (hash) para contar pessoas diferentes.
- **Moderação:** no **Telão → Moderar vitrines**, digite a senha e clique em **Carregar** (Denúncias e ouvidoria). Dá para marcar como **Resolvida**, **Arquivar**, **Reabrir** e **Devolver ao mapa** (devolve a vitrine e arquiva as denúncias dela).
- Sem o banco, o site mostra o protocolo como demonstração e a mensagem fica só no navegador.

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
