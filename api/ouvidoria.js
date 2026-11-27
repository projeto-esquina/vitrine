// Vitrine · painel de moderação: lista e resolve denúncias e manifestações. Precisa de MODERACAO_SENHA.
// A senha vai no corpo do POST (nunca no endereço), para não aparecer em históricos e logs.
const { configurado, banco, excedeu, ipDe, corpo, senhaConfere, diagnosticar } = require("./_supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Use POST" });
  if (!configurado()) return res.status(503).json({ erro: "Supabase ainda não configurado" });
  if (excedeu("ouv:" + ipDe(req), 60, 10 * 60 * 1000)) return res.status(429).json({ erro: "Muitas tentativas" });
  let b;
  try { b = corpo(req); } catch (e) { return res.status(400).json({ erro: "Pedido inválido" }); }
  if (!senhaConfere(b.senha)) return res.status(401).json({ erro: "Senha errada" });
  res.setHeader("Cache-Control", "private, no-store");
  try {
    if (b.acao === "resolver") {
      const id = Number(b.id), status = ["resolvida", "arquivada", "aberta"].includes(b.status) ? b.status : null;
      if (!Number.isInteger(id) || !status) return res.status(400).json({ erro: "Pedido inválido" });
      await banco(`manifestacoes?id=eq.${id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status }) });
      return res.status(200).json({ ok: true });
    }
    if (b.acao === "restaurar") {
      const vid = String(b.vitrine_id || "");
      if (!/^v[a-z0-9]{4,20}$/.test(vid)) return res.status(400).json({ erro: "Vitrine inválida" });
      await banco(`vitrines?id=eq.${vid}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ oculta: false }) });
      await banco(`manifestacoes?vitrine_id=eq.${vid}&tipo=eq.denuncia&status=eq.aberta`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "arquivada" }) });
      return res.status(200).json({ ok: true });
    }
    const itens = await banco("manifestacoes?select=id,protocolo,tipo,vitrine_id,motivo,mensagem,contato,status,criada_em,vitrine:vitrines(dados,oculta)&order=criada_em.desc&limit=150");
    return res.status(200).json({ itens: (itens || []).map(m => ({
      id: m.id, protocolo: m.protocolo, tipo: m.tipo, vitrine_id: m.vitrine_id, motivo: m.motivo, mensagem: m.mensagem,
      contato: m.contato, status: m.status, criada_em: m.criada_em,
      vitrine_nome: m.vitrine && m.vitrine.dados ? m.vitrine.dados.nome : null, vitrine_oculta: m.vitrine ? !!m.vitrine.oculta : null,
    })) });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ erro: "Não consegui falar com o banco", motivo: diagnosticar(e) });
  }
};
