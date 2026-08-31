/**
 * Banco de dados de crises para "O Dilema do Presidente".
 * Organizado por rodadas (anos) e pastas ministeriais.
 */
const CRISES_DATA = {
  1: { // Rodada 1 / Ano 1
    saude: {
      ministro: "Dra. Helena Carvalho",
      cargo: "Ministra da Saúde",
      titulo: "Ameaça de Nova Pandemia",
      descricao: "Um novo vírus respiratório altamente contagioso está se espalhando rapidamente pelo mundo. Casos suspeitos começaram a surgir nas grandes capitais brasileiras. Precisamos agir rápido para conter o contágio antes que o sistema de saúde colapse.",
      opcoes: [
        {
          id: "A",
          texto: "Lockdown estrito e subsídios emergenciais de saúde.",
          custo: 40,
          detalhes: "Decretar quarentena nacional, construir hospitais de campanha e fornecer auxílio financeiro à população isolada.",
          impacto: { saude: 30, satisfacao: 15, economia: -20, orcamento: -40 },
          consequencia: "A pandemia foi controlada rapidamente e vidas foram salvas, mas o fechamento do comércio gerou uma recessão e um grande rombo nos cofres públicos.",
          dialogos: {
            imprensa: "MANCHETE: 'Governo age com coragem e salva milhares de vidas, mas enterra as contas públicas.'",
            empresarios: "Empresários: 'Fechar o comércio é uma irresponsabilidade fiscal! As empresas vão falir e teremos demissões em massa!'",
            trabalhadores: "Trabalhadores: 'Graças ao auxílio emergencial conseguimos nos proteger. Uma decisão humana e necessária!'",
            governadores: "Governadores: 'Apoiamos a medida federal. Precisávamos de suporte para conter os hospitais locais.'",
            ministros: "Ministra da Saúde: 'Presidente, salvamos o país de uma catástrofe humanitária. O preço econômico foi alto, mas a vida não tem preço.'"
          }
        },
        {
          id: "B",
          texto: "Restrições parciais e testagem em massa.",
          custo: 20,
          detalhes: "Manter o comércio aberto com máscaras e distanciamento, investir em testes rápidos e rastreamento de contatos.",
          impacto: { saude: 15, satisfacao: 5, economia: -5, orcamento: -20 },
          consequencia: "O vírus se espalhou de forma moderada. Evitamos um colapso total da economia e da saúde, mas o número de mortes causou desconforto social.",
          dialogos: {
            imprensa: "MANCHETE: 'Caminho do meio: Governo evita lockdown, mas contágio continua subindo de forma preocupante.'",
            empresarios: "Empresários: 'Comércio funcionando com restrições é difícil, mas aceitável. Pelo menos evitamos a falência geral.'",
            trabalhadores: "Trabalhadores: 'Ainda nos sentimos inseguros no transporte público. O governo deveria ter dado mais suporte financeiro.'",
            governadores: "Governadores: 'Nossos leitos estão no limite, mas estamos conseguindo gerenciar com a testagem ampliada.'",
            ministros: "Ministra da Saúde: 'Conseguimos mitigar a crise, presidente. Não foi a contenção ideal, mas foi o que o nosso orçamento permitiu.'"
          }
        },
        {
          id: "C",
          texto: "Imunidade de rebanho e livre mercado.",
          custo: 0,
          detalhes: "Manter a economia 100% aberta, sem restrições obrigatórias. Focar apenas em campanhas de conscientização básica.",
          impacto: { saude: -25, satisfacao: -20, economia: 15, orcamento: 0 },
          consequencia: "A economia cresceu rapidamente no curto prazo, mas os hospitais colapsaram com filas intermináveis, gerando revolta popular e crise na saúde pública.",
          dialogos: {
            imprensa: "MANCHETE: 'Caos na saúde: Hospitais sem oxigênio enquanto o governo ignora a ciência para proteger o PIB.'",
            empresarios: "Empresários: 'Excelente decisão! O comércio livre garante empregos e a roda da economia não pode parar por causa de um vírus.'",
            trabalhadores: "Trabalhadores: 'Nossos familiares estão morrendo nas filas dos hospitais! É um descaso total com a vida do povo.'",
            governadores: "Governadores: 'Os estados estão declarando calamidade sozinhos. O governo federal nos abandonou na pior crise.'",
            ministros: "Ministra da Saúde: 'Presidente... Esta decisão causou uma tragédia em nossos hospitais. O preço social está sendo doloroso de assistir.'"
          }
        }
      ]
    },
    educacao: {
      ministro: "Prof. Marcos Souza",
      cargo: "Ministro da Educação",
      titulo: "Infraestrutura Escolar Sucateada",
      descricao: "Mais de 40% das escolas públicas do país apresentam sérios problemas estruturais: telhados desabando, falta de saneamento básico e laboratórios de informática inexistentes. A comunidade escolar exige reformas urgentes.",
      opcoes: [
        {
          id: "A",
          texto: "Plano Nacional de Reconstrução Escolar e Inclusão Digital.",
          custo: 35,
          detalhes: "Reconstruir as escolas físicas, instalar internet de banda larga e distribuir tablets para alunos carentes.",
          impacto: { educacao: 30, satisfacao: 15, infraestrutura: 10, orcamento: -35 },
          consequencia: "As escolas foram modernizadas e a evasão escolar caiu drasticamente. Alunos de periferias agora têm acesso à tecnologia digital.",
          dialogos: {
            imprensa: "MANCHETE: 'Revolução nas salas de aula: Governo investe no futuro das crianças, mas eleva endividamento.'",
            empresarios: "Empresários: 'Investir em educação é bom a longo prazo, mas gastar 35 bilhões de uma vez em infraestrutura física pesa no orçamento nacional.'",
            trabalhadores: "Trabalhadores: 'Pela primeira vez nossos filhos têm escolas decentes e acesso a computadores. Isso é justiça social!'",
            governadores: "Governadores: 'A parceria federal aliviou as prefeituras locais que não tinham verbas para reformas estruturais.'",
            ministros: "Ministro da Educação: 'Presidente, isso mudará a vida de uma geração. Criamos a base de um país desenvolvido.'"
          }
        },
        {
          id: "B",
          texto: "Reformas emergenciais de telhados e banheiros.",
          custo: 15,
          detalhes: "Investir apenas no reparo imediato das estruturas com risco de desabamento e nos sistemas de água e esgoto.",
          impacto: { educacao: 12, satisfacao: 5, orcamento: -15 },
          consequencia: "Evitamos acidentes físicos nas escolas e resolvemos o problema de saneamento de curto prazo, mas as salas continuam sem tecnologia ou laboratórios modernos.",
          dialogos: {
            imprensa: "MANCHETE: 'Remendo na educação: Reformas básicas resolvem infiltrações, mas deixam ensino público parado no século passado.'",
            empresarios: "Empresários: 'Uma escolha prudente. Mantém a segurança física dos alunos sem estourar o orçamento do país.'",
            trabalhadores: "Trabalhadores: 'As escolas não vão mais cair na cabeça dos nossos filhos, mas eles continuam sem computadores ou livros novos.'",
            governadores: "Governadores: 'Dá para funcionar, mas continuaremos pressionando por mais repasses para a modernização real.'",
            ministros: "Ministro da Educação: 'Apagamos os incêndios mais críticos, presidente. No entanto, o atraso educacional e tecnológico do país persiste.'"
          }
        },
        {
          id: "C",
          texto: "Parcerias Privadas e Concessões de Escolas.",
          custo: 0,
          detalhes: "Permitir que empresas privadas gerenciem a infraestrutura das escolas públicas em troca de isenções fiscais futuras e publicidade social.",
          impacto: { educacao: -5, satisfacao: -10, economia: 10, orcamento: 5 },
          consequencia: "Empresas reformaram as escolas parceiras rapidamente e o governo economizou verba, mas sindicatos protestaram contra a privatização e escolas de zonas isoladas foram ignoradas pelas empresas.",
          dialogos: {
            imprensa: "MANCHETE: 'Privatização branca? Governo entrega gestão escolar à iniciativa privada sob fortes protestos de professores.'",
            empresarios: "Empresários: 'Excelente! A eficiência do setor privado resolve o sucateamento onde o Estado falha. Menos burocracia.'",
            trabalhadores: "Trabalhadores: 'Querem lucrar em cima da escola dos nossos filhos! E as escolas pobres do interior que nenhuma empresa quis adotar?'",
            governadores: "Governadores: 'Gerou atrito com o sindicato de professores locais. Greves escolares à vista.'",
            ministros: "Ministro da Educação: 'Economizamos dinheiro e algumas escolas ficaram lindas, mas criamos uma desigualdade profunda no sistema de ensino.'"
          }
        }
      ]
    },
    seguranca: {
      ministro: "General Roberto Menezes",
      cargo: "Ministro da Segurança Pública",
      titulo: "Escalada do Crime Organizado",
      descricao: "Facções criminosas aumentaram o controle territorial nas periferias das grandes cidades, promovendo tiroteios diários e extorquindo comerciantes. A população teme sair de casa e exige ordem.",
      opcoes: [
        {
          id: "A",
          texto: "Intervenção Federal e construção de prisões de segurança máxima.",
          custo: 30,
          detalhes: "Enviar as forças federais para patrulhamento ostensivo permanente e construir novos presídios para isolar chefes de facções.",
          impacto: { seguranca: 25, satisfacao: 10, educacao: -5, orcamento: -30 },
          consequencia: "A presença policial reduziu os confrontos nas ruas e prendeu lideranças, mas os gastos foram altíssimos e houve denúncias de abuso de força.",
          dialogos: {
            imprensa: "MANCHETE: 'Força bruta: Intervenção federal estabiliza periferias, mas levanta debates sobre direitos humanos.'",
            empresarios: "Empresários: 'Comércio voltou a funcionar nas áreas liberadas. A segurança é pré-requisito para os negócios.'",
            trabalhadores: "Trabalhadores: 'Os tiroteios diminuíram, mas a polícia age de forma muito truculenta nas nossas comunidades.'",
            governadores: "Governadores: 'Agradecemos o apoio militar, mas o governo federal precisa ajudar na inteligência civil também.'",
            ministros: "Ministro da Segurança: 'Mostramos a força do Estado, presidente. Bandido agora pensa duas vezes, mas a manutenção dessas forças custará caro.'"
          }
        },
        {
          id: "B",
          texto: "Investimento em Inteligência e Polícia Investigativa.",
          custo: 15,
          detalhes: "Fortalecer a Polícia Federal e a inteligência financeira para rastrear o dinheiro das facções e as rotas de armas e drogas.",
          impacto: { seguranca: 15, satisfacao: 5, economia: 5, orcamento: -15 },
          consequencia: "Grandes esquemas de lavagem de dinheiro foram desmantelados e o tráfico perdeu armas pesadas, embora os resultados cotidianos nas ruas demorem a aparecer.",
          dialogos: {
            imprensa: "MANCHETE: 'Asfixia financeira: Polícia Federal confisca bilhões do crime, mas policiamento de rua continua deficitário.'",
            empresarios: "Empresários: 'Acertado. Combater a lavagem de dinheiro protege a economia legal de concorrência desleal.'",
            trabalhadores: "Trabalhadores: 'Ainda convivemos com assaltos diários no ponto de ônibus. A inteligência ajuda, mas precisamos de policiais na rua.'",
            governadores: "Governadores: 'Muito bom. O compartilhamento de dados de inteligência ajudou nossas polícias estaduais a realizarem prisões cirúrgicas.'",
            ministros: "Ministro da Segurança: 'É a abordagem moderna, presidente. Ferimos a estrutura financeira do crime sem disparar um único tiro nas favelas.'"
          }
        },
        {
          id: "C",
          texto: "Flexibilização do porte de armas e desregulamentação.",
          custo: 0,
          detalhes: "Facilitar a compra de armas de fogo por cidadãos comuns para autodefesa, reduzindo a burocracia policial.",
          impacto: { seguranca: -15, satisfacao: -10, economia: 10, orcamento: 0 },
          consequencia: "A venda de armas movimentou a economia do setor de defesa, mas os índices de homicídios por motivos fúteis e acidentes domésticos dispararam nas capitais.",
          dialogos: {
            imprensa: "MANCHETE: 'Faroeste moderno: Liberação de armas gera aumento de crimes violentos e mortes por brigas cotidianas.'",
            empresarios: "Empresários: 'O mercado de armamentos gerou lucros e empregos. O cidadão tem o direito de se defender e proteger seu patrimônio.'",
            trabalhadores: "Trabalhadores: 'Agora qualquer briga de trânsito vira tiroteio! Sentimo-nos muito mais inseguros nas ruas.'",
            governadores: "Governadores: 'Isso sobrecarregou nossos policiais, que agora enfrentam civis armados em ocorrências comuns de violência doméstica.'",
            ministros: "Ministro da Segurança: 'Armar a população não substitui a polícia, presidente. O resultado prático foi o aumento da letalidade geral.'"
          }
        }
      ]
    },
    economia: {
      ministro: "Dr. André Rezende",
      cargo: "Ministro da Economia",
      titulo: "Crise Hídrica e Risco de Apagão",
      descricao: "A pior seca dos últimos 50 anos esvaziou os reservatórios das usinas hidrelétricas. Há um risco iminente de apagão nacional que paralisaria as indústrias e deixaria as cidades às escuras.",
      opcoes: [
        {
          id: "A",
          texto: "Investimento emergencial em Energias Renováveis (Solar e Eólica).",
          custo: 40,
          detalhes: "Subsidiar e instalar parques solares e eólicos de construção rápida no Nordeste e apoiar a instalação de energia solar distribuída.",
          impacto: { meioambiente: 30, infraestrutura: 20, economia: -5, orcamento: -40 },
          consequencia: "Evitamos o apagão e demos um salto histórico rumo a uma matriz energética limpa, mas o rombo fiscal gerado pela urgência foi massivo.",
          dialogos: {
            imprensa: "MANCHETE: 'Transição verde acelerada: Governo investe pesado em energia limpa e afasta fantasma do apagão.'",
            empresarios: "Empresários: 'A energia solar e eólica garantem nossa produção futura. O custo público foi alto, mas a paralisação das fábricas seria pior.'",
            trabalhadores: "Trabalhadores: 'Excelente! Novas usinas geraram empregos verdes em regiões necessitadas e a luz não vai faltar.'",
            governadores: "Governadores: 'Estados do Nordeste viraram canteiros de obras. A economia regional agradece o investimento.'",
            ministros: "Ministro da Economia: 'Foi a saída ecologicamente correta, mas nossa meta fiscal para o ano foi completamente destruída.'"
          }
        },
        {
          id: "B",
          texto: "Acionar termelétricas a carvão e gás natural.",
          custo: 20,
          detalhes: "Ativar usinas termoelétricas poluentes que estavam paradas para suprir a demanda urgente de carga do sistema nacional.",
          impacto: { infraestrutura: 15, meioambiente: -15, economia: 5, orcamento: -20 },
          consequencia: "A energia foi garantida a tempo por um custo fiscal moderado, mas as emissões de carbono dispararam e a poluição do ar gerou críticas globais.",
          dialogos: {
            imprensa: "MANCHETE: 'Retrocesso ecológico: Para evitar apagão, governo liga termelétricas sujas e eleva poluição do ar.'",
            empresarios: "Empresários: 'Boa decisão. O carvão e o gás são fontes confiáveis e baratas no momento de crise. A produção não parou.'",
            trabalhadores: "Trabalhadores: 'Evitou o desemprego industrial, mas as cidades industriais estão cobertas de fuligem e fumaça tóxica.'",
            governadores: "Governadores: 'Nossos estados turísticos reclamam do impacto visual e da poluição, mas a indústria local respirou aliviada.'",
            ministros: "Ministro da Economia: 'Presidente, rasgamos nossos acordos climáticos internacionais com essa decisão. O dano ambiental foi severo.'"
          }
        },
        {
          id: "C",
          texto: "Tarifa extra na conta de luz e racionamento.",
          custo: 0,
          detalhes: "Instituir a 'Bandeira Escarlate' cobrando taxas altíssimas de quem gastar luz e forçar cortes programados de energia nas cidades.",
          impacto: { infraestrutura: -10, satisfacao: -25, economia: -15, orcamento: 5 },
          consequencia: "A população reduziu o consumo por medo da conta alta e o governo arrecadou fundos, mas o comércio perdeu vendas e a indignação popular explodiu.",
          dialogos: {
            imprensa: "MANCHETE: 'Bandeira Escarlate: Inflação da luz esmaga o poder de compra e povo sofre com apagões diários.'",
            empresarios: "Empresários: 'Os cortes programados atrapalham as escalas das fábricas e lojas. As vendas despencaram e os lucros sumiram.'",
            trabalhadores: "Trabalhadores: 'Não conseguimos pagar a conta de luz e ainda ficamos no escuro de noite! Um absurdo total!'",
            governadores: "Governadores: 'A revolta social está batendo na porta dos governadores. A população exige o fim das taxas adicionais.'",
            ministros: "Ministro da Economia: 'O caixa está salvo e evitamos o colapso físico do sistema, mas jogamos o país em uma estagflação no curto prazo.'"
          }
        }
      ]
    }
  },
  2: { // Rodada 2 / Ano 2
    saude: {
      ministro: "Dra. Helena Carvalho",
      cargo: "Ministra da Saúde",
      titulo: "Surto Histórico de Dengue e Zika",
      descricao: "Com a chegada do verão e a falta de saneamento em várias regiões, os casos de Dengue, Zika e Chikungunya explodiram. Os postos de saúde estão lotados e há falta de leitos de hidratação.",
      opcoes: [
        {
          id: "A",
          texto: "Saneamento básico em áreas críticas e vacinação em massa.",
          custo: 35,
          detalhes: "Investir na canalização de esgoto nas periferias e comprar a vacina contra a dengue para imunização nacional de crianças e jovens.",
          impacto: { saude: 25, meioambiente: 15, orcamento: -35 },
          consequencia: "O surto foi controlado e o saneamento básico removeu permanentemente focos de reprodução do mosquito, melhorando a saúde pública a longo prazo.",
          dialogos: {
            imprensa: "MANCHETE: 'Combate na raiz: Investimento em saneamento reduz doenças endêmicas e moderniza subúrbios.'",
            empresarios: "Empresários: 'Obras de saneamento movimentam construtoras locais. É um investimento alto, mas produtivo para o país.'",
            trabalhadores: "Trabalhadores: 'Finalmente água limpa e esgoto encanado na nossa rua! E nossos filhos estão vacinados contra a dengue.'",
            governadores: "Governadores: 'Excelente. A vacinação nacional reduziu a pressão sobre as UPAs municipais de forma notável.'",
            ministros: "Ministra da Saúde: 'A vacina é a melhor arma preventiva. Esta decisão salvou milhares de vidas de internações dolorosas.'"
          }
        },
        {
          id: "B",
          texto: "Fumigação emergencial (Fumacê) e tendas de hidratação.",
          custo: 15,
          detalhes: "Contratar frotas para pulverizar inseticida nas ruas e instalar tendas de atendimento rápido perto dos hospitais superlotados.",
          impacto: { saude: 12, orcamento: -15, meioambiente: -5 },
          consequencia: "Aliviamos a lotação dos hospitais no curtíssimo prazo e contivemos a nuvem de mosquitos, mas o veneno prejudica abelhas e a falta de saneamento garante novos surtos no próximo ano.",
          dialogos: {
            imprensa: "MANCHETE: 'Solução temporária: Tendas de hidratação contêm mortes por dengue, mas esgoto a céu aberto continua intocado.'",
            empresarios: "Empresários: 'Decisão pragmática. Menor custo público e resolve o pico da crise de absenteísmo nas empresas.'",
            trabalhadores: "Trabalhadores: 'O fumacê passou na rua, mas o lixo e a água parada no terreno baldio continuam lá. Ano que vem a dengue volta.'",
            governadores: "Governadores: 'Ajudou a desafogar os corredores de hospitais temporariamente. Uma ajuda bem-vinda de baixo custo.'",
            ministros: "Ministra da Saúde: 'Foi uma ação reativa rápida. Salvou o momento crítico, mas não resolveu a causa raiz ambiental.'"
          }
        },
        {
          id: "C",
          texto: "Apenas campanhas educativas e repelentes para grávidas.",
          custo: 0,
          detalhes: "Colocar anúncios na TV ensinando a limpar calhas e distribuir repelentes de baixo custo apenas para gestantes cadastradas em programas sociais.",
          impacto: { saude: -15, satisfacao: -10, orcamento: 5 },
          consequencia: "Economizamos orçamento, mas a epidemia continuou avançando, causando mortes evitáveis e grande indignação pública com a negligência estatal.",
          dialogos: {
            imprensa: "MANCHETE: 'Negligência estatal: Surto de zika avança no país enquanto governo se limita a folhetos educativos.'",
            empresarios: "Empresários: 'Gastou quase nada, o que é ótimo para conter a dívida pública. Mas as faltas no trabalho por doença aumentaram.'",
            trabalhadores: "Trabalhadores: 'Distribuir repelente para poucas pessoas não resolve! Queremos limpeza pública e médicos no posto!'",
            governadores: "Governadores: 'Os hospitais do estado estão colapsando sozinhos. Não dá para tratar dengue apenas com propaganda de TV.'",
            ministros: "Ministra da Saúde: 'Esta economia nos custará caro em leitos e licenças médicas. A prevenção educacional sozinha falhou.'"
          }
        }
      ]
    },
    educacao: {
      ministro: "Prof. Marcos Souza",
      cargo: "Ministro da Educação",
      titulo: "Fuga de Cérebros e Pesquisa Sucateada",
      descricao: "Universidades públicas estão sem verbas para bolsas de pesquisa. Cientistas e pesquisadores qualificados estão deixando o país rumo à Europa e EUA. O desenvolvimento científico nacional corre risco.",
      opcoes: [
        {
          id: "A",
          texto: "Fomento Científico Massivo e reajuste de 50% em bolsas.",
          custo: 30,
          detalhes: "Injetar verba no CNPq/CAPES, criar centros de inovação tecnológica e reajustar expressivamente as bolsas de mestrado e doutorado.",
          impacto: { educacao: 25, economia: 10, orcamento: -30 },
          consequencia: "A fuga de cérebros foi estancada. Cientistas brasileiros desenvolveram novas patentes nacionais, gerando atratividade tecnológica de longo prazo.",
          dialogos: {
            imprensa: "MANCHETE: 'Retorno da ciência: Governo investe em pesquisa e tecnologia, posicionando o país no mercado de inovação.'",
            empresarios: "Empresários: 'Investimento em tecnologia pode gerar startups e inovação de ponta para a nossa indústria nacional.'",
            trabalhadores: "Trabalhadores: 'Nossos jovens intelectuais agora podem pesquisar no Brasil em vez de lavar pratos no exterior. Orgulho nacional!'",
            governadores: "Governadores: 'As universidades federais em nossos estados receberam novos recursos, gerando empregos indiretos de alta qualificação.'",
            ministros: "Ministro da Educação: 'Presidente, valorizamos a inteligência do país. O conhecimento é a mercadoria mais valiosa deste século.'"
          }
        },
        {
          id: "B",
          texto: "Parcerias universidade-empresa e créditos para startups.",
          custo: 15,
          detalhes: "Oferecer incentivos fiscais para indústrias que financiarem laboratórios universitários públicos e bolsas específicas de pesquisa aplicada.",
          impacto: { educacao: 15, economia: 15, orcamento: -15 },
          consequencia: "A pesquisa voltada para o mercado cresceu rapidamente (engenharia, agronomia), mas as áreas básicas de ciência e humanas continuaram sem apoio.",
          dialogos: {
            imprensa: "MANCHETE: 'Ciência utilitarista: Parcerias privadas financiam tecnologia industrial, mas pesquisa básica fica sem verbas.'",
            empresarios: "Empresários: 'Perfeito! A universidade deve servir ao desenvolvimento industrial e à inovação de mercado. Dinheiro bem aplicado.'",
            trabalhadores: "Trabalhadores: 'Os cursos tecnológicos melhoraram, mas as ciências humanas e licenciaturas estão abandonadas.'",
            governadores: "Governadores: 'Pólos industriais locais estão se integrando com as faculdades. O PIB estadual ganha dinamismo.'",
            ministros: "Ministro da Educação: 'Aceleramos a pesquisa comercial, presidente. Foi um compromisso prático para salvar o orçamento.'"
          }
        },
        {
          id: "C",
          texto: "Cortar bolsas de humanas e focar em repasses básicos.",
          custo: 0,
          detalhes: "Suspender novas bolsas de pós-graduação em ciências humanas e artes, direcionando o orçamento mínimo restante para as ciências biológicas e exatas.",
          impacto: { educacao: -15, satisfacao: -15, orcamento: 10 },
          consequencia: "Economizamos verba pública e agradamos setores conservadores, mas a comunidade acadêmica entrou em greve e a produção intelectual geral despencou.",
          dialogos: {
            imprensa: "MANCHETE: 'Guerra ideológica nas federais: Corte de bolsas em humanas gera greves gerais e isolamento acadêmico.'",
            empresarios: "Empresários: 'Cortar gastos públicos é sempre bom para manter a inflação sob controle, mas a instabilidade social das greves atrapalha.'",
            trabalhadores: "Trabalhadores: 'Estão atacando as universidades! Nossos filhos nas federais estão sem aulas devido às greves!'",
            governadores: "Governadores: 'As greves nas universidades estaduais geraram dor de cabeça e protestos nas nossas capitais. Situação tensa.'",
            ministros: "Ministro da Educação: 'Esta economia gerou um clima hostil. Perdemos prestígio internacional na comunidade científica internacional.'"
          }
        }
      ]
    },
    seguranca: {
      ministro: "General Roberto Menezes",
      cargo: "Ministro da Segurança Pública",
      titulo: "Ataque Hacker à Infraestrutura",
      descricao: "Um grupo hacker internacional invadiu os servidores da rede elétrica nacional e do sistema de tráfego aéreo, exigindo um resgate milionário. A rede está operando em modo de segurança, sob alto risco de apagão digital.",
      opcoes: [
        {
          id: "A",
          texto: "Criar a Agência Nacional de Defesa Cibernética.",
          custo: 25,
          detalhes: "Investir na criação de uma agência federal integrada por militares e civis para inteligência digital, proteção de dados e cibersegurança do Estado.",
          impacto: { seguranca: 25, infraestrutura: 15, orcamento: -25 },
          consequencia: "A invasão foi neutralizada sem pagamento de resgate e a infraestrutura nacional foi blindada contra ataques futuros.",
          dialogos: {
            imprensa: "MANCHETE: 'Soberania digital: Governo cria agência hacker de elite e frustra chantagem cibernética internacional.'",
            empresarios: "Empresários: 'Excelente. A segurança digital das nossas empresas de energia e telefonia é vital para a economia moderna.'",
            trabalhadores: "Trabalhadores: 'Ficamos aliviados de saber que nossos dados públicos e contas de luz não estão nas mãos de criminosos estrangeiros.'",
            governadores: "Governadores: 'A agência federal ajudou a blindar os sistemas de arrecadação dos estados, que também eram alvo.'",
            ministros: "Ministro da Segurança: 'Fizemos história na defesa digital, presidente. Protegemos os segredos do país e a infraestrutura crítica.'"
          }
        },
        {
          id: "B",
          texto: "Contratar consultoria privada estrangeira de segurança.",
          custo: 10,
          detalhes: "Contratar uma multinacional de tecnologia de segurança em caráter emergencial para conter o vazamento e descriptografar os sistemas.",
          impacto: { seguranca: 12, infraestrutura: 5, orcamento: -10 },
          consequencia: "O ataque foi controlado pela empresa contratada, mas dependemos de tecnologia estrangeira de terceiros e os dados do governo passaram por servidores externos.",
          dialogos: {
            imprensa: "MANCHETE: 'Terceirização digital: Empresa estrangeira salva o governo de apagão de dados, gerando debate sobre soberania.'",
            empresarios: "Empresários: 'Resolvido de forma ágil e sem criar cabides de emprego públicos. Empresa privada especializada entrega o serviço.'",
            trabalhadores: "Trabalhadores: 'Resolveu o problema da luz, mas é estranho saber que uma empresa estrangeira tem acesso a todos os nossos dados governamentais.'",
            governadores: "Governadores: 'O sistema voltou a funcionar, mas gostaríamos de uma infraestrutura pública de segurança digital descentralizada.'",
            ministros: "Ministro da Segurança: 'Apagamos o incêndio rápido, mas continuamos vulneráveis a longo prazo se não desenvolvermos nossa própria tecnologia.'"
          }
        },
        {
          id: "C",
          texto: "Recusar pagamento e improvisar defesas internas.",
          custo: 0,
          detalhes: "Ignorar os chantagistas, acionar servidores de backup e usar a equipe de TI interna atual para tentar conter os danos manualmente.",
          impacto: { seguranca: -15, infraestrutura: -15, economia: -10, orcamento: 0 },
          consequencia: "Os hackers vazaram dados fiscais de milhões de cidadãos e causaram quedas temporárias de energia, gerando desconfiança econômica internacional.",
          dialogos: {
            imprensa: "MANCHETE: 'Vazamento massivo: Dados confidenciais de milhões de brasileiros são expostos na internet após falha de segurança.'",
            empresarios: "Empresários: 'O vazamento de dados gerou pânico financeiro. Bancos e comércios virtuais perderam credibilidade e vendas.'",
            trabalhadores: "Trabalhadores: 'Nossos CPFs e dados de contas bancárias foram roubados! Isso é um desleixo inaceitável com nossa privacidade!'",
            governadores: "Governadores: 'Os serviços digitais dos estados ficaram fora do ar por dias. Caos administrativo completo.'",
            ministros: "Ministro da Segurança: 'Uma tragédia anunciada. O custo de economizar nessa defesa foi a perda de dados soberanos do nosso povo.'"
          }
        }
      ]
    },
    economia: {
      ministro: "Dr. André Rezende",
      cargo: "Ministro da Economia",
      titulo: "Inflação dos Alimentos e Fome",
      descricao: "Quebras de safra agrícolas mundiais e a alta do dólar elevaram drasticamente os preços do arroz, feijão e óleo. Famílias de baixa renda estão enfrentando insegurança alimentar crônica (fome).",
      opcoes: [
        {
          id: "A",
          texto: "Cesta Básica Nacional Subsidiada e cozinhas comunitárias.",
          custo: 30,
          detalhes: "Comprar alimentos diretamente dos produtores e distribuir cestas básicas a preço simbólico para famílias cadastradas, além de financiar restaurantes populares.",
          impacto: { satisfacao: 25, saude: 10, economia: -5, orcamento: -30 },
          consequencia: "A fome imediata foi combatida e as famílias carentes ganharam segurança alimentar, mas a despesa pública pesou fortemente nas contas do governo.",
          dialogos: {
            imprensa: "MANCHETE: 'Governo combate a fome: Rede de cozinhas comunitárias reduz desnutrição, mas pressiona orçamento fiscal.'",
            empresarios: "Empresários: 'A distribuição direta de alimentos distorce o mercado de varejo e hipermercados, além de custar bilhões aos cofres públicos.'",
            trabalhadores: "Trabalhadores: 'Pelo menos agora temos o que comer em casa. Esse governo pensou em quem mais precisa.'",
            governadores: "Governadores: 'Os restaurantes populares federais reduziram o número de pessoas em situação de rua nas capitais estaduais.'",
            ministros: "Ministro da Economia: 'Do ponto de vista humano, essencial. Do ponto de vista fiscal, é um subsídio difícil de manter sem aumentar impostos futuramente.'"
          }
        },
        {
          id: "B",
          texto: "Zerar tarifas de importação e impostos sobre a cesta básica.",
          custo: 15,
          detalhes: "Retirar impostos federais sobre produtos alimentícios essenciais e zerar taxas de importação para aumentar a oferta de produtos externos no mercado nacional.",
          impacto: { economia: 15, satisfacao: 15, orcamento: -15 },
          consequencia: "Os preços dos alimentos caíram nos supermercados de forma imediata. A classe média respirou aliviada, mas o governo perdeu arrecadação de impostos importantes.",
          dialogos: {
            imprensa: "MANCHETE: 'Corte de impostos: Alimentos ficam mais baratos nos mercados, mas governo perde bilhões em arrecadação.'",
            empresarios: "Empresários: 'Excelente! Redução de impostos estimula a concorrência e o livre mercado. O comércio voltou a girar forte.'",
            trabalhadores: "Trabalhadores: 'Os preços no mercado caíram um pouco, ajudou a equilibrar as contas do mês, embora o desemprego continue alto.'",
            governadores: "Governadores: 'A perda de arrecadação federal afetou a nossa cota de repasse de ICMS/FPE, reduzindo nossa verba estadual.'",
            ministros: "Ministro da Economia: 'Estimulamos o consumo de mercado e baixamos a inflação. Foi uma boa medida de alívio fiscal indireto.'"
          }
        },
        {
          id: "C",
          texto: "Elevação drástica da Taxa de Juros (Selic).",
          custo: 0,
          detalhes: "O Banco Central eleva a taxa de juros básica de forma agressiva para forçar a queda geral do consumo e tentar conter a inflação à força.",
          impacto: { economia: 15, satisfacao: -20, orcamento: 5 },
          consequencia: "A inflação de alimentos foi controlada no médio prazo com o resfriamento da economia, mas o desemprego subiu e os investimentos produtivos travaram.",
          dialogos: {
            imprensa: "MANCHETE: 'Juros nas alturas: Banco Central freia inflação com Selic recorde, mas paralisa o crédito nacional.'",
            empresarios: "Empresários: 'Financiamentos e empréstimos para expandir nossas fábricas estão inviáveis com essa taxa de juros! Produção vai cair.'",
            trabalhadores: "Trabalhadores: 'As coisas pararam de subir de preço, mas o crédito no banco sumiu e a empresa onde trabalho começou a demitir.'",
            governadores: "Governadores: 'A alta dos juros encareceu o refinanciamento das dívidas públicas dos estados com a União. Problema sério.'",
            ministros: "Ministro da Economia: 'Medida amarga e clássica de controle inflacionário. Estabilizamos a moeda, mas ao custo de recessão econômica.'"
          }
        }
      ]
    }
  },
  3: { // Rodada 3 / Ano 3
    saude: {
      ministro: "Dra. Helena Carvalho",
      cargo: "Ministra da Saúde",
      titulo: "Falta de Médicos e Caos nos Hospitais",
      descricao: "Hospitais regionais do interior e das periferias sofrem com falta extrema de profissionais médicos e insumos básicos. Pacientes estão aguardando meses por cirurgias eletivas e exames vitais.",
      opcoes: [
        {
          id: "A",
          texto: "Plano de Carreira Federal para Médicos e contratação em massa.",
          custo: 30,
          detalhes: "Criar uma carreira pública federal para médicos com altos salários, focada em fixar profissionais no interior, e comprar insumos cirúrgicos hospitalares.",
          impacto: { saude: 30, satisfacao: 15, orcamento: -30 },
          consequencia: "O atendimento médico foi interiorizado com sucesso. Hospitais públicos foram abastecidos, reduzindo filas históricas de cirurgia.",
          dialogos: {
            imprensa: "MANCHETE: 'Médicos pelo Brasil: Carreira federal atrai profissionais para o interior e desafoga grandes hospitais.'",
            empresarios: "Empresários: 'Uma folha de pagamento pública pesada a longo prazo. Médicos concursados vitalícios geram altos custos futuros.'",
            trabalhadores: "Trabalhadores: 'Pela primeira vez temos pediatra e cirurgião no hospital da nossa cidade pequena. Uma bênção!'",
            governadores: "Governadores: 'Excelente. Aliviou as finanças municipais que gastavam fortunas contratando médicos terceirizados emergenciais.'",
            ministros: "Ministra da Saúde: 'Garantimos dignidade médica às regiões invisibilizadas. A saúde pública deu um salto civilizatório.'"
          }
        },
        {
          id: "B",
          texto: "Contratação emergencial de Médicos Estrangeiros.",
          custo: 15,
          detalhes: "Facilitar a validação temporária de diplomas e contratar médicos estrangeiros ou formados no exterior por salários menores e sem estabilidade pública.",
          impacto: { saude: 18, satisfacao: 5, orcamento: -15 },
          consequencia: "A falta de médicos de atenção básica foi resolvida rapidamente a baixo custo, mas as entidades médicas nacionais protestaram fortemente contra a revalidação simplificada de diplomas.",
          dialogos: {
            imprensa: "MANCHETE: 'Médicos do exterior: Governo dribla corporação médica nacional para preencher vagas no interior.'",
            empresarios: "Empresários: 'Boa medida de mercado. Resolve o problema de pessoal de forma flexível e barata sem inflar a máquina pública definitiva.'",
            trabalhadores: "Trabalhadores: 'O médico estrangeiro no postinho nos atende muito bem. Pelo menos temos consulta agora.'",
            governadores: "Governadores: 'Alguns conselhos regionais de medicina tentaram barrar os contratos na justiça, mas a população aprovou a chegada dos médicos.'",
            ministros: "Ministra da Saúde: 'Encontramos uma solução rápida e econômica, embora o atrito político com a classe médica nacional tenha sido severo.'"
          }
        },
        {
          id: "C",
          texto: "Incentivo fiscal a Planos de Saúde Privados.",
          custo: 0,
          detalhes: "Dar isenções fiscais para empresas que oferecerem convênios médicos particulares aos seus funcionários, aliviando a demanda sobre os hospitais públicos.",
          impacto: { saude: -10, satisfacao: -15, economia: 10, orcamento: 5 },
          consequencia: "O setor de saúde suplementar cresceu e a classe média migrou para o sistema particular, mas os hospitais do SUS continuaram sucateados e sem médicos para os mais pobres.",
          dialogos: {
            imprensa: "MANCHETE: 'Saúde de duas classes: Governo estima planos privados enquanto SUS definha por falta de investimentos.'",
            empresarios: "Empresários: 'Muito bom. Estimula o mercado privado de saúde, reduz impostos para as empresas contratantes e atrai investimentos estrangeiros.'",
            trabalhadores: "Trabalhadores: 'Quem tem emprego formal ganhou plano de saúde, mas quem está desempregado ou na informalidade ficou abandonado na fila do SUS.'",
            governadores: "Governadores: 'Os hospitais do estado continuam superlotados com a população de baixa renda. A desigualdade na saúde aumentou.'",
            ministros: "Ministra da Saúde: 'A privatização indireta ajudou uma parcela produtiva, mas deixou a base da pirâmide social sem assistência médica básica.'"
          }
        }
      ]
    },
    educacao: {
      ministro: "Prof. Marcos Souza",
      cargo: "Ministro da Educação",
      titulo: "Crise na Alfabetização e Evasão Escolar",
      descricao: "A evasão escolar no ensino médio atingiu índices alarmantes de 15%. Milhões de jovens estão abandonando a escola para trabalhar informalmente devido à pobreza. O país corre risco de criar uma geração de subempregados.",
      opcoes: [
        {
          id: "A",
          texto: "Ensino Técnico Integrado de Tempo Integral.",
          custo: 35,
          detalhes: "Transformar escolas de ensino médio em tempo integral combinadas com cursos técnicos profissionais e oferecer merenda escolar reforçada.",
          impacto: { educacao: 30, satisfacao: 15, economia: 10, orcamento: -35 },
          consequencia: "A evasão despencou. Os jovens agora saem da escola formados como técnicos (programação, mecatrônica, administração), prontos para o mercado de trabalho qualificado.",
          dialogos: {
            imprensa: "MANCHETE: 'Profissionalização do futuro: Escolas de tempo integral preparam jovens para a economia digital e freiam evasão.'",
            empresarios: "Empresários: 'Excelente! Precisávamos desesperadamente de mão de obra técnica qualificada. Isso aumenta nossa produtividade global.'",
            trabalhadores: "Trabalhadores: 'Nossos filhos passam o dia todo estudando, recebem boa alimentação e saem com profissão garantida. O melhor projeto social.'",
            governadores: "Governadores: 'Exigiu cofinanciamento estadual, mas o retorno em redução de vulnerabilidade social de jovens compensa largamente.'",
            ministros: "Ministro da Educação: 'Investimos na capacitação humana real. Essa é a ponte para tirar o país da armadilha da renda média.'"
          }
        },
        {
          id: "B",
          texto: "Poupança do Ensino Médio (Bolsa Estudantil).",
          custo: 20,
          detalhes: "Criar uma poupança onde o governo deposita um valor mensal para o aluno carente que mantiver 80% de frequência escolar, sacável na formatura.",
          impacto: { educacao: 15, satisfacao: 15, orcamento: -20 },
          consequencia: "A evasão caiu no curto prazo pois o incentivo financeiro ajudou a renda das famílias, embora as escolas continuem sem infraestrutura moderna ou cursos técnicos.",
          dialogos: {
            imprensa: "MANCHETE: 'Dinheiro para estudar: Bolsa incentivo reduz abandono escolar, mas estrutura das salas continua precária.'",
            empresarios: "Empresários: 'É uma transferência de renda direta aceitável para manter as crianças na escola. Melhor do que criar estruturas estatais gigantes.'",
            trabalhadores: "Trabalhadores: 'Essa poupança ajuda muito a pagar as contas de casa e estimula nosso filho a não largar os estudos.'",
            governadores: "Governadores: 'Ajuda a melhorar nossas estatísticas educacionais básicas de frequência de forma rápida. Apoio integral.'",
            ministros: "Ministro da Educação: 'Uma medida de assistência social eficiente que garante o diploma, embora o conteúdo pedagógico precise de mais reformas.'"
          }
        },
        {
          id: "C",
          texto: "Facilitar aprovação e cursos online EAD no Ensino Médio.",
          custo: 0,
          detalhes: "Substituir 40% das aulas presença por conteúdo online gravado (EAD) e reduzir exigências burocráticas de reprovação escolar.",
          impacto: { educacao: -20, satisfacao: -10, economia: 5, orcamento: 0 },
          consequencia: "Economizamos custos com transporte e merenda, e as taxas formais de formados subiram, mas a qualidade do aprendizado despencou e jovens carentes sem internet ficaram isolados.",
          dialogos: {
            imprensa: "MANCHETE: 'Fábrica de diplomas: EAD no ensino médio mascara evasão e reduz qualidade do aprendizado público.'",
            empresarios: "Empresários: 'Reduz gastos com custeio da máquina pública e insere o jovem no ambiente digital de EAD. Útil para economia de verbas.'",
            trabalhadores: "Trabalhadores: 'Nossos filhos não aprendem nada sozinhos olhando para uma tela de celular velha. Isso é exclusão educacional!'",
            governadores: "Governadores: 'Economizou verba de transporte escolar, mas gerou revolta entre pais e professores por falta de estrutura em casa.'",
            ministros: "Ministro da Educação: 'Geramos estatísticas bonitas de aprovação artificial, mas entregamos jovens sem preparo real para o mercado de trabalho.'"
          }
        }
      ]
    },
    seguranca: {
      ministro: "General Roberto Menezes",
      cargo: "Ministro da Segurança Pública",
      titulo: "Superpopulação e Rebeliões nos Presídios",
      descricao: "O sistema prisional está com 200% de ocupação. Facções rivais iniciaram rebeliões violentas em cadeia nos maiores presídios do país, com reféns e ameaças de invasões externas.",
      opcoes: [
        {
          id: "A",
          texto: "Construção urgente de novos presídios de segurança máxima.",
          custo: 30,
          detalhes: "Construir novos complexos prisionais modernos para isolar facções rivais e contratar mais agentes penitenciários federais.",
          impacto: { seguranca: 20, orcamento: -30 },
          consequencia: "As rebeliões foram controladas e os presídios desafogaram temporariamente, embora o custo de construção e manutenção permanente seja uma âncora no orçamento.",
          dialogos: {
            imprensa: "MANCHETE: 'Orçamento atrás das grades: Governo gasta bilhões em prisões de ponta para conter motins das facções.'",
            empresarios: "Empresários: 'Indústrias de segurança e construção civil faturaram alto. Garantir a custódia de criminosos é essencial para a ordem.'",
            trabalhadores: "Trabalhadores: 'Gastar bilhões construindo presídio enquanto falta dinheiro para hospital é doloroso de aceitar.'",
            governadores: "Governadores: 'Ajudou a transferir presos perigosos dos nossos presídios estaduais superlotados. Excelente apoio.'",
            ministros: "Ministro da Segurança: 'Estabelecemos o controle do sistema de custódia física. Sem prisões seguras, a polícia na rua não funciona.'"
          }
        },
        {
          id: "B",
          texto: "Mutirão judiciário de soltura e tornozeleiras eletrônicas.",
          custo: 10,
          detalhes: "Realizar um mutirão com a Defensoria Pública para libertar detentos de baixa periculosidade em fim de pena, substituindo a prisão por tornozeleira eletrônica.",
          impacto: { seguranca: 5, satisfacao: -10, orcamento: -10 },
          consequencia: "A superlotação dos presídios caiu de forma expressiva com baixo custo fiscal, mas a opinião pública protestou alegando sensação de impunidade.",
          dialogos: {
            imprensa: "MANCHETE: 'Desencarceramento em massa: Governo liberta milhares de presos leves para conter rebeliões nos presídios.'",
            empresarios: "Empresários: 'Medida barata que resolveu a tensão imediata, mas a imagem de impunidade pode afetar os investimentos do comércio.'",
            trabalhadores: "Trabalhadores: 'Soltar presos nas ruas nos deixa assustados. Esperamos que a polícia consiga monitorar todos com tornozeleira.'",
            governadores: "Governadores: 'Reduziu a superlotação carcerária estadual de forma imediata, mas gerou críticas dos setores policiais locais.'",
            ministros: "Ministro da Segurança: 'Fizemos um desencarceramento técnico focado apenas em crimes não violentos. Controlamos a crise com economia fiscal.'"
          }
        },
        {
          id: "C",
          texto: "Privatização de presídios e trabalho forçado remunerado.",
          custo: 0,
          detalhes: "Conceder a gestão das prisões a empresas privadas que usarão a mão de obra dos presos em fábricas internas, pagando salários simbólicos para cobrir custos.",
          impacto: { seguranca: 10, satisfacao: -15, economia: 10, orcamento: 15 },
          consequencia: "Os presídios foram reformados por empresas sem custo público e os presos começaram a produzir bens industriais baratos, gerando receitas, mas ONGs de direitos humanos denunciaram 'trabalho análogo à escravidão'.",
          dialogos: {
            imprensa: "MANCHETE: 'Prisões privadas: Modelo industrial de cárcere gera lucro para empresas e denúncias de ONGs humanitárias.'",
            empresarios: "Empresários: 'Sensacional! Presos trabalhando reduzem custos de custódia para o pagador de impostos e produzem para a economia real.'",
            trabalhadores: "Trabalhadores: 'Usar presos como mão de obra barata tira emprego de trabalhadores honestos aqui fora que cobram salário integral!'",
            governadores: "Governadores: 'Modelo polêmico. Gerou debates jurídicos intensos e greves de fome em nossos presídios estaduais.'",
            ministros: "Ministro da Segurança: 'Economizou bilhões do orçamento e manteve a ordem interna, mas a judicialização e as críticas internacionais foram pesadas.'"
          }
        }
      ]
    },
    economia: {
      ministro: "Dr. André Rezende",
      cargo: "Ministro da Economia e Meio Ambiente",
      titulo: "Desmatamento na Amazônia e Sanções Globais",
      descricao: "O desmatamento ilegal na Floresta Amazônica atingiu recordes históricos. A União Europeia e investidores globais ameaçam congelar o acordo comercial com o país e impor sanções pesadas às exportações agrícolas se não houver controle.",
      opcoes: [
        {
          id: "A",
          texto: "Desmatamento Zero: Fiscalização armada e inteligência de satélite.",
          custo: 35,
          detalhes: "Enviar as forças de segurança federais (Ibama/Força Nacional) em missões permanentes para prender madeireiros ilegais, queimar maquinário de garimpo e multar grandes proprietários infratores.",
          impacto: { meioambiente: 30, economia: -10, seguranca: 10, orcamento: -35 },
          consequencia: "O desmatamento despencou e salvamos o acordo comercial internacional com a Europa. Os fundos ambientais estrangeiros foram reativados, mas o lobby do agronegócio entrou em conflito com o governo.",
          dialogos: {
            imprensa: "MANCHETE: 'Guerra verde: Operações militares federais asfixiam garimpo ilegal e salvam prestígio internacional do país.'",
            empresarios: "Empresários: 'O agronegócio exportador comemorou a manutenção do acordo europeu, mas produtores de fronteira agrícola reclamam da dureza da fiscalização.'",
            trabalhadores: "Trabalhadores: 'Temos orgulho de ver nossa floresta protegida dos grileiros e madeireiros criminosos. A vida do planeta agradece.'",
            governadores: "Governadores: 'Governadores da região Norte apoiam, mas apontam que é preciso criar alternativas econômicas para quem vivia da madeira.'",
            ministros: "Ministro da Economia: 'Presidente, reconquistamos nossa soberania moral ecológica no planeta. A floresta em pé vale mais do que ouro ilegal.'"
          }
        },
        {
          id: "B",
          texto: "Mercado de Crédito de Carbono e monitoramento passivo.",
          custo: 15,
          detalhes: "Criar uma bolsa regulada de crédito de carbono para incentivar proprietários de terras a preservar áreas florestais voluntariamente, monitorando por satélite.",
          impacto: { meioambiente: 15, economia: 10, orcamento: -15 },
          consequencia: "Alguns setores agrícolas adotaram práticas sustentáveis para faturar com créditos de carbono, mitigando o desmatamento com baixo custo estatal, mas a fiscalização fraca manteve focos de garimpo ilegal ativos.",
          dialogos: {
            imprensa: "MANCHETE: 'Solução financeira: Mercado de carbono atrai latifundiários sustentáveis, mas garimpo clandestino continua agindo.'",
            empresarios: "Empresários: 'Excelente. Usa mecanismos modernos de incentivo financeiro privado em vez de repressão militar armada. O mercado gosta.'",
            trabalhadores: "Trabalhadores: 'Ajuda a preservar propriedades grandes, mas o garimpo ilegal continua contaminando os rios com mercúrio nas terras indígenas.'",
            governadores: "Governadores: 'Estados do Norte começaram a captar recursos internacionais privados de fundos verdes. Boa iniciativa financeira.'",
            ministros: "Ministro da Economia: 'Criamos um ecossistema financeiro verde com despesa moderada. Foi o meio-termo econômico inteligente.'"
          }
        },
        {
          id: "C",
          texto: "Ignorar sanções e apoiar expansão da fronteira agrícola.",
          custo: 0,
          detalhes: "Facilitar o licenciamento de fazendas e mineração na Amazônia e rebater as críticas internacionais alegando 'proteção da soberania de desenvolvimento'.",
          impacto: { meioambiente: -30, economia: 20, satisfacao: -10, orcamento: 10 },
          consequencia: "A produção de soja e carne expandiu gerando recordes de exportação imediatos no PIB, mas o acordo europeu foi cancelado, gerando sanções severas de longo prazo que derrubaram a moeda nacional.",
          dialogos: {
            imprensa: "MANCHETE: 'Isolamento diplomático: Sanções internacionais esmagam o real após governo liberar desmate na Amazônia.'",
            empresarios: "Empresários: 'A expansão agrícola imediata foi lucrativa, mas a perda do mercado europeu e a fuga de fundos de investimento ESG afundaram nossas ações na Bolsa!'",
            trabalhadores: "Trabalhadores: 'Os preços dos importados subiram com a alta da moeda e o clima está cada vez mais instável com secas severas destruindo colheitas.'",
            governadores: "Governadores: 'A perda de investimentos estrangeiros diretos paralisou obras de infraestrutura que dependiam de fundos internacionais.'",
            ministros: "Ministro da Economia: 'Esta escolha comprometeu o futuro ecológico e econômico do país no cenário mundial. Um erro histórico.'"
          }
        }
      ]
    }
  }
};

