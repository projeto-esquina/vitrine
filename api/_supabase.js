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
  if (!r.ok) { const e = new Error(`Supabase ${r.status}: ${await r.text()}`); e.status = r.status; throw e; }
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

async function enviarFoto(nome, buffer, tipo) {
  const r = await fetch(`${URL_BASE}/storage/v1/object/fotos/${nome}`, {
    method: "POST",
    headers: cabecalhos({ "Content-Type": tipo, "x-upsert": "true", "cache-control": "31536000" }),
    body: buffer,
  });
  if (!r.ok) { const e = new Error(`Storage ${r.status}: ${await r.text()}`); e.status = r.status; throw e; }
  return `${URL_BASE}/storage/v1/object/public/fotos/${nome}`;
}

// Login com Google (Supabase Auth): confere o token que o navegador manda e devolve o usuário.
// Sem token, ou com token inválido, devolve null (o site continua funcionando sem login).
async function usuarioDoToken(req) {
  const m = /^Bearer\s+([A-Za-z0-9._-]{20,})$/.exec(String(req.headers.authorization || ""));
  if (!m || !configurado()) return null;
  try {
    const r = await fetch(`${URL_BASE}/auth/v1/user`, { headers: { apikey: CHAVE, Authorization: "Bearer " + m[1] } });
    if (!r.ok) return null;
    const u = await r.json();
    return u && typeof u.id === "string" ? { id: u.id, email: u.email || "" } : null;
  } catch (e) { return null; }
}

// Senha de moderação do grupo (variável MODERACAO_SENHA), comparada em tempo constante.
function senhaConfere(dada) {
  const certa = String(process.env.MODERACAO_SENHA || "");
  const a = Buffer.from(String(dada || "")), b = Buffer.from(certa);
  return certa.length >= 6 && a.length === b.length && require("crypto").timingSafeEqual(a, b);
}

// Resumo do IP (hash com a senha do grupo): serve para contar pessoas diferentes sem guardar o IP.
function hashIp(ip) {
  return require("crypto").createHash("sha256").update(String(ip) + "|" + String(process.env.MODERACAO_SENHA || "vitrine")).digest("hex").slice(0, 32);
}

// Número de protocolo das manifestações: VT-AAMMDD-XXXXX (horário de Brasília).
function protocolo() {
  const d = new Date(Date.now() - 3 * 3600 * 1000);
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let cod = "";
  for (const b of require("crypto").randomBytes(5)) cod += letras[b % letras.length];
  return `VT-${d.toISOString().slice(2, 10).replace(/-/g, "")}-${cod}`;
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
    perguntas: (Array.isArray(v.perguntas) ? v.perguntas : []).map(p => txt(p, 90)).filter(Boolean).slice(0, 3),
  };
}

// Traduz a recusa do Supabase numa dica (sem mostrar chaves nem dados).
function diagnosticar(e) {
  const m = String(e && e.message || ""), st = e && e.status;
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(URL_BASE))
    return "SUPABASE_URL parece errada: use só a Project URL, no formato https://xxxx.supabase.co (sem /rest/v1 e sem o endereço do painel)";
  if (/fetch failed|ENOTFOUND|EAI_AGAIN/i.test(m))
    return "Não achei o servidor do Supabase: confira a SUPABASE_URL ou se o projeto está pausado";
  if (/42501|permission denied/i.test(m))
    return "Sem permissão na tabela: rode de novo o supabase.sql (ele dá a permissão ao servidor)";
  if (st === 401 || st === 403 || /Invalid API key|No API key|apikey/i.test(m))
    return "Chave recusada: use a Secret key (sb_secret_...) ou a service_role em SUPABASE_SECRET_KEY, não a publishable/anon";
  if (/PGRST205|does not exist|schema cache/i.test(m))
    return "Tabela vitrines não encontrada: rode o supabase.sql no SQL Editor do Supabase";
  if (/PGRST106|schema must be one of/i.test(m))
    return "A Data API do Supabase não expõe o schema public: ative em Project Settings > Data API";
  return "Supabase respondeu " + (st || "com erro") + ": veja os Logs da Vercel";
}

module.exports = { protocolo, hashIp, senhaConfere, usuarioDoToken, diagnosticar, configurado, banco, enviarFoto, excedeu, ipDe, corpo, limparVitrine };
