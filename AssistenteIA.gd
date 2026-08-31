extends Node
class_name AssistenteIA

## AssistenteIA.gd - Lógica do Conselheiro Virtual da Presidência
## Analisa estatísticas do governo, detecta crises e simula o impacto de decisões políticas.

# Base de conhecimento de ações e simulação de impactos
var catalogo_acoes: Dictionary = {
	"Investir na Saúde": {
		"custo": 150.0,
		"setor": "Saúde",
		"impacto": 20.0,
		"pros": "Reforma hospitais, reduz filas no SUS e eleva o bem-estar (+20 na Saúde).",
		"contras": "Retira R$ 150.00 do Tesouro Nacional."
	},
	"Construir Escolas": {
		"custo": 120.0,
		"setor": "Educação",
		"impacto": 18.0,
		"pros": "Expande o ensino público, valoriza professores e capacita jovens (+18 na Educação).",
		"contras": "Investimento imediato de R$ 120.00 das reservas do Estado."
	},
	"Incentivo Fiscal Economia": {
		"custo": 200.0,
		"setor": "Economia",
		"impacto": 25.0,
		"pros": "Reduz impostos industriais, estimula empregos e atrai capital (+25 na Economia).",
		"contras": "Alto custo imediato de R$ 200.00 para o caixa do país."
	},
	"Reforçar Policiamento": {
		"custo": 100.0,
		"setor": "Segurança",
		"impacto": 15.0,
		"pros": "Aumenta o efetivo de segurança e combate o crime urbano (+15 na Segurança).",
		"contras": "Custa R$ 100.00 em equipamentos e salários."
	}
}

## Analisa o estado atual do governo e retorna pareceres e alertas urgentes.
func analisar_estado_governo(game_mgr: Node) -> Dictionary:
	if not game_mgr or not game_mgr.has_method("obter_estado"):
		push_error("AssistenteIA: GameManager nulo ou inválido passado para análise.")
		return {"parecer_geral": "Erro ao conectar ao GameManager.", "alertas": []}

	var estado: Dictionary = game_mgr.obter_estado()
	var alertas: Array[String] = []
	var setores_em_crise: Array[String] = []

	var setores: Dictionary = {
		"Economia": estado.get("economia", 0.0),
		"Saúde": estado.get("saude", 0.0),
		"Educação": estado.get("educacao", 0.0),
		"Segurança": estado.get("seguranca", 0.0)
	}

	# Verificação de setores em estado crítico (abaixo de 30)
	for nome_setor in setores.keys():
		var valor: float = setores[nome_setor]
		if valor < 30.0:
			setores_em_crise.append(nome_setor)
			alertas.append("🚨 CRISE CRÍTICA: O setor de %s está em %.1f%% (abaixo do nível de segurança de 30%%)!" % [nome_setor, valor])
			if game_mgr.has_signal("crise_detectada"):
				game_mgr.emit_signal("crise_detectada", nome_setor, valor)

	# Alerta de Tesouro Nacional baixo
	var tesouro: float = estado.get("tesouro_nacional", 0.0)
	if tesouro < 150.0:
		alertas.append("⚠️ RISCO FISCAL: Tesouro em nível de reserva baixo (R$ %.2f)!" % tesouro)

	# Alerta de Aprovação Popular baixa
	var aprovacao: float = estado.get("aprovacao_popular", 0.0)
	if aprovacao < 40.0:
		alertas.append("📉 DESCONTENTAMENTO: Aprovação popular em nível de risco (%.1f%%). Aumente a prioridade aos setores sociais." % aprovacao)

	# Síntese do parecer da IA
	var parecer_geral: String = ""
	if setores_em_crise.size() > 0:
		parecer_geral = "🚨 ATENÇÃO EXCELÊNCIA! Há %d setor(es) em situação de emergência. Aja com urgência!" % setores_em_crise.size()
	elif aprovacao >= 70.0:
		parecer_geral = "🌟 EXCELENTE GOVERNANÇA! O país está próspero e a aprovação popular é elevada."
	else:
		parecer_geral = "📊 GESTÃO SOB CONTROLE: Estabilidade mantida, mas equilibre os setores mais fragilizados."

	return {
		"parecer_geral": parecer_geral,
		"alertas": alertas,
		"setores_em_crise": setores_em_crise
	}

## Projeta os prós e contras de uma ação política antes do jogador confirmar o clique.
func simular_impacto(acao_nome: String) -> String:
	if not catalogo_acoes.has(acao_nome):
		return "ℹ️ AÇÃO NÃO REGISTRADA: Sem dados de simulação de IA para '%s'." % acao_nome

	var acao: Dictionary = catalogo_acoes[acao_nome]
	var resumo: String = "🔮 [PROJEÇÃO DA IA - PROPOSTA: %s]\n" % acao_nome.to_upper()
	resumo += "💰 Custo Financeiro: R$ %.2f\n" % acao["custo"]
	resumo += "📈 Setor Beneficiado: %s (+%.1f pontos)\n" % [acao["setor"], acao["impacto"]]
	resumo += "✅ Vantagem: %s\n" % acao["pros"]
	resumo += "❌ Impacto Negativo: %s" % acao["contras"]
	return resumo
