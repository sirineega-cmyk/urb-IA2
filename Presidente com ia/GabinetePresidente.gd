extends Control

## GabinetePresidente.gd - Script da Interface do Gabinete Presidencial
## Conecta os elementos visuais à lógica do GameManager e aos conselhos em tempo real do AssistenteIA.

# Nós da Interface (Labels de Estatísticas)
@onready var label_tesouro: Label = $VBoxContainer/Header/LabelTesouro
@onready var label_aprovacao: Label = $VBoxContainer/Header/LabelAprovacao
@onready var label_economia: Label = $VBoxContainer/StatsGrid/EconomiaBox/Value
@onready var label_saude: Label = $VBoxContainer/StatsGrid/SaudeBox/Value
@onready var label_educacao: Label = $VBoxContainer/StatsGrid/EducacaoBox/Value
@onready var label_seguranca: Label = $VBoxContainer/StatsGrid/SegurancaBox/Value

# Janela de Texto da IA e Controle de Turnos
@onready var janela_ia: RichTextLabel = $VBoxContainer/IaPanel/JanelaTextoIA
@onready var btn_fim_turno: Button = $VBoxContainer/Footer/BtnFimTurno

# Botões de Ação Política
@onready var btn_saude: Button = $VBoxContainer/ActionsGrid/BtnSaude
@onready var btn_educacao: Button = $VBoxContainer/ActionsGrid/BtnEducacao
@onready var btn_economia: Button = $VBoxContainer/ActionsGrid/BtnEconomia
@onready var btn_seguranca: Button = $VBoxContainer/ActionsGrid/BtnSeguranca

# Instância local do Assistente de IA
var assistente_ia: AssistenteIA = null

func _ready() -> void:
	# Inicializa a instância da IA
	assistente_ia = AssistenteIA.new()
	add_child(assistente_ia)

	# Conecta aos sinais do GameManager Autoload
	if GameManager:
		GameManager.estado_alterado.connect(_on_estado_alterado)
		GameManager.relatorio_ia_enviado.connect(_on_relatorio_ia_enviado)
		# Carrega os valores iniciais
		_on_estado_alterado(GameManager.obter_estado())
	else:
		push_error("GabinetePresidente: Autoload GameManager não foi encontrado no projeto.")

	# Configura conexões de Hover e Clique para cada botão de ação
	_configurar_botao_acao(btn_saude, "Investir na Saúde", 150.0, "Saúde", 20.0)
	_configurar_botao_acao(btn_educacao, "Construir Escolas", 120.0, "Educação", 18.0)
	_configurar_botao_acao(btn_economia, "Incentivo Fiscal Economia", 200.0, "Economia", 25.0)
	_configurar_botao_acao(btn_seguranca, "Reforçar Policiamento", 100.0, "Segurança", 15.0)

	# Conecta o botão de fim de turno
	if btn_fim_turno:
		btn_fim_turno.pressed.connect(_on_btn_fim_turno_pressed)

	# Atualiza a caixa de diálogo da IA com a análise inicial
	atualizar_analise_ia()

## Configura os eventos de mouse_entered (hover), mouse_exited e pressed (clique) de um botão de ação.
func _configurar_botao_acao(btn: Button, acao_nome: String, custo: float, setor: String, impacto: float) -> void:
	if not btn:
		push_warning("GabinetePresidente: Botão para a ação '%s' é nulo." % acao_nome)
		return

	# Evento Hover: Exibe a projeção do impacto fornecida pelo AssistenteIA em tempo real
	btn.mouse_entered.connect(func():
		if assistente_ia:
			var projecao = assistente_ia.simular_impacto(acao_nome)
			_exibir_texto_ia(projecao)
	)

	# Evento Mouse Exited: Restaura o parecer geral do governo
	btn.mouse_exited.connect(func():
		atualizar_analise_ia()
	)

	# Evento Clique: Aplica a decisão política no GameManager
	btn.pressed.connect(func():
		if GameManager:
			var executado = GameManager.aplicar_decisao(custo, setor, impacto)
			if executado:
				atualizar_analise_ia()
	)

## Atualiza a interface com as estatísticas atuais do GameManager.
func _on_estado_alterado(dados: Dictionary) -> void:
	if label_tesouro:
		label_tesouro.text = "Tesouro Nacional: R$ %.2f" % dados.get("tesouro_nacional", 0.0)
	if label_aprovacao:
		label_aprovacao.text = "Aprovação Popular: %.1f%%" % dados.get("aprovacao_popular", 0.0)
	if label_economia:
		label_economia.text = "Economia: %.1f%%" % dados.get("economia", 0.0)
	if label_saude:
		label_saude.text = "Saúde: %.1f%%" % dados.get("saude", 0.0)
	if label_educacao:
		label_educacao.text = "Educação: %.1f%%" % dados.get("educacao", 0.0)
	if label_seguranca:
		label_seguranca.text = "Segurança: %.1f%%" % dados.get("seguranca", 0.0)

## Exibe mensagens enviadas diretamente por sinais da IA ou GameManager
func _on_relatorio_ia_enviado(mensagem: String) -> void:
	_exibir_texto_ia(mensagem)

## Processa o fim do turno ao clicar no botão correspondente
func _on_btn_fim_turno_pressed() -> void:
	if GameManager:
		GameManager.processar_fim_turno()
		atualizar_analise_ia()

## Analisa o estado do governo via AssistenteIA e renderiza o parecer completo na janela de texto
func atualizar_analise_ia() -> void:
	if not assistente_ia or not GameManager:
		return

	var analise: Dictionary = assistente_ia.analisar_estado_governo(GameManager)
	var texto_completo: String = "🤖 [ASSISTENTE VIRTUAL DA PRESIDÊNCIA]\n"
	texto_completo += analise["parecer_geral"] + "\n"

	var alertas: Array = analise.get("alertas", [])
	if alertas.size() > 0:
		texto_completo += "\n" + "\n".join(alertas)

	_exibir_texto_ia(texto_completo)

## Helper para injetar texto com tratamento simples de formatação na Janela de Texto da IA
func _exibir_texto_ia(texto: String) -> void:
	if janela_ia:
		janela_ia.text = texto
