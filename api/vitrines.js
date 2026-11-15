// Vitrine · devolve as vitrines publicadas (as mais recentes primeiro) para o mapa e o telão.
const { configurado, banco } = require("./_supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ erro: "Use GET" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  try {
    const linhas = await banco("vitrines?select=id,dados,foto_url,criada_em&oculta=eq.false&order=criada_em.desc&limit=300");
    // Guarda a resposta por 5 s na Vercel: na feira, muitos celulares perguntando ao mesmo tempo viram uma consulta só.
    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=10");
    return res.status(200).json({ vitrines: linhas || [] });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui ler o banco" });
  }
};
