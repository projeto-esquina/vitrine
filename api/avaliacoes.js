// Vitrine · avaliações dos vizinhos.
// GET  /api/avaliacoes?vitrine=<id>  → média, total, distribuição 1–5 e as avaliações mais recentes
// POST /api/avaliacoes { vitrine_id, nota, texto, autor, apos_contato } → grava (1 avaliação por pessoa por vitrine)
const { configurado, banco, excedeu, ipDe, corpo, hashIp, diagnosticar } = require("./_supabase");
const txt = (x, max) => String(x == null ? "" : x).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

async function resumo(vid) {
  const linhas = await banco(`avaliacoes?select=nota,texto,autor,apos_contato,criada_em&vitrine_id=eq.${vid}&oculta=eq.false&order=criada_em.desc&limit=500`) || [];
  const dist = [0, 0, 0, 0, 0];
  linhas.forEach(l => { if (l.nota >= 1 && l.nota <= 5) dist[l.nota - 1]++; });
  const total = linhas.length;
  const media = total ? Math.round(linhas.reduce((s, l) => s + l.nota, 0) / total * 10) / 10 : null;
  return { media, total, dist, itens: linhas.slice(0, 30) };
}

module.exports = async function handler(req, res) {
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  try {
    if (req.method === "GET") {
      const vid = String((req.query && req.query.vitrine) || "");
      if (!/^v[a-z0-9]{4,20}$/.test(vid)) return res.status(400).json({ erro: "Vitrine inválida" });
      res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=10");
      return res.status(200).json(await resumo(vid));
    }
    if (req.method !== "POST") return res.status(405).json({ erro: "Use GET ou POST" });
    const ip = ipDe(req);
    if (excedeu("aval:" + ip, 10, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas avaliações seguidas" });
    let b;
    try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
    const vid = String(b.vitrine_id || "");
    const nota = Number(b.nota);
    if (!/^v[a-z0-9]{4,20}$/.test(vid) || !Number.isInteger(nota) || nota < 1 || nota > 5) return res.status(400).json({ erro: "Avaliação inválida" });
    try {
      await banco("avaliacoes", {
        method: "POST", headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ vitrine_id: vid, nota, texto: txt(b.texto, 300) || null, autor: txt(b.autor, 30) || null, apos_contato: b.apos_contato === true, ip_hash: hashIp(ip) }),
      });
    } catch (e) {
      if (String(e.message).includes("23505")) return res.status(409).json({ erro: "Você já avaliou esta vitrine" });
      throw e;
    }
    return res.status(200).json(await resumo(vid));
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui falar com o banco", motivo: diagnosticar(e) });
  }
};
