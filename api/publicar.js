// Vitrine · grava uma vitrine nova no Supabase, para todo mundo ver no mapa e no telão.
const crypto = require("crypto");
const { configurado, banco, enviarFoto, excedeu, ipDe, corpo, limparVitrine } = require("./_supabase");

const MAX_FOTO = 1_500_000; // tamanho máximo da foto em base64 (~1,1 MB)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  if (excedeu("pub:" + ipDe(req), 10, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas vitrines seguidas, tente em alguns minutos" });

  let b;
  try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
  const dados = limparVitrine(b.vitrine || {});
  if (!dados) return res.status(400).json({ erro: "A vitrine precisa de pelo menos um item com preço" });

  const idPedido = String((b.vitrine || {}).id || "");
  const id = /^v[a-z0-9]{4,20}$/.test(idPedido) ? idPedido : "v" + crypto.randomBytes(6).toString("hex");
  const token = crypto.randomBytes(16).toString("hex");

  try {
    let foto_url = null;
    const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.foto || ""));
    if (m && m[3].length <= MAX_FOTO) {
      const ext = m[2] === "jpeg" ? "jpg" : m[2];
      foto_url = await enviarFoto(`${id}-${crypto.randomBytes(3).toString("hex")}.${ext}`, Buffer.from(m[3], "base64"), m[1]);
    }
    await banco("vitrines", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ id, dados, foto_url, token_edicao: token }),
    });
    return res.status(200).json({ id, foto_url, token });
  } catch (e) {
    console.error(e);
    if (String(e.message).includes("23505")) return res.status(409).json({ erro: "Essa vitrine já foi publicada" });
    return res.status(502).json({ erro: "Não consegui gravar no banco" });
  }
};
