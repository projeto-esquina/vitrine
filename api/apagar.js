// Vitrine · tira uma vitrine do mapa. Precisa da senha MODERACAO_SENHA (moderação do grupo)
// ou de login com o Google como dono da vitrine.
// A vitrine não é apagada do banco: fica marcada como oculta, e dá para voltar atrás no Supabase.
const crypto = require("crypto");
const { configurado, banco, excedeu, ipDe, corpo, usuarioDoToken, senhaConfere } = require("./_supabase");


module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  if (excedeu("mod:" + ipDe(req), 30, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas tentativas" });

  let b;
  try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
  const id = String(b.id || "");
  if (!/^v[a-z0-9]{4,20}$/.test(id)) return res.status(400).json({ erro: "Vitrine inválida" });
  // Pode tirar do mapa: o grupo (com a senha) ou o próprio dono da vitrine (logado com o Google).
  if (!senhaConfere(b.senha)) {
    const u = await usuarioDoToken(req);
    if (!u) return res.status(401).json({ erro: "Senha errada" });
    try {
      const linhas = await banco(`vitrines?select=dono_id&id=eq.${id}`);
      if (!linhas || !linhas[0] || linhas[0].dono_id !== u.id) return res.status(403).json({ erro: "Essa vitrine não é sua" });
    } catch (e) { console.error(e); return res.status(502).json({ erro: "Não consegui falar com o banco" }); }
  }

  try {
    await banco(`vitrines?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ oculta: true }) });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui falar com o banco" });
  }
};
