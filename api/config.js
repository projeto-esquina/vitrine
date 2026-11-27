// Vitrine · entrega ao navegador só configurações públicas:
// - login com Google: endereço do Supabase e a chave "publishable" (feita para ficar no navegador);
// - WHATSAPP_ESTANDE: número do celular do estande, que recebe os pedidos de demonstração
//   (vitrines de exemplo e vitrines sem WhatsApp próprio).
// A chave secreta NUNCA sai daqui.
module.exports = function handler(req, res) {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const estande = String(process.env.WHATSAPP_ESTANDE || "").replace(/\D/g, "");
  const temLogin = Boolean(url && chave);
  const temEstande = estande.length >= 10 && estande.length <= 15;
  if (!temLogin && !temEstande) return res.status(503).json({ erro: "Nada configurado" });
  res.setHeader("Cache-Control", "public, s-maxage=60");
  return res.status(200).json({
    supabaseUrl: temLogin ? url : null,
    publishableKey: temLogin ? chave : null,
    whatsappEstande: temEstande ? estande : null,
  });
};
