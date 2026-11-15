# Vitrine · Protótipo

> **Seu bairro inteiro numa vitrine.**
> A IA que transforma uma foto em vitrine e marketing prontos, e o mapa que liga quem vende a quem mora perto.

O comerciante ou autônomo fotografa o que vende (ou manda um áudio), a IA cria a vitrine dele com catálogo, preços, post e story, e a vitrine aparece no mapa do bairro. O morador busca "eletricista hoje", vê as avaliações de vizinhos e chama direto no WhatsApp.

Projeto da disciplina **ESMA002-23 · Inovações para Engenharia** da **UFABC**, para a **Feira EI2026** (9 de dezembro).

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O site inteiro num arquivo só (HTML, CSS e JavaScript). Funciona no PC e no navegador do celular |
| `api/gerar-pagina.js` | Função de servidor que manda as fotos ao Claude Sonnet. A chave da API fica só na Vercel |
| `vercel.json` | Dá até 60 segundos para a IA responder |
| `LEIA-ME.md` | Passo a passo para publicar na Vercel |
| `vitrine-contexto.md` | Playbook do projeto: problema, solução, planos, identidade visual, telas, feira, tecnologia, custos e cronograma |

## Como abrir
- **Com IA de verdade:** publique na Vercel seguindo o `LEIA-ME.md` (precisa da variável `ANTHROPIC_API_KEY`).
- **Só para ver:** abra o `index.html` no navegador. A IA roda no modo demonstração.

## O que tem
- **Página inicial:** abertura ilustrada (dia ou noite), o problema dos dois lados, números com fonte, por que funciona, antes e depois, como funciona, planos (Grátis, Pro e Destaque), confiança, depoimentos, demonstração no estande e perguntas frequentes.
- **Criar minha vitrine:** fotos ou áudio, IA que lê o texto da foto, vitrine, story e post prontos.
- **Mapa do bairro:** busca, resultados por distância, WhatsApp e avaliação.
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
| Vitrines criadas | Ficam só no navegador de quem criou (compartilhamento via Supabase está no cronograma) |
| Áudio, painel Pro e depoimentos | Simulados ou de exemplo, sinalizados na tela |
| Login e pagamento | Ainda não existem |

## Versões
- **v3 (14/11/2026):** textos e seções alinhados ao resumo final e ao vídeo-pitch: slogan "Seu bairro inteiro numa vitrine", problema com a lista de ofícios, nova seção "Por que funciona", "Como funciona" nos passos do pitch, plano **Destaque no bairro**, faixa "Teste o app Vitrine na feira, em um minuto" e perguntas frequentes revisadas. IA de verdade com o Claude Sonnet pela Vercel.
- **v2:** nome **Vitrine** (antes Esquina), logo pino-loja turquesa, paleta "Águas turquesa", tema claro como padrão.
- **v1:** primeira versão do protótipo, com o nome Esquina.

Detalhes no [`vitrine-contexto.md`](vitrine-contexto.md).
