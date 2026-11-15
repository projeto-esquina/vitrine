// Vitrine · tira uma vitrine do mapa (moderação do grupo). Precisa da senha MODERACAO_SENHA.
// A vitrine não é apagada do banco: fica marcada como oculta, e dá para voltar atrás no Supabase.
const crypto = require("crypto");
const { configurado, banco, excedeu, ipDe, corpo } = require("./_supabase");

function senhaConfere(dada) {
  const certa = String(process.env.MODERACAO_SENHA || "");
  const a = Buffer.from(String(dada || "")), b = Buffer.from(certa);
  return certa.length >= 6 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  if (excedeu("mod:" + ipDe(req), 30, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas tentativas" });

  let b;
  try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
  if (!senhaConfere(b.senha)) return res.status(401).json({ erro: "Senha errada" });
  const id = String(b.id || "");
  if (!/^v[a-z0-9]{4,20}$/.test(id)) return res.status(400).json({ erro: "Vitrine inválida" });

  try {
    await banco(`vitrines?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ oculta: true }) });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui falar com o banco" });
  }
};
