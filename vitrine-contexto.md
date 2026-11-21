# Vitrine · Playbook do Projeto

> **"O comércio local nunca teve tanta visibilidade."**
> A IA que transforma uma foto em vitrine e marketing prontos, e o mapa que liga quem vende a quem mora perto.

| | |
|---|---|
| **Instituição** | UFABC · Universidade Federal do ABC |
| **Disciplina** | ESMA002-23 · Inovações para Engenharia |
| **Evento** | Feira EI2026, apresentação em estande, **9 de dezembro (quarta)** |
| **Fase atual** | Protótipo navegável (PC e navegador do celular) com IA de verdade pelo servidor |
| **Última atualização** | 17/11/2026 (v3.2) |
| **Site no ar** | https://vitrine-ufabc-ieng.vercel.app/ |
| **Fontes** | Resumo final do projeto (PDF "Projeto IENG · Vitrine e Marketplace") + vídeo-pitch final (2 min) + decisões tomadas na construção do protótipo |

O projeto se chamava **Esquina** até a v1. O nome atual é **Vitrine**, e o produto é chamado de "app Vitrine" no pitch, embora funcione no navegador, sem loja de aplicativos. A página de cada comerciante se chama **vitrine**.

---

## 1. Ideia central

Marketplace de bairro costuma morrer porque **começa vazio**: sem comerciante não vem morador, e sem morador o comerciante não entra. A **vitrine instantânea** dá ao comerciante um motivo para entrar no primeiro dia, mesmo sem nenhum cliente na plataforma, e cada vitrine criada já povoa o marketplace automaticamente.

---

## 2. O problema, dos dois lados

### 2.1 Quem vende no bairro vive do boca a boca
Comerciantes e autônomos dependem de indicação. Não têm tempo nem jeito pra se divulgar na internet. **O marketing de hoje é papel no poste** ("Bolos sob encomenda · aniversário, festa e casamento · Tê", "Faço unhas · pé e mão · atendo em casa · Lu").

Quem vende no bairro (lista do pitch): marmita, manicure, eletricista, diarista, lojinha, encanador, cabeleireira, barbeiro, bolos e doces, costureira, pintor, pet shop, banho e tosa, mecânico, chaveiro, jardineiro, aulas particulares, fotógrafo, personal trainer, brechó, artesanato, açaí, conserto de celular, montador de móveis, passeador de cães, marceneiro, salgados, lavanderia e muito mais.

### 2.2 Quem mora não sabe o que existe perto de casa
Aí apela pros aplicativos grandes ou pede indicação no grupo do WhatsApp. Cena do pitch, no grupo "Vizinhos R. Santa Adélia" (128 participantes):
- **Marina:** Gente, alguém indica um eletricista pra hoje?
- **Paulo:** Não conheço ninguém aqui perto
- **Rose:** Tenta naqueles apps grandes
- **João:** Meu cunhado faz, mas tá viajando
- **Marina:** Ninguém??

**Enquanto isso: o Zé é eletricista e mora a 350 m da Marina. Ninguém no grupo sabe.**

### 2.3 Síntese
> **Quem vende não aparece. Quem procura não encontra.**
> **O app Vitrine junta os dois lados do bairro.**

### 2.4 O tamanho do problema (números usados no site)

