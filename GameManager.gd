extends Node

## GameManager.gd - Gerenciador Central de Estado do Governo (Singleton / Autoload)
## Responsável por armazenar as estatísticas do país, processar decisões políticas e notificar a UI e a IA.

# Sinais para atualização da UI e comunicação com o Assistente de IA
signal estado_alterado(dados_governo: Dictionary)
signal relatorio_ia_enviado(mensagem: String)
signal crise_detectada(setor: String, valor: float)
signal turno_finalizado(turno_atual: int)

# Indicadores do Governo
# Tesouro Nacional (sem limite de 100)
var tesouro_nacional: float = 1000.0

# Métricas de Setores (0 a 100)
var economia: float = 50.0
var saude: float = 50.0
var educacao: float = 50.0
var seguranca: float = 50.0

# Aprovação Popular (calculada a partir da média dos setores: 0 a 100)
var aprovacao_popular: float = 50.0

# Controle de turnos
var turno_atual: int = 1

func _ready() -> void:
	# Recalcula a aprovação inicial e emite o estado inicial do jogo
	recalcular_aprovacao_popular()
	emit_signal("estado_alterado", obter_estado())

## Aplica uma decisão política tomada pelo jogador.
## Deduz o custo do Tesouro Nacional e aplica o impacto no setor informado.
func aplicar_decisao(custo: float, setor: String, impacto: float) -> bool:
	# Validação de Tesouro disponível
	if tesouro_nacional < custo:
		var aviso = "⚠️ ALERTA FINANCEIRO: Tesouro insuficiente! Custo necessário: R$ %.2f | Disponível: R$ %.2f" % [custo, tesouro_nacional]
		push_warning(aviso)
		emit_signal("relatorio_ia_enviado", aviso)
		return false

	# Valida o setor antes de alterar o Tesouro, para que uma chamada inválida
	# não deixe o estado do jogo parcialmente atualizado.
	var setor_normalizado = setor.to_lower().strip_edges()
	if setor_normalizado not in ["economia", "saude", "saúde", "educacao", "educação", "seguranca", "segurança"]:
		push_error("GameManager: Setor inválido '%s' fornecido para aplicação de decisão." % setor)
		return false

	# Deduz custo financeiro somente depois de todas as validações.
	tesouro_nacional -= custo

	# Atualiza o setor correspondente limitando os valores entre 0 e 100
	match setor_normalizado:
		"economia":
			economia = clamp(economia + impacto, 0.0, 100.0)
		"saude", "saúde":
			saude = clamp(saude + impacto, 0.0, 100.0)
		"educacao", "educação":
			educacao = clamp(educacao + impacto, 0.0, 100.0)
		"seguranca", "segurança":
			seguranca = clamp(seguranca + impacto, 0.0, 100.0)

	# Recalcula a aprovação popular e notifica os ouvintes (UI / IA)
	recalcular_aprovacao_popular()
	emit_signal("estado_alterado", obter_estado())
	return true

## Processa a virada de turno (ano de governo), recolhendo tributos e recalculando métricas.
func processar_fim_turno() -> void:
	turno_atual += 1

	# Arrecadação de tributos baseada na força da economia
	var receita_turno: float = economia * 12.5
	tesouro_nacional += receita_turno

	# Recalcula aprovação popular
	recalcular_aprovacao_popular()

	# Dispara sinais de evento
	emit_signal("turno_finalizado", turno_atual)
	emit_signal("estado_alterado", obter_estado())
	emit_signal("relatorio_ia_enviado", "📅 TURNO %d INICIADO! Receita arrecadada: R$ %.2f." % [turno_atual, receita_turno])

## Recalcula a aprovação popular com base na média dos 4 setores principais.
func recalcular_aprovacao_popular() -> void:
	aprovacao_popular = (economia + saude + educacao + seguranca) / 4.0
	aprovacao_popular = clamp(aprovacao_popular, 0.0, 100.0)

## Retorna o dicionário completo com o estado atual do governo.
func obter_estado() -> Dictionary:
	return {
		"tesouro_nacional": tesouro_nacional,
		"aprovacao_popular": aprovacao_popular,
		"economia": economia,
		"saude": saude,
		"educacao": educacao,
		"seguranca": seguranca,
		"turno_atual": turno_atual
	}
