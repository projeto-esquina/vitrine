// Vitrine · devolve as vitrines publicadas (as mais recentes primeiro) para o mapa e o telão.
const { configurado, banco, diagnosticar } = require("./_supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ erro: "Use GET" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  try {
    const linhas = await banco("vitrines?select=id,dados,foto_url,criada_em&oculta=eq.false&order=criada_em.desc&limit=300");
    // nota média e total de avaliações de cada vitrine (se a tabela de avaliações ainda não existir, segue sem)
    try {
      const notas = await banco("avaliacoes?select=vitrine_id,nota&oculta=eq.false&limit=10000") || [];
      const soma = {};
      notas.forEach(n => { const s = soma[n.vitrine_id] || (soma[n.vitrine_id] = { t: 0, n: 0 }); s.t += n.nota; s.n++; });
      (linhas || []).forEach(l => { const s = soma[l.id]; if (s) { l.nota = Math.round(s.t / s.n * 10) / 10; l.viz = s.n; } });
    } catch (e) { console.error("avaliacoes", e.message); }
    // Guarda a resposta por 5 s na Vercel: na feira, muitos celulares perguntando ao mesmo tempo viram uma consulta só.
    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=10");
    return res.status(200).json({ vitrines: linhas || [] });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui ler o banco", motivo: diagnosticar(e) });
  }
};
