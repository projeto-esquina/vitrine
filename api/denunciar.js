// Vitrine · recebe denúncias de vitrines e manifestações da ouvidoria.
// Cada uma ganha um número de protocolo. Com 3 denúncias abertas de pessoas diferentes,
// a vitrine sai do mapa sozinha até o grupo analisar no painel de moderação.
const crypto = require("crypto");
const { configurado, banco, excedeu, ipDe, corpo, diagnosticar, protocolo } = require("./_supabase");

const TIPOS = ["denuncia", "reclamacao", "sugestao", "elogio", "dados"];
const MOTIVOS = ["golpe", "improprio", "enganoso", "ilegal", "terceiros", "outro"];
const LIMITE_OCULTAR = 3;

const txt = (x, max) => String(x == null ? "" : x).replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  const ip = ipDe(req);
  if (excedeu("den:" + ip, 8, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas mensagens seguidas, tente em alguns minutos" });

  let b;
  try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
  const tipo = TIPOS.includes(b.tipo) ? b.tipo : null;
  if (!tipo) return res.status(400).json({ erro: "Tipo inválido" });
  const vitrine_id = /^v[a-z0-9]{4,20}$/.test(String(b.vitrine_id || "")) ? String(b.vitrine_id) : null;
  const motivo = tipo === "denuncia" ? (MOTIVOS.includes(b.motivo) ? b.motivo : null) : null;
  const mensagem = txt(b.mensagem, 1000);
  const contato = txt(b.contato, 120) || null;
  if (tipo === "denuncia" && !motivo) return res.status(400).json({ erro: "Escolha o motivo da denúncia" });
  if (tipo !== "denuncia" && mensagem.length < 5) return res.status(400).json({ erro: "Escreva a sua mensagem" });

  // Guardamos só um "resumo" do IP (hash com a senha do grupo), nunca o IP em si.
  const ip_hash = crypto.createHash("sha256").update(ip + "|" + String(process.env.MODERACAO_SENHA || "vitrine")).digest("hex").slice(0, 32);
  const prot = protocolo();
  try {
    await banco("manifestacoes", {
      method: "POST", headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ protocolo: prot, tipo, vitrine_id, motivo, mensagem: mensagem || null, contato, ip_hash }),
    });
    let ocultada = false;
    if (tipo === "denuncia" && vitrine_id) {
      const abertas = await banco(`manifestacoes?select=ip_hash&tipo=eq.denuncia&status=eq.aberta&vitrine_id=eq.${vitrine_id}`);
      const pessoas = new Set((abertas || []).map(r => r.ip_hash)).size;
      if (pessoas >= LIMITE_OCULTAR) {
        await banco(`vitrines?id=eq.${vitrine_id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ oculta: true }) });
        ocultada = true;
      }
    }
    return res.status(200).json({ protocolo: prot, ocultada });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui registrar agora", motivo: diagnosticar(e) });
  }
};
