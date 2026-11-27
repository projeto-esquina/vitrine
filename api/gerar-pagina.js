// Vitrine · rota que lê as fotos com o Claude Sonnet.
// Roda como função da Vercel: o arquivo api/gerar-pagina.js vira o endereço /api/gerar-pagina.
// A chave fica só aqui no servidor, na variável de ambiente ANTHROPIC_API_KEY (nunca no HTML).

const { padroesRelevantes } = require("./_golpes");
const MODELO = process.env.VITRINE_MODELO || "claude-sonnet-5-5";
const CATEGORIAS = "eletricista, encanador, marmita, bolos, beleza, costura, limpeza, bazar, artesanato, pet, aulas, reparos, outros";
const MAX_FOTOS = 3;
const MAX_BYTES_FOTO = 1_500_000; // ~1,5 MB por foto já em base64
const LIMITE_POR_IP = 15;         // pedidos por IP a cada 10 minutos (aproximado: cada instância conta a sua parte)
const contagem = new Map();

function promptIA(frase, nome, nImgs, padroes) {
  return `Você é a IA do Vitrine, um app que monta a vitrine (a página com catálogo) de comerciantes e autônomos de bairro no Brasil.
A partir ${nImgs ? "das fotos anexadas e " : ""}da frase do comerciante, monte a vitrine.${nImgs ? "\nPrimeiro leia com atenção todo texto visível nas fotos (etiquetas, cardápio, placa, papel colado, letra à mão), depois entenda o que a foto mostra." : ""}
Responda APENAS com um objeto JSON válido, sem nenhum texto antes ou depois, exatamente neste formato:
{"texto_lido": "todo o texto que aparece nas fotos, copiado como está (ou vazio se não houver)", "nome": "nome curto do negócio", "categoria": "uma destas chaves: ${CATEGORIAS}", "descricao": "1 ou 2 frases simples e calorosas, até 180 caracteres", "itens": [{"nome": "produto ou serviço", "preco": 80, "origem": "foto | frase | estimado"}], "atende_hoje": true, "titulo_story": "chamada curta para story, até 30 caracteres", "sub_story": "complemento, até 50 caracteres", "perguntas_agendamento": ["2 ou 3 perguntas curtas que o comerciante faria a um cliente antes de agendar"], "fotos": [{"indice": 0, "tipo": "texto | produto | servico | fachada | outro"}], "risco": {"nivel": "baixo | medio | alto", "motivos": [{"padrao": "id do padrão da base", "trecho": "trecho exato da frase ou da foto que acende o alerta"}]}, "moderacao": {"ok": true, "motivo": null}}
Regras:
- Português do Brasil, tom simples e próximo, como se fosse um vizinho falando.
- Se o comerciante informou um nome, use-o no nome do negócio (ex.: "Zé" + elétrica = "Zé Elétrica"). Se não informou, crie um nome simpático e curto.
- De 3 a 5 itens no catálogo, com preços "a partir de" em reais, coerentes com o que aparece na frase e nas fotos. Se a frase der um preço, respeite-o. Se a foto mostrar um preço, use exatamente o da foto.
- "origem" de cada item: "foto" se o preço foi lido nas fotos, "frase" se veio da frase, "estimado" se você estimou.
- "fotos": uma entrada por foto anexada, na ordem (índice 0 é a primeira). "texto" = papel, cardápio, lousa, placa ou panfleto cujo conteúdo é principalmente escrito; "produto" = o que é vendido; "servico" = serviço feito ou em andamento; "fachada" = frente do negócio. Sem fotos, use [].
- "perguntas_agendamento": perguntas que ajudam o comerciante a se preparar (ex.: eletricista: "O que precisa ser feito?"; bolos: "Pra quantas pessoas?"). Não pergunte serviço, dia, horário nem nome: isso já é perguntado.
- "atende_hoje" é true só se a frase indicar atendimento no mesmo dia ou todos os dias.
- "moderacao.ok" é false se a foto ou a frase tiver conteúdo impróprio, ilegal ou documentos pessoais; explique em "motivo".
- Não invente telefone, endereço nem avaliações.
- "risco": compare a frase e o texto das fotos com os PADRÕES DE GOLPE abaixo (da base do Vitrine). Só aponte um padrão se houver um trecho que realmente o mostre, e copie esse trecho. Sinal em encomenda, sozinho, é normal (nível baixo). Sem sinais, use {"nivel": "baixo", "motivos": []}.
PADRÕES DE GOLPE (base do Vitrine):
${padroes.map(p => `- [${p.id}] ${p.titulo}: ${p.explica}`).join("\n")}
Dados do comerciante:
Nome informado: ${nome || "(não informado)"}
Frase: ${frase}`;
}

function excedeuLimite(ip) {
  const agora = Date.now();
  const r = contagem.get(ip) || { n: 0, desde: agora };
  if (agora - r.desde > 10 * 60 * 1000) { r.n = 0; r.desde = agora; }
  r.n += 1;
  contagem.set(ip, r);
  return r.n > LIMITE_POR_IP;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ erro: "Falta configurar ANTHROPIC_API_KEY na Vercel" });

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
  if (excedeuLimite(ip)) return res.status(429).json({ erro: "Muitos pedidos, tente em alguns minutos" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const frase = String(body.frase || "").trim().slice(0, 500);
  const nome = String(body.nome || "").trim().slice(0, 60);
  if (frase.length < 8) return res.status(400).json({ erro: "Frase muito curta" });

  const imagens = [];
  for (const f of (Array.isArray(body.fotos) ? body.fotos : []).slice(0, MAX_FOTOS)) {
    const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(String(f));
    if (!m || m[2].length > MAX_BYTES_FOTO) continue;
    imagens.push({ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: 1200,
        // fotos primeiro, depois o texto (recomendação da documentação)
        messages: [{ role: "user", content: [...imagens, { type: "text", text: promptIA(frase, nome, imagens.length, padroesRelevantes(frase + " " + nome)) }] }],
      }),
    });
    if (r.status === 429) return res.status(429).json({ erro: "IA ocupada" });
    if (!r.ok) {
      console.error("Anthropic", r.status, await r.text());
      return res.status(502).json({ erro: "Falha ao falar com a IA" });
    }
    const resposta = await r.json();
    const texto = (resposta.content || []).filter(c => c.type === "text").map(c => c.text).join("");
    const json = texto.slice(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
    const dados = JSON.parse(json);
    if (dados.moderacao && dados.moderacao.ok === false) {
      return res.status(422).json({ erro: dados.moderacao.motivo || "Conteúdo não permitido" });
    }
    return res.status(200).json({ dados, uso: resposta.usage });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Não consegui ler a resposta da IA" });
  }
};
