// Vitrine · base de padrões de golpe (gerada a partir de golpes_base.py; a mesma do site).
// Usada pela checagem de risco ao publicar e pela IA (os padrões mais parecidos vão no pedido).
const BASE = {"padroes": [{"id": "pagamento_integral_antecipado", "titulo": "Pagamento integral adiantado", "explica": "Pedir o valor todo antes do serviço é o golpe mais comum em serviços: a pessoa recebe e some.", "peso": 5, "sinais": ["(100 ?%|integral|total|tudo)\\s*(adiantad|antecipad|antes)", "s[óo] (trabalho|atendo|fa[çc]o)\\s*(com|ap[óo]s|mediante)\\s*pagamento", "pag(ue|ar|amento)\\s*(antes|adiantad|antecipad)"]}, {"id": "chave_pix_na_vitrine", "titulo": "Chave Pix, CPF ou dados de pagamento na vitrine", "explica": "Colocar chave Pix ou CPF na vitrine leva o cliente a pagar fora de qualquer combinação. O pagamento se combina na conversa.", "peso": 4, "sinais": ["\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b", "chave\\s*pix", "\\bpix\\s*:\\s*\\S+", "\\bag[êe]ncia\\b.*\\bconta\\b"]}, {"id": "link_externo", "titulo": "Link para fora do app", "explica": "Links levam a páginas falsas que imitam lojas e bancos, ou tiram a conversa de onde a comunidade enxerga.", "peso": 4, "sinais": ["https?://", "\\bwww\\.", "\\bbit\\.ly\\b", "\\b[a-z0-9-]+\\.(com|net|xyz|shop|site|online|br)\\b"]}, {"id": "outro_canal", "titulo": "Pede para falar só por outro canal", "explica": "Mandar o cliente para Telegram, direct ou outro número dificulta denúncia e rastreio.", "peso": 3, "sinais": ["s[óo]\\s*(pelo|no|por)\\s*(telegram|insta|instagram|direct|dm|outro n[úu]mero)", "\\btelegram\\b"]}, {"id": "pede_dados_sensiveis", "titulo": "Pede senha, código, cartão ou documentos", "explica": "Nenhum serviço de bairro precisa da sua senha, do código que chega por SMS ou dos dados do cartão.", "peso": 6, "sinais": ["\\bsenha\\b", "c[óo]digo (de verifica[çc][ãa]o|que chegar|do whats|sms)", "(n[úu]mero|dados) do cart[ãa]o", "envi[ae] (seu |o )?(cpf|rg|documento|foto do documento)", "\\btoken\\b"]}, {"id": "dinheiro_facil", "titulo": "Promessa de dinheiro fácil ou investimento", "explica": "Renda extra garantida, investimento com lucro certo e cotas são clássicos de pirâmide e golpe.", "peso": 5, "sinais": ["renda extra", "ganhe dinheiro", "lucro garantido", "rendimento (garantido|di[áa]rio)", "\\binvestimento\\b", "\\bpir[âa]mide\\b", "\\bcotas?\\b.*\\b(lucro|retorno)"]}, {"id": "emprestimo", "titulo": "Empréstimo ou crédito fácil", "explica": "Crédito \"sem consulta\" pedindo taxa adiantada é golpe frequente.", "peso": 5, "sinais": ["empr[ée]stimo", "cr[ée]dito (f[áa]cil|r[áa]pido|aprovado)", "sem consulta (ao )?(spc|serasa)", "nome sujo"]}, {"id": "taxa_antecipada", "titulo": "Taxa de liberação, frete ou cadastro antecipados", "explica": "Cobrar \"taxa de liberação\", \"frete antecipado\" ou \"cadastro\" para entregar algo é golpe conhecido.", "peso": 4, "sinais": ["taxa (de )?(libera[çc][ãa]o|cadastro|ades[ãa]o|reserva)", "frete (antecipad|pago antes)"]}, {"id": "orgao_oficial", "titulo": "Se passa por órgão oficial ou empresa grande", "explica": "Usar nome de governo, Receita, Detran, Correios ou banco para dar credibilidade é tática de golpe.", "peso": 4, "sinais": ["\\b(receita federal|detran|correios|gov\\.br|governo federal|inss|caixa econ[ôo]mica)\\b"]}, {"id": "sorteio_premio", "titulo": "Sorteio, prêmio ou brinde que exige pagamento", "explica": "\"Você ganhou\" seguido de pedido de pagamento ou dados é golpe.", "peso": 3, "sinais": ["\\bsorteio\\b", "voc[êe] (foi sorteado|ganhou)", "\\bpr[êe]mio\\b"]}, {"id": "urgencia", "titulo": "Pressão por urgência", "explica": "\"Só hoje\", \"últimas vagas\" e \"corre\" servem para a pessoa não pensar antes de pagar.", "peso": 2, "sinais": ["s[óo] hoje", "[úu]ltimas? (unidades|vagas)", "promo[çc][ãa]o rel[âa]mpago", "garanta j[áa]", "\\bcorre\\b"]}, {"id": "eletronico_barato", "titulo": "Eletrônico caro por preço muito baixo", "explica": "Celular, videogame ou notebook muito abaixo do mercado é a isca mais comum de golpe de venda.", "peso": 5, "sinais": ["\\b(iphone|playstation|ps5|xbox|notebook|macbook|galaxy s\\d+|smart ?tv)\\b"]}, {"id": "ilegal", "titulo": "Produto ou serviço que não pode ser vendido", "explica": "Remédio sem receita, anabolizante, apostas e armas não podem ser oferecidos.", "peso": 6, "sinais": ["sem receita", "anabolizante", "rem[ée]dio (para|pra) emagrecer", "\\b(bet|apostas?)\\b", "\\barma(s)?\\b", "\\bmuni[çc][ãa]o\\b"]}, {"id": "garantia_impossivel", "titulo": "Promessa impossível", "explica": "\"Resultado garantido\", \"cura\" ou \"100% garantido\" costumam esconder enganação.", "peso": 2, "sinais": ["100 ?% garantid", "resultado garantido", "\\bcura\\b"]}, {"id": "sinal_encomenda", "titulo": "Sinal em encomenda", "explica": "Sinal pode ser normal em encomendas. Mesmo assim: valor combinado por escrito, comprovante e Pix no nome do comerciante.", "peso": 1, "sinais": ["\\bsinal\\b", "\\bentrada de\\b", "\\b50 ?%\\s*(antes|adiantad|na encomenda)"]}], "precoTipico": {"eletricista": 80, "encanador": 80, "marmita": 18, "bolos": 12, "beleza": 25, "costura": 15, "limpeza": 120, "bazar": 10, "artesanato": 15, "pet": 30, "aulas": 40, "reparos": 60, "outros": 20}, "dicas": {"casa": "Combine o preço antes e prefira pagar só depois do serviço feito. Desconfie de quem pede o valor todo adiantado.", "encomenda": "Em encomendas, um sinal pode ser normal: combine o valor por escrito, peça comprovante e confira se o Pix vai para o nome do comerciante.", "bazar": "Prefira ver a peça antes de pagar e combine a retirada num lugar movimentado.", "aulas": "Combine uma aula experimental e evite pagar pacotes longos de uma vez.", "geral": "O Vitrine nunca pede senha, código de verificação ou dados do cartão. Desconfie de quem pedir."}, "tipoDica": {"eletricista": "casa", "encanador": "casa", "reparos": "casa", "limpeza": "casa", "beleza": "casa", "pet": "casa", "bolos": "encomenda", "marmita": "encomenda", "artesanato": "encomenda", "costura": "encomenda", "bazar": "bazar", "aulas": "aulas", "outros": "geral"}};