/**
 * Eventos Inesperados baseados nos indicadores do jogo.
 * Podem disparar no início do Ano 2 ou Ano 3.
 */
const UNEXPECTED_EVENTS = [
  {
    id: "greve_geral",
    titulo: "Greve Geral dos Trabalhadores",
    gatilho: (stats) => stats.satisfacao < 35 && stats.economia < 40,
    descricao: "Devido aos baixos índices econômicos e à forte insatisfação popular com a perda de poder de compra, as centrais sindicais organizaram uma Greve Geral por tempo indeterminado. Rodovias estão bloqueadas e serviços públicos paralisados.",
    opcoes: [
      {
        texto: "Conceder reajuste salarial aos servidores federais e negociar.",
        custo: 15,
        impacto: { satisfacao: 20, economia: -5, orcamento: -15 },
        consequencia: "A greve terminou e a aprovação popular subiu, mas os cofres públicos tiveram que arcar com um gasto permanente não planejado."
      },
      {
        texto: "Decretar ilegalidade da greve e usar forças policiais para liberar vias.",
        custo: 0,
        impacto: { seguranca: 10, satisfacao: -15, economia: 5 },
        consequencia: "As rodovias foram liberadas e a economia voltou a girar, mas a repressão policial violenta gerou condenações internacionais e ódio popular."
      }
    ]
  },
  {
    id: "crise_divida",
    titulo: "Rebaixamento da Nota de Crédito do País",
    gatilho: (stats) => stats.orcamento < 25,
    descricao: "O mercado financeiro internacional rebaixou a nota de crédito do país de 'Estável' para 'Risco de Calote' devido ao baixíssimo nível do orçamento público federal. O dólar disparou e investidores estão retirando capital do país.",
    opcoes: [
      {
        texto: "Decretar congelamento temporário de contratações públicas e obras públicas não iniciadas.",
        custo: 0,
        impacto: { orcamento: 15, infraestrutura: -10, satisfacao: -10 },
        consequencia: "O mercado estabilizou a nota de crédito com o anúncio de austeridade, mas obras de saneamento e estradas importantes foram paralisadas."
      },
      {
        texto: "Ignorar o mercado financeiro e emitir títulos públicos para financiar gastos de emergência.",
        custo: 0,
        impacto: { orcamento: -10, economia: -15, satisfacao: 10 },
        consequencia: "Mantivemos as obras públicas aquecidas, mas a inflação e a desvalorização cambial explodiram, encarecendo os juros da dívida nacional."
      }
    ]
  },
  {
    id: "descoberta_recursos",
    titulo: "Descoberta de Reservas Massivas de Petróleo (Pré-Sal)",
    gatilho: (stats) => stats.economia > 50 && stats.infraestrutura > 50,
    descricao: "A estatal de energia do país descobriu uma reserva petrolífera gigante em águas profundas. A exploração imediata pode injetar bilhões na economia, mas ambientalistas protestam alertando para o risco de contaminação marinha perto de santuários ecológicos.",
    opcoes: [
      {
        texto: "Exploração máxima e criação de um Fundo Social Soberano.",
        custo: 20, // Custo de investimento inicial em perfuração
        impacto: { economia: 25, orcamento: 20, meioambiente: -20, infraestrutura: 15 },
        consequencia: "O país tornou-se um grande exportador de petróleo, alimentando o caixa público e gerando royalties, mas sofremos derramamentos de óleo localizados que devastaram a vida marinha na costa."
      },
      {
        texto: "Vetar exploração na área de preservação e focar em projetos de hidrogênio verde.",
        custo: 10,
        impacto: { meioambiente: 20, satisfacao: 10, economia: 5, orcamento: -10 },
        consequencia: "Ganhamos aclamação ecológica global, mas abrimos mão de receitas petrolíferas bilionárias imediatas, focando no desenvolvimento tecnológico sustentável mais lento."
      }
    ]
  }
];
