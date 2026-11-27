# Vitrine · Protótipo

> **O comércio local nunca teve tanta visibilidade.**
> A IA que transforma uma foto em vitrine e marketing prontos, e o mapa que liga quem vende a quem mora perto.

O comerciante ou autônomo fotografa o que vende (ou manda um áudio), a IA cria a vitrine dele com catálogo, preços, post e story, e a vitrine aparece no mapa do bairro. O morador busca "eletricista hoje", vê as avaliações de vizinhos e chama direto no WhatsApp.

Projeto da disciplina **ESMA002-23 · Inovações para Engenharia** da **UFABC**, para a **Feira EI2026** (9 de dezembro).

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O site inteiro num arquivo só (HTML, CSS e JavaScript). Funciona no PC e no navegador do celular |
| `api/gerar-pagina.js` | Manda as fotos ao Claude Sonnet. A chave da API fica só na Vercel |
| `api/publicar.js`, `api/vitrines.js`, `api/apagar.js` | Gravam e listam as vitrines no Supabase, e tiram do mapa (moderação com senha) |
| `supabase.sql` | Cria a tabela e a pasta de fotos no Supabase |
| `vercel.json` | Dá até 60 segundos para a IA responder |
| `LEIA-ME.md` | Passo a passo para publicar na Vercel |
| `vitrine-contexto.md` | Playbook do projeto: problema, solução, planos, identidade visual, telas, feira, tecnologia, custos e cronograma |

## Como abrir
- **Com IA de verdade:** publique na Vercel seguindo o `LEIA-ME.md` (precisa da variável `ANTHROPIC_API_KEY`).
- **Só para ver:** abra o `index.html` no navegador. A IA roda no modo demonstração.

## O que tem
- **Página inicial:** abertura ilustrada (dia ou noite), o problema dos dois lados, números com fonte, por que funciona, antes e depois, como funciona, planos (Básico, Pro e Premium), confiança, depoimentos, demonstração no estande e perguntas frequentes.
- **Criar minha vitrine:** fotos ou áudio, IA que lê o texto da foto, vitrine, story e post prontos.
- **Mapa do bairro:** busca, resultados por distância, WhatsApp, agendamento com assistente e avaliação.
- **Telão da feira:** mapa para projetor, contador e QR code.
- **Painel Pro:** estatísticas de exemplo.
- **Tema claro (padrão) e escuro.**

## O que é real e o que é simulado

| Função | Situação |
|---|---|
| IA que monta a vitrine | Real quando hospedado na Vercel com a chave, ou aberto pelo Claude. Sem isso, modo demonstração |
| Story e post | Reais, gerados como imagem no navegador |
| Busca | Real, com interpretação simples de palavras |
| Mapa | Ilustrado, não geográfico |
| Vitrines criadas | Com o Supabase ligado, aparecem para todo mundo no mapa e no telão. Sem ele, ficam só no navegador de quem criou |
| Áudio, painel Pro e depoimentos | Simulados ou de exemplo, sinalizados na tela |
| Login | Com Google, opcional (configuração no LEIA-ME) |
| Pagamento | Ainda não existe |

## Versões
- **v3.10 (27/11/2026):** foto de papel/cardápio não vira mais capa: a IA (ou o celular) identifica o tipo de cada foto e o comerciante escolhe a capa na revisão.
- **v3.9 (27/11/2026):** checagem contra golpes ao publicar (base de 15 padrões + IA), vitrine suspeita vai para análise com protocolo, dicas de segurança no contato.
- **v3.8 (27/11/2026):** área "Avaliações dos vizinhos" em cada vitrine (média, distribuição, lista e formulário), gravada no banco, com selo de contato pelo app.
- **v3.7 (27/11/2026):** denúncias de vitrines e Ouvidoria, com protocolo; 3 denúncias tiram a vitrine do mapa; moderação pelo telão.
- **v3.6 (24/11/2026):** vitrines sem WhatsApp (e exemplos, sem número do estande) fazem o agendamento com simulação marcada, mostrando a mensagem como chegaria ao comerciante.
- **v3.5 (24/11/2026):** com `WHATSAPP_ESTANDE`, pedidos de demonstração chegam de verdade no celular do estande; vitrine sem WhatsApp não simula mais resposta.
- **v3.4 (24/11/2026):** login com Google opcional (Supabase Auth), "Minhas vitrines" e o dono pode tirar a própria vitrine do mapa.
- **v3.3 (24/11/2026):** planos definidos (Básico grátis, Pro R$ 14,90, Premium R$ 49,90) e **assistente de agendamento** em cada vitrine, com perguntas criadas pela IA e pedido entregue no WhatsApp do comerciante.
- **v3.2 (17/11/2026):** novo slogan "O comércio local nunca teve tanta visibilidade" (antes "Seu bairro inteiro numa vitrine").
- **v3.1 (15/11/2026):** site no ar em https://vitrine-ufabc-ieng.vercel.app/ (padrão do QR code); vitrines compartilhadas pelo Supabase, telão atualizando a cada 10 s e moderação com senha.
- **v3 (14/11/2026):** textos e seções alinhados ao resumo final e ao vídeo-pitch: slogan "Seu bairro inteiro numa vitrine", problema com a lista de ofícios, nova seção "Por que funciona", "Como funciona" nos passos do pitch, plano **Destaque no bairro**, faixa "Teste o app Vitrine na feira, em um minuto" e perguntas frequentes revisadas. IA de verdade com o Claude Sonnet pela Vercel.
- **v2:** nome **Vitrine** (antes Esquina), logo pino-loja turquesa, paleta "Águas turquesa", tema claro como padrão.
- **v1:** primeira versão do protótipo, com o nome Esquina.

Detalhes no [`vitrine-contexto.md`](vitrine-contexto.md).