const RX = BASE.padroes.map(p => ({ ...p, rx: p.sinais.map(s => new RegExp(s, "i")) }));

function trechoInteiro(t, m) {
  let a = m.index, b = m.index + m[0].length; const L = /[\p{L}\p{N}%]/u;
  while (a > 0 && L.test(t[a - 1])) a--; while (b < t.length && L.test(t[b])) b++;
  return t.slice(a, b).trim();
}

function normaliza(t) { return String(t || "").toLowerCase(); }

// Checagem por regras: devolve { nivel, pontos, motivos:[{id,titulo,explica,trecho}] }
function checarRisco(v, textoExtra) {
  const itens = Array.isArray(v.itens) ? v.itens : [];
  const texto = [v.nome, v.desc, ...itens.map(i => i.nome), textoExtra].filter(Boolean).join(" \n ");
  const motivos = [];
  let pontos = 0;
  for (const p of RX) {
    const m = p.rx.map(r => texto.match(r)).find(Boolean);
    if (m) { motivos.push({ id: p.id, titulo: p.titulo, explica: p.explica, trecho: trechoInteiro(texto, m) }); pontos += p.peso; }
  }
  const tipico = BASE.precoTipico[v.cat] || BASE.precoTipico.outros;
  const precos = itens.map(i => Number(i.preco)).filter(n => n > 0);
  const menor = precos.length ? Math.min(...precos) : 0;
  if (menor && menor < tipico * 0.3) {
    motivos.push({ id: "preco_bom_demais", titulo: "Preço muito abaixo do bairro", explica: `O menor preço (R$ ${menor}) está bem abaixo do comum para esta categoria no bairro (a partir de R$ ${tipico}). Preço bom demais é a isca mais usada em golpes.`, trecho: "R$ " + menor });
    pontos += 3;
  }
  const eletronico = motivos.find(m => m.id === "eletronico_barato");
  if (eletronico && !(menor && menor < 1000)) { pontos -= 5; motivos.splice(motivos.indexOf(eletronico), 1); }
  const nivel = pontos >= 6 ? "alto" : pontos >= 3 ? "medio" : "baixo";
  return { nivel, pontos, motivos };
}

// "Recuperação" do RAG: os padrões mais parecidos com o texto da vitrine, para mandar à IA.
function padroesRelevantes(texto, k = 6) {
  const t = normaliza(texto);
  const pont = RX.map(p => {
    let s = p.rx.some(r => r.test(t)) ? 10 : 0;
    for (const w of normaliza(p.titulo + " " + p.explica).split(/\W+/)) if (w.length > 4 && t.includes(w)) s += 1;
    return { p, s };
  }).sort((a, b) => b.s - a.s);
  const escolhidos = pont.slice(0, k).map(x => x.p);
  for (const fixo of ["pagamento_integral_antecipado", "pede_dados_sensiveis"])
    if (!escolhidos.find(p => p.id === fixo)) escolhidos.push(RX.find(p => p.id === fixo));
  return escolhidos.map(p => ({ id: p.id, titulo: p.titulo, explica: p.explica }));
}

module.exports = { BASE, checarRisco, padroesRelevantes };
