// Vitrine · grava uma vitrine nova no Supabase, para todo mundo ver no mapa e no telão.
const crypto = require("crypto");
const { configurado, banco, enviarFoto, excedeu, ipDe, corpo, limparVitrine, diagnosticar, usuarioDoToken, protocolo, hashIp } = require("./_supabase");
const { checarRisco } = require("./_golpes");

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
  const dono = await usuarioDoToken(req); // quem entrou com o Google (ou null)
  // Checagem de risco: regras da base de golpes sobre o texto da vitrine e o que a IA leu na foto.
  const textoLido = String((b.vitrine || {}).textoLido || "").slice(0, 600);
  const risco = checarRisco(dados, textoLido); // o que vai ser publicado + o que aparece na foto
  const emAnalise = risco.nivel === "alto";

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
      body: JSON.stringify({ id, dados, foto_url, token_edicao: token, oculta: emAnalise, ...(dono ? { dono_id: dono.id } : {}) }),
    });
    let prot = null;
    if (emAnalise) {
      // Vai para a fila do grupo (Telão → Moderar vitrines → Denúncias e ouvidoria), sem aparecer no mapa.
      prot = protocolo();
      try {
        await banco("manifestacoes", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({
          protocolo: prot, tipo: "denuncia", vitrine_id: id, motivo: "golpe", ip_hash: hashIp("checagem-automatica"),
          mensagem: "Checagem automática ao publicar: " + risco.motivos.map(m => `${m.titulo} («${m.trecho}»)`).join("; "),
        }) });
      } catch (e) { console.error("fila de análise", e.message); }
    }
    return res.status(200).json({ id, foto_url, token, conta: dono ? dono.email : null, em_analise: emAnalise, protocolo: prot, risco: { nivel: risco.nivel, motivos: risco.motivos.map(m => ({ id: m.id, titulo: m.titulo, trecho: m.trecho })) } });
  } catch (e) {
    console.error(e);
    if (String(e.message).includes("23505")) return res.status(409).json({ erro: "Essa vitrine já foi publicada" });
    return res.status(502).json({ erro: "Não consegui gravar no banco", motivo: diagnosticar(e) });
  }
};
