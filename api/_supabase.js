// Vitrine · peças comuns das rotas que falam com o Supabase.
// Arquivos que começam com "_" não viram endereço na Vercel: este só é usado pelas outras rotas.
// Só o servidor fala com o banco, com a chave secreta. O navegador nunca vê essa chave.

const URL_BASE = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const CHAVE = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const CATEGORIAS = ["eletricista", "encanador", "marmita", "bolos", "beleza", "costura", "limpeza",
  "bazar", "artesanato", "pet", "aulas", "reparos", "outros"];

function configurado() {
  return Boolean(URL_BASE && CHAVE);
}

// Chaves novas do Supabase (sb_secret_...) vão só no cabeçalho apikey.
// Chaves antigas (service_role, um JWT que começa com eyJ) também vão como Bearer.
function cabecalhos(extra = {}) {
  const h = { apikey: CHAVE, ...extra };
  if (CHAVE.startsWith("eyJ")) h.Authorization = "Bearer " + CHAVE;
  return h;
}

async function banco(caminho, opcoes = {}) {
  const r = await fetch(`${URL_BASE}/rest/v1/${caminho}`, {
    ...opcoes,
    headers: cabecalhos({ "Content-Type": "application/json", ...(opcoes.headers || {}) }),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

async function enviarFoto(nome, buffer, tipo) {
  const r = await fetch(`${URL_BASE}/storage/v1/object/fotos/${nome}`, {
    method: "POST",
    headers: cabecalhos({ "Content-Type": tipo, "x-upsert": "true", "cache-control": "31536000" }),
    body: buffer,
  });
  if (!r.ok) throw new Error(`Storage ${r.status}: ${await r.text()}`);
  return `${URL_BASE}/storage/v1/object/public/fotos/${nome}`;
}

// Limite simples por IP (cada instância da Vercel conta a sua parte: é aproximado).
const contagens = new Map();
function excedeu(chave, limite, janelaMs) {
  const agora = Date.now();
  const r = contagens.get(chave) || { n: 0, desde: agora };
  if (agora - r.desde > janelaMs) { r.n = 0; r.desde = agora; }
  r.n += 1;
  contagens.set(chave, r);
  return r.n > limite;
}
function ipDe(req) {
  return String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
}
function corpo(req) {
  return typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
}

// Limpa a vitrine vinda do navegador: só os campos conhecidos, com tamanho máximo.
function limparVitrine(v) {
  const txt = (x, max) => String(x == null ? "" : x).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
  const num = (x, min, max, padrao) => { const n = Number(x); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : padrao; };
  const itens = (Array.isArray(v.itens) ? v.itens : []).slice(0, 8)
    .map(i => ({ nome: txt(i && i.nome, 60), preco: Math.round(num(i && i.preco, 0, 100000, 0) * 100) / 100 }))
    .filter(i => i.nome && i.preco > 0);
  if (!itens.length) return null;
  return {
    nome: txt(v.nome, 60) || "Sem nome",
    cat: CATEGORIAS.includes(v.cat) ? v.cat : "outros",
    desc: txt(v.desc, 300),
    regiao: txt(v.regiao, 60),
    itens,
    x: Math.round(num(v.x, 0, 1000, 500)),
    y: Math.round(num(v.y, 0, 640, 320)),
    zap: String(v.zap || "").replace(/\D/g, "").slice(0, 15),
    hoje: v.hoje === true,
    storyTit: txt(v.storyTit, 40) || null,
    storySub: txt(v.storySub, 60) || null,
  };
}

module.exports = { configurado, banco, enviarFoto, excedeu, ipDe, corpo, limparVitrine };
