// Vitrine · lista as vitrines de quem entrou com o Google (inclusive as tiradas do mapa).
const { configurado, banco, usuarioDoToken, diagnosticar } = require("./_supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ erro: "Use GET" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  const u = await usuarioDoToken(req);
  if (!u) return res.status(401).json({ erro: "Entre com o Google para ver suas vitrines" });
  try {
    const linhas = await banco(`vitrines?select=id,dados,foto_url,criada_em,oculta&dono_id=eq.${u.id}&order=criada_em.desc&limit=50`);
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).json({ email: u.email, vitrines: linhas || [] });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui ler o banco", motivo: diagnosticar(e) });
  }
};