| Número | O que significa | Fonte |
|---|---|---|
| **38,5 milhões** | brasileiros na informalidade, 37,5% dos ocupados | IBGE, PNAD Contínua, nov/2025 a jan/2026 ([Fenacon](https://fenacon.org.br/noticias/taxa-de-informalidade-cai-no-mercado-de-trabalho-mostra-ibge/)) |
| **26,2 milhões** | trabalham por conta própria | IBGE, PNAD Contínua, mesmo período ([Fenacon](https://fenacon.org.br/noticias/taxa-de-informalidade-cai-no-mercado-de-trabalho-mostra-ibge/)) |
| **78%** | das empresas abertas no Brasil em 2026 são MEIs | Sebrae com dados da Receita Federal, jan a abr/2026 ([Fenacon](https://fenacon.org.br/noticias/meis-lideram-abertura-de-empresas-e-respondem-por-78-dos-novos-negocios-em-2026/)) |
| **Mais de 80%** | dos pequenos negócios de serviço usam o WhatsApp como principal canal com o cliente | Sebrae, Pesquisa Serviço 2025 ([Agência Sebrae](https://agenciasebrae.com.br/cultura-empreendedora/whatsapp-e-o-principal-meio-de-comunicacao-para-80-dos-negocios-de-servico/)) |

Revisar os números perto da feira: o IBGE publica a PNAD todo mês.

---

## 3. Como funciona

### 3.1 Lado do comerciante ou autônomo (uns 5 minutos)
1. **Fotografa o que vende ou o que já fez**, ou só manda um áudio: "faço instalação elétrica, atendo a região, cobro a partir de R$ 80". Sem formulário, sem site, sem designer.
2. **A IA monta a vitrine e o marketing:** catálogo com descrição e preço, foto de capa, e posts e stories prontos pro Instagram e o WhatsApp dele.
3. **E já aparece no mapa do bairro.** Cada vitrine criada povoa o mapa, e o comerciante ganha divulgação desde o primeiro dia.

### 3.2 Lado do morador
**Busca, encontra e chama no WhatsApp.** Busca "marmita perto", "eletricista hoje" ou "presente até R$ 50", vê as vitrines com **avaliações de vizinhos** e chama direto no WhatsApp ("Oi, Zé! Te achei no app Vitrine. Consegue vir hoje trocar um disjuntor?" / "Consigo sim! Passo aí às 16h.").

---

## 4. Por que é forte

- **Segredo:** o comércio local não precisa de mais um app para baixar. Precisa de alguém que faça o marketing por ele, e a IA agora consegue fazer isso em segundos.
- **Nicho inicial:** um único bairro, a região do campus da UFABC em Santo André. Domina esse bairro e expande bairro por bairro.
- **Monopólio:** efeito de rede local. Cada vitrine atrai moradores, e cada avaliação deixa a plataforma mais difícil de copiar.

---

## 5. Quem paga

| Plano | O que inclui | Quem paga | Preço no protótipo |
|---|---|---|---|
| **Grátis** (vitrine básica) | Vitrine básica, para encher o mapa rápido | Ninguém | R$ 0 |
| **Pro** (assinatura mensal) | Posts e stories novos toda semana, gerados automaticamente; estatísticas de visitas e cliques | Comerciante ou autônomo | R$ 29/mês (**exemplo**) |
| **Destaque no bairro** | Aparecer primeiro nas buscas da região | Comerciante ou autônomo | R$ 15/mês (**exemplo**) |

Os preços do Pro e do Destaque são definidos no escopo Financeiro (seção 13). No site, aparecem marcados como valores de exemplo.

---

## 6. Identidade visual

### 6.1 Logo
**Pino-loja turquesa:** pino de mapa com uma fachada de loja (toldo e porta) dentro, ao lado da palavra "vitrine" em minúsculas (Poppins 600). No site, o logo é desenhado em SVG, então fica nítido em qualquer tamanho.

### 6.2 Paleta "Águas turquesa"

| Cor | Hex | Uso |
|---|---|---|
| Turquesa da marca | `#08BDB8` | Pino do logo, pinos do mapa, faixa "Demonstração no estande" |
| Água | `#3FCDCA` | Botões principais e destaques |
| Água clara | `#68D9D7` | Texto turquesa no tema escuro |
| Gelo azulado | `#9DE8EE` | Detalhes e subtítulos sobre fundo escuro |
| Menta | `#C6FEF6` | Bilhetes e fundos suaves |
| Petróleo | `#0C3B3F` | Blocos de destaque escuros, interior do pino |
| Grafite | `#081D1E` | Fundo do tema escuro, texto sobre turquesa |
| Turquesa escuro | `#067A76` | Texto turquesa no tema claro (contraste) |

Verde do WhatsApp `#1E9E55` (e `#178A49` no botão pequeno), só nos botões "Chamar no WhatsApp".

### 6.3 Tipografia
- **Manrope:** títulos (peso 800, espaçamento apertado) e texto.
- **Poppins 600:** a palavra "vitrine" do logo.
- **JetBrains Mono:** rótulos pequenos em caixa alta e fontes.

### 6.4 Temas
- **Tema claro é o padrão**, com a rua ensolarada na abertura. O escuro (rua à noite) fica no botão de sol/lua, e a escolha é salva no navegador.
- Contraste conferido pelo padrão WCAG em todas as telas, nos dois temas.

### 6.5 Tom de voz
Informal, de bairro e direto: "pra quem mora perto", "Te achei no app Vitrine", "Passo aí às 16h".

---

## 7. O protótipo (v3)

Um site que funciona no PC e no navegador do celular, sem app.
- **Site público (Vercel):** https://vitrine-ufabc-ieng.vercel.app/ (endereço padrão do QR code)
- **Link no Claude:** https://claude.ai/artifact/5JPnEhQvA12ngnT9NduAbd (privado: só abre para quem recebeu acesso)
- **Pacote para hospedar com IA de verdade:** `vitrine-site.zip` (seção 9)

### 7.1 Navegação
- **Barra superior:** logo; Início, Mapa do bairro, Telão e **Criar minha vitrine**; etiqueta "Protótipo"; botão de tema.
- **Celular:** barra inferior com Início, Mapa, Criar e Telão.
- Botão flutuante "Precisa de ajuda?", que leva às perguntas frequentes.

### 7.2 Página inicial (ordem das seções)

| # | Seção | Conteúdo |
|---|---|---|
| 1 | **Abertura** | Ilustração (dia ou noite) com a lojinha "Bolos da Tê" e pinos caindo. "O comércio local nunca teve **tanta visibilidade.**" + "A IA que transforma uma foto em vitrine e marketing prontos, e o mapa que liga quem vende a quem mora perto." Botões "Criar minha vitrine" e "Ver o mapa do bairro", card "Zé Elétrica está a 350 m", contador de vitrines e "Role para ver como funciona" |
| 2 | **Problema** | Dois cards: "Quem vende no bairro vive do boca a boca" (lista de ofícios, "O marketing de hoje: papel no poste" e os bilhetes) e "Quem mora não sabe o que existe perto de casa" (grupo de vizinhos e "Enquanto isso: o Zé mora a 350 m") |
| 3 | **Números** | Os quatro dados da seção 2.4, com fonte |
| 4 | **Faixa** | "Quem vende não aparece. Quem procura não encontra." + "O app Vitrine junta os dois lados do bairro." |
| 5 | **Por que funciona** *(novo)* | "Todo marketplace de bairro começa vazio." + três cards: O marketing vem pronto · Um bairro de cada vez · Cada vitrine puxa a próxima |
| 6 | **Antes e depois** | "Do papel no poste à tela do celular": o bilhete da Tê × a vitrine dela |
| 7 | **Como funciona** | Celular fixo que troca de tela com a rolagem, nos passos do pitch: Comerciante 1/3 Fotografa · 2/3 A IA monta a vitrine e o marketing · 3/3 Aparece no mapa · Morador: busca, encontra e chama no WhatsApp |
| 8 | **Planos** | "Grátis pra encher o mapa. Pro pra quem quer crescer." Ticket com seletor **Grátis / Pro / Destaque** |
| 9 | **Confiança em cada pino** | Avaliações de vizinhos · Fotos de verdade · Endereço protegido · Conversa direta |
| 10 | **Quem já usou** | Três falas **fictícias, marcadas como fictícias** (Tê, Zé e Lu), até chegarem as falas das entrevistas |
| 11 | **Demonstração no estande** *(novo)* | Faixa turquesa "Teste o app Vitrine na feira, em um minuto" com os 4 passos e os botões "Começar pela foto" e "Abrir o telão" |
| 12 | **Perguntas frequentes** | O que é · Precisa baixar app? · Quanto custa (com Destaque) · Como a IA monta · Endereço no mapa · Contato · Onde começa (Santo André) · Quem pode criar |
| 13 | **Chamada final e rodapé** | QR code "Abra no seu celular", "Compartilhar", links |

**Removido na v3:** as quatro cartas que viravam ("Como funciona" antigo), porque repetiam a seção do celular, e o slogan "em um só lugar" / "Da foto ao balcão", trocados pelo slogan oficial.

### 7.3 Outras telas

| Tela | O que tem |
|---|---|
| **Criar minha vitrine** (`#criar`) | Até 3 fotos (câmera ou galeria), frase ou áudio (simulado), nome, WhatsApp e área de atendimento no mapa. Geração animada com cronômetro. Resultado: vitrine, story, post e ajustes; quadro **"Lido na foto"**; cada preço marcado como "lido na foto", "da sua frase" ou "estimado · confira"; selo "Lido pelo Claude Sonnet" ou "Modo demonstração" |
| **Mapa do bairro** (`#mapa`) | Busca ("eletricista hoje", "presente até R$ 50"), resultados por distância com nota, vizinhos que avaliaram e "atende hoje"; vitrine completa; WhatsApp; avaliação com estrelas |
| **Telão** (`#telao`) | Mapa para projetor, contador "vitrines no mapa do bairro", QR code com link editável, últimas vitrines, tela cheia e **Moderar vitrines** (com senha do grupo, tira uma vitrine do mapa) |
| **Painel Pro** (`#painel`) | Dados de exemplo do Zé Elétrica: visitas na vitrine, cliques no WhatsApp, posts gerados |

### 7.4 O que é real e o que é simulado

| Item | Situação |
|---|---|
| IA que monta a vitrine | **Real** pelo link do Claude ou hospedado na Vercel com a chave da Anthropic (Claude Sonnet lê o texto e entende a foto). Sem isso, modo demonstração |
| Story e post | **Reais**, gerados como imagem no navegador |
| Busca | **Real**, com interpretação simples de palavras |
| Mapa | Ilustrado, não geográfico |
| Vitrines criadas | Com o Supabase ligado, vão para o banco e aparecem no mapa e no telão de todo mundo em até 10 s. Sem ele, ficam só no navegador de quem criou |
| Áudio, painel Pro, depoimentos | Simulados ou de exemplo, sinalizados na tela |
| Login e pagamento | Fora do protótipo |

### 7.5 Vitrines de exemplo
Zé Elétrica (tomada R$ 80, chuveiro R$ 90, disjuntor R$ 120) · Luz & Cia Reparos · Marmita da Cida · Unhas da Lu · Costura Ana · Faxina da Rosa · Bazar da Vila · Bolos da Tê · Banho da Jô · Reforço com a Bia.

---

## 8. Na feira

### 8.1 Roteiro (o ciclo inteiro em cerca de 1 minuto, sem explicação técnica)
1. O visitante fotografa **três objetos do estande** e, em segundos, vê a vitrine e o post prontos.
2. A vitrine dele aparece **ao vivo no mapa do "bairro"** projetado no telão.
3. **Outro visitante** busca no mapa, encontra a vitrine e chama no WhatsApp.

**QR code no estande** para o público testar no próprio celular.

### 8.2 Plano B
- Vitrines de exemplo já no mapa e o modo demonstração, que funciona sem a IA.
- Internet própria (roteador 4G ou celular roteando).
- Vídeo curto da demo funcionando.

---

## 9. Tecnologia

### 9.1 Para a feira: o protótipo + funções na Vercel
Decisão de 11/11: **não reescrever em Next.js.** O protótipo (`index.html`) continua sendo o site, com pequenas funções de servidor na Vercel.

```
vitrine-site/
├── index.html            ← o site
├── vercel.json           ← dá até 60 s para a IA responder
├── supabase.sql          ← cria a tabela e a pasta de fotos no Supabase
├── LEIA-ME.md            ← passo a passo de publicação
└── api/
    ├── gerar-pagina.js   ← manda as fotos ao Claude Sonnet (guarda a chave)
    ├── publicar.js       ← grava a vitrine no Supabase
    ├── vitrines.js       ← lista as vitrines para o mapa e o telão (atualiza a cada 10 s)
    ├── apagar.js         ← moderação do grupo, com senha
    └── _supabase.js      ← peças comuns
```

Serviços: **GitHub** (código) → **Vercel Hobby** (site + funções, grátis) → **Anthropic** (Claude Sonnet) → **Supabase** (grátis, banco e fotos, para as vitrines aparecerem em todos os celulares e no telão). Só o servidor da Vercel acessa o banco; o navegador nunca vê as chaves. Variáveis: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `MODERACAO_SENHA`.

### 9.2 IA: um modelo multimodal
O **Claude Sonnet 5.5** (`claude-sonnet-5-5`) lê o texto da foto (OCR) e entende a imagem **na mesma chamada**, e devolve um JSON:

```json
{
  "texto_lido": "BOLO DE POTE R$ 12 / BRIGADEIRO CENTO R$ 90",
  "nome": "Bolos da Tê",
  "categoria": "bolos",
  "itens": [
    { "nome": "Bolo de pote", "preco": 12, "origem": "foto" },
    { "nome": "Bolo de festa (1 kg)", "preco": 85, "origem": "estimado" }
  ],
  "moderacao": { "ok": true, "motivo": null }
}
```

- O celular reduz a foto para 900 px em JPEG e remove a localização (EXIF) antes de enviar.
- A chave fica só na Vercel. O servidor monta as instruções, aceita até 3 fotos e ~15 pedidos por pessoa a cada 10 minutos.
- A moderação vem no mesmo JSON: foto ou frase imprópria não vira vitrine.
- Para o pitch: "Usamos o Claude Sonnet, um modelo multimodal: ele enxerga a foto e lê o que está escrito nela ao mesmo tempo."
- **Depois da feira:** busca por foto com o **CLIP** (código aberto) + pgvector no Supabase. Notebook de teste: `vitrine_teste_clip.ipynb`.

### 9.3 Custos

| Item | Custo |
|---|---|
| Hospedagem (Vercel Hobby, Supabase Free) | Grátis. O Supabase pausa após 7 dias sem uso |
| Uma vitrine com o Sonnet (3 fotos + frase) | ~US$ 0,02 |
| Feira (~300 vitrines) | ~US$ 5 |
| Créditos sugeridos na Anthropic | US$ 10, com teto de gasto de US$ 10 e recarga automática desligada |
| Produto comercial (por mês) | ~US$ 60 (Vercel Pro, Supabase Pro e IA) |

Preço do Sonnet 5.5: US$ 2 por milhão de tokens de entrada e US$ 10 de saída. Fontes: [Vision (Claude Platform)](https://platform.claude.com/docs/en/build-with-claude/vision) · [Claude Sonnet 5.5 pricing (Apidog)](https://apidog.com/blog/claude-sonnet-5-5-pricing/).

---

## 10. Cronograma até a feira (9/dez)

| Quando | O quê | Pronto quando |
|---|---|---|
| **Qui 12/nov** | Contas: repositório `vitrine` (público) no GitHub, Vercel Hobby, Anthropic com US$ 10, teto de gasto e chave | Três contas criadas, chave guardada fora do GitHub |
| **Sex 13/nov** | Subir `vitrine-site` ao GitHub, importar na Vercel (preset Other), variável `ANTHROPIC_API_KEY`, testar no celular | "Lido pelo Claude Sonnet" com o preço tirado da foto |
| **Sáb 14/nov** | Testar 15 a 20 fotos reais em Android e iPhone, planilha de acertos | ≥ 80% das categorias e ≥ 90% dos preços certos |
| **Dom 15/nov** | Supabase: vitrines compartilhadas entre celulares e no telão | Vitrine criada no celular A aparece no B |
| **17 a 30/nov** | Ajustes da IA pela planilha, telão ao vivo, comerciantes reais no mapa, rota de apagar para o grupo | Ciclo completo da feira funcionando |
| **3/dez** | **Congelar funções**: só correções daqui pra frente | |
| **1 a 6/dez** | Depoimentos reais, números revisados, domínio e QR final, testes em vários celulares | Versão final |
| **7 e 8/dez** | Ensaio geral, abrir o site (Supabase), imprimir o QR | Tudo pronto |

**Se atrasar, cortar nesta ordem:** avaliações → telão ao vivo entre celulares → busca refinada. O que não pode faltar: foto → vitrine → WhatsApp.

**Depois da feira:** busca por foto (CLIP), login, plano Pro com posts semanais e pagamento, Destaque, PWA (instalar pela tela inicial), termos de uso e LGPD.

---

## 11. Entrevistas
Em andamento com comerciantes do entorno da UFABC. Pedir **fotos reais** (cardápio, panfleto, produto, etiqueta de preço), anotar as falas e pegar **autorização por escrito** para usar nome, foto e falas na feira.

---

## 12. Pendências

- [x] Hospedar o `vitrine-site` na Vercel (15/11) e deixar o QR apontando para ele.
- [ ] Ligar o Supabase (SQL + três variáveis na Vercel) e testar com dois celulares.
- [ ] Testar a IA com as fotos das entrevistas e ajustar as instruções.
- [ ] Trocar os depoimentos fictícios por falas reais (com autorização).
- [ ] Definir os preços do Pro e do Destaque (hoje R$ 29 e R$ 15 são exemplos).
- [ ] Definir o recorte do mapa da demo em volta do campus de Santo André.
- [ ] Revisar os números da seção 2.4 perto da feira.
- [ ] Dividir as tarefas do cronograma entre o grupo.

---

## 13. Escopos da disciplina

| Escopo | O que entra |
|---|---|
| **Marketing** | A identidade visual do Vitrine e os posts gerados são o próprio produto |
| **Financeiro** | Precificação do plano Pro e do Destaque no bairro |

---

## 14. Arquivos

| Arquivo | O que é |
|---|---|
| `vitrine-site.zip` | Site + servidor da IA, pronto para a Vercel |
| `index.html` / `vitrine-prototipo.html` | O protótipo completo, num arquivo só |
| `vitrine-contexto.md` | Este playbook |
| `README.md` | Apresentação do repositório |
| `vitrine_teste_clip.ipynb` | Notebook do Colab para testar o CLIP (busca por foto) |
