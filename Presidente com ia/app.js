/**
 * O Dilema do Presidente - Core Gameplay & 2D RPG Engine
 */

// ================= ESTADO GLOBAL DO JOGO =================
let gameState = {
  playerName: "",
  partyName: "",
  countryProfile: "balanced",
  round: 1, // Ano 1, 2, 3
  budget: 100, // Verba do ano atual ($100B)
  stats: {
    economia: 50,
    saude: 50,
    educacao: 50,
    seguranca: 50,
    meioambiente: 50,
    infraestrutura: 50,
    satisfacao: 50,
    orcamento: 50 // Saúde do Tesouro Nacional
  },
  history: [], // Histórico de decisões: { rodada, pasta, opcao }
  resolvedCrises: [], // Pastas resolvidas na rodada atual: 'saude', 'educacao', etc.
  currentCrisis: null, // Crise ativa em diálogo
  currentSpeaker: null, // NPC ativo em diálogo
  activeEvent: null, // Evento inesperado ativo
  gameActive: false
};

// ================= CONFIGURAÇÃO DO RPG 2D =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 32;
const MAP_COLS = 25; // 800px
const MAP_ROWS = 16; // 512px

// Layout do Mapa (0 = Vazio, 1 = Parede, 2 = Tapete Vermelho, 3 = Mesa, 4 = Planta, 5 = Cadeira, 6 = Servidor IA)
const MAP_GRID = [
  [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
  [1,4,0,0,0,4,1,1,0,0,0,0,2,2,0,0,0,0,1,1,4,0,0,4,1],
  [1,0,0,0,0,0,1,1,0,3,3,0,2,2,0,3,3,0,1,1,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,1,1,1,2,2,1,1,1,1,1,1,0,0,0,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,1,2,2,1,6,6,0,0,0,0,0,0,4,1],
  [1,0,3,0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,3,0,1],
  [1,0,3,0,0,0,1,1,1,0,0,1,2,2,1,0,0,1,1,1,0,0,3,0,1],
  [1,0,0,0,0,0,1,1,1,0,0,0,2,2,0,0,0,1,1,1,0,0,0,0,1],
  [1,0,0,0,0,0,1,1,1,0,0,0,2,2,0,0,0,1,1,1,0,0,0,0,1],
  [1,0,3,0,0,0,1,1,1,0,0,1,2,2,1,0,0,1,1,1,0,0,3,0,1],
  [1,0,3,0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,3,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,4,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,1,0,3,3,0,2,2,0,3,3,0,1,1,0,0,0,0,1],
  [1,4,0,0,0,4,1,1,0,0,0,0,2,2,0,0,0,0,1,1,4,0,0,4,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Adiciona decorações adicionais no grid de colisão
// 3 = Mesas dos Ministros, 4 = Plantas nos cantos, 6 = Computador IA
const SOLID_TILES = [1, 3, 4, 6];

// ================= DEFINIÇÃO DOS PERSONAGENS (NPCs) =================
const NPCS = {
  saude: {
    id: "saude",
    name: "Dra. Helena Carvalho",
    role: "Ministra da Saúde",
    gridX: 12,
    gridY: 1, // Fica na ala norte
    color: "#06b6d4",
    avatarColor: "#e0f7fa"
  },
  educacao: {
    id: "educacao",
    name: "Prof. Marcos Souza",
    role: "Ministro da Educação",
    gridX: 22,
    gridY: 7, // Fica na ala leste
    color: "#6366f1",
    avatarColor: "#e0e7ff"
  },
  seguranca: {
    id: "seguranca",
    name: "General Roberto Menezes",
    role: "Ministro da Segurança",
    gridX: 2,
    gridY: 7, // Fica na ala oeste
    color: "#f59e0b",
    avatarColor: "#fef3c7"
  },
  economia: {
    id: "economia",
    name: "Dr. André Rezende",
    role: "Ministro da Economia",
    gridX: 12,
    gridY: 14, // Fica na ala sul
    color: "#10b981",
    avatarColor: "#d1fae5"
  },
  mesa: {
    id: "mesa",
    name: "Mesa Presidencial",
    role: "Despacho do Mandato",
    gridX: 12,
    gridY: 6, // Centro do gabinete
    color: "#8b5cf6",
    avatarColor: "#ede9fe"
  },
  terminal: {
    id: "terminal",
    name: "Terminal de IA",
    role: "Supercomputador de Avaliação",
    gridX: 15,
    gridY: 4, // Topo direito do gabinete
    color: "#3b82f6",
    avatarColor: "#dbeafe"
  }
};

// ================= CONFIGURAÇÃO DO JOGADOR =================
const player = {
  x: 12 * TILE_SIZE,
  y: 9 * TILE_SIZE,
  width: 20,
  height: 28,
  speed: 3,
  dir: "up", // up, down, left, right
  isMoving: false
};

// Controles
const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
  Space: false, e: false
};

// Configurações de Diálogos
let typewriterTimer = null;
let radarChartInstance = null;

// ================= INICIALIZAÇÃO E EVENTOS DO TECLADO =================
window.addEventListener("keydown", (e) => {
  if (!gameState.gameActive) return;
  
  // Evitar rolagem de página com teclas direcionais e espaço
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }

  const key = e.key.toLowerCase();
  if (key === "w" || e.key === "ArrowUp") keys.ArrowUp = true;
  if (key === "s" || e.key === "ArrowDown") keys.ArrowDown = true;
  if (key === "a" || e.key === "ArrowLeft") keys.ArrowLeft = true;
  if (key === "d" || e.key === "ArrowRight") keys.ArrowRight = true;
  if (e.key === " " || key === "e") {
    if (!keys.Space) {
      keys.Space = true;
      handleInteraction();
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key === "w" || e.key === "ArrowUp") keys.ArrowUp = false;
  if (key === "s" || e.key === "ArrowDown") keys.ArrowDown = false;
  if (key === "a" || e.key === "ArrowLeft") keys.ArrowLeft = false;
  if (key === "d" || e.key === "ArrowRight") keys.ArrowRight = false;
  if (e.key === " " || key === "e") keys.Space = false;
});

// ================= FLUXO INICIAL E CONFIGURAÇÃO DA PARTIDA =================

function selectCountryProfile(profile, element) {
  gameState.countryProfile = profile;
  document.querySelectorAll(".profile-card").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}

function startNewGame() {
  const nameInput = document.getElementById("president-name").value.trim();
  const partyInput = document.getElementById("party-name").value.trim();
  
  gameState.playerName = nameInput || "Silva";
  gameState.partyName = partyInput || "Partido do Desenvolvimento";
  
  // Aplica perfil de país selecionado com verba e estatísticas distintas
  if (gameState.countryProfile === "ecological") {
    gameState.budget = getAnnualBudget(); // Verba apertada
    gameState.stats = { economia: 30, saude: 65, educacao: 60, seguranca: 50, meioambiente: 80, infraestrutura: 35, satisfacao: 65, orcamento: 40 };
  } else if (gameState.countryProfile === "industrial") {
    gameState.budget = getAnnualBudget(); // Verba abundante
    gameState.stats = { economia: 80, saude: 40, educacao: 45, seguranca: 35, meioambiente: 25, infraestrutura: 75, satisfacao: 50, orcamento: 80 };
  } else {
    gameState.budget = getAnnualBudget(); // Verba moderada padrão
    gameState.stats = { economia: 50, saude: 50, educacao: 50, seguranca: 50, meioambiente: 50, infraestrutura: 50, satisfacao: 50, orcamento: 50 };
  }
  
  gameState.round = 1;
  gameState.history = [];
  gameState.resolvedCrises = [];
  gameState.gameActive = true;
  gameState.activeEvent = null;
  
  // Atualiza HUD
  document.getElementById("hud-pres-name").innerText = "Presidente " + gameState.playerName;
  document.getElementById("hud-party-name").innerText = gameState.partyName;
  updateHUD();
  updateMissionHUD();
  
  // Reseta jogador
  player.x = 12 * TILE_SIZE + 6;
  player.y = 9 * TILE_SIZE;
  player.dir = "up";
  
  // Esconde Intro, Mostra Jogo
  document.getElementById("intro-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  showMap();
  
  // Exibe o Tutorial Inicial no primeiro jogo
  showTutorialModal();

  // Reseta feed
  const feed = document.getElementById("reactions-feed");
  feed.innerHTML = `
    <div class="feed-item ministers">
      <div class="feed-item-header">Gabinete Civil <span class="feed-item-time">Agora</span></div>
      <div class="feed-item-content">Mandato de 3 anos iniciado. Verba do Tesouro alocada: $${gameState.budget}B. Equilibre os trade-offs ministeriais.</div>
    </div>
  `;
  
  // Inicia game loop
  requestAnimationFrame(gameLoop);
  
  // Trigger do lucide para recriar ícones
  setTimeout(() => lucide.createIcons(), 50);
}

// Cada perfil representa a capacidade fiscal do país durante todo o mandato,
// e não apenas no primeiro ano.
function getAnnualBudget() {
  if (gameState.countryProfile === "ecological") return 70;
  if (gameState.countryProfile === "industrial") return 150;
  return 100;
}

// Controle do Modal de Tutorial Inicial
function showTutorialModal() {
  const modal = document.getElementById("tutorial-modal");
  if (modal) {
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
}

function closeTutorialModal() {
  const modal = document.getElementById("tutorial-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Gerenciador Dinâmico e Desafiador da Missão Atual
function updateMissionHUD(activeNPC = null, step = 1) {
  const missionTitle = document.getElementById("mission-title");
  const missionDesc = document.getElementById("mission-desc");
  const missionStatusTag = document.getElementById("mission-status-tag");
  const check1 = document.getElementById("check-step-1");
  const check2 = document.getElementById("check-step-2");
  const check3 = document.getElementById("check-step-3");
  const goalText = document.getElementById("hud-goal-text");

  if (!missionTitle) return;

  const pendentes = 4 - gameState.resolvedCrises.length;
  const concluidos = gameState.resolvedCrises.length;

  if (gameState.round > 3) {
    missionTitle.innerText = "🏆 MANDATO CONCLUÍDO";
    missionDesc.innerText = "Dirija-se ao Terminal de IA no Palácio para emitir o balanço de governança.";
    missionStatusTag.innerText = "Finalizado";
    missionStatusTag.style.background = "#dcfce7";
    missionStatusTag.style.color = "#15803d";
    if (goalText) goalText.innerText = "🎯 OBJETIVO: Acesse o Terminal de IA para encerrar a governança.";
    return;
  }

  if (activeNPC) {
    missionTitle.innerText = `Dilema em pauta: ${activeNPC.role}`;
    missionDesc.innerText = `Pondere os trade-offs. Beneficiar a pasta de ${activeNPC.name} pode custar verba e afetar outros setores.`;
    if (goalText) goalText.innerText = `🎯 DESAFIO: Pondere os custos e impactos da crise de ${activeNPC.name}.`;
    
    if (check1) { check1.innerHTML = `<span class="check-icon">✓</span> Analisar dilema de ${activeNPC.role}`; check1.classList.add("done"); }
    if (check2) { check2.innerHTML = `<span class="check-icon">○</span> Simular impactos via IA`; check2.classList.remove("done"); }
    if (check3) { check3.innerHTML = `<span class="check-icon">○</span> Assinar decreto no Diário Oficial`; check3.classList.remove("done"); }
  } else {
    missionTitle.innerText = `Desafio Estratégico (Ano ${gameState.round})`;
    missionDesc.innerText = `Mantenha os setores longe do colapso (<30%) e administre o orçamento de $${gameState.budget}B.`;
    missionStatusTag.innerText = `Despachos: ${concluidos}/4`;
    missionStatusTag.style.background = "#e0e7ff";
    missionStatusTag.style.color = "#3730a3";
    if (goalText) goalText.innerText = `🎯 DESAFIO: Equilibre os setores e atenda os Ministros pendentes (${pendentes} restantes).`;

    if (check1) { check1.innerHTML = `<span class="check-icon">${concluidos >= 1 ? '✓' : '○'}</span> Despacho 1/4 (${concluidos >= 1 ? 'OK' : 'Pendente'})`; if (concluidos >= 1) check1.classList.add("done"); else check1.classList.remove("done"); }
    if (check2) { check2.innerHTML = `<span class="check-icon">${concluidos >= 2 ? '✓' : '○'}</span> Despacho 2/4 (${concluidos >= 2 ? 'OK' : 'Pendente'})`; if (concluidos >= 2) check2.classList.add("done"); else check2.classList.remove("done"); }
    if (check3) { check3.innerHTML = `<span class="check-icon">${concluidos >= 4 ? '✓' : '○'}</span> Despacho Final e Balanço (${concluidos >= 4 ? 'Pronto' : 'Pendente'})`; if (concluidos >= 4) check3.classList.add("done"); else check3.classList.remove("done"); }
  }
}

// ================= MOTOR DO JOGO 2D (GAME LOOP) =================

function gameLoop(timestamp) {
  if (!gameState.gameActive) return;
  
  updatePlayer();
  drawMap();
  
  requestAnimationFrame(gameLoop);
}

// Atualização de física e movimento
function updatePlayer() {
  player.isMoving = false;
  let nextX = player.x;
  let nextY = player.y;
  
  if (keys.ArrowUp) {
    nextY -= player.speed;
    player.dir = "up";
    player.isMoving = true;
  } else if (keys.ArrowDown) {
    nextY += player.speed;
    player.dir = "down";
    player.isMoving = true;
  } else if (keys.ArrowLeft) {
    nextX -= player.speed;
    player.dir = "left";
    player.isMoving = true;
  } else if (keys.ArrowRight) {
    nextX += player.speed;
    player.dir = "right";
    player.isMoving = true;
  }
  
  // Colisão com bordas do canvas
  if (nextX < 0) nextX = 0;
  if (nextX + player.width > canvas.width) nextX = canvas.width - player.width;
  if (nextY < 0) nextY = 0;
  if (nextY + player.height > canvas.height) nextY = canvas.height - player.height;
  
  // Testar Colisões por caixa envolvente (AABB) com o Grid do Mapa
  if (checkCollision(nextX, nextY)) {
    // Tenta deslizar
    if (player.isMoving) {
      // Se moveu diagonalmente ou falhou, tenta movimento apenas em um eixo
      if (player.dir === "up" || player.dir === "down") {
        // Tenta desviar lateralmente
      }
    }
  } else {
    player.x = nextX;
    player.y = nextY;
  }
}

// Verifica se as coordenadas do jogador colidem com algum tile sólido do grid
function checkCollision(x, y) {
  // Cantos da caixa de colisão do jogador
  const left = x;
  const right = x + player.width;
  const top = y + 14; // A colisão real é na metade inferior do personagem (pés)
  const bottom = y + player.height;
  
  const tileLeft = Math.floor(left / TILE_SIZE);
  const tileRight = Math.floor(right / TILE_SIZE);
  const tileTop = Math.floor(top / TILE_SIZE);
  const tileBottom = Math.floor(bottom / TILE_SIZE);
  
  // Varre os tiles ocupados pelo jogador
  for (let r = tileTop; r <= tileBottom; r++) {
    for (let c = tileLeft; c <= tileRight; c++) {
      if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) {
        return true; // Fora do mapa é colisão
      }
      const tileType = MAP_GRID[r][c];
      if (SOLID_TILES.includes(tileType)) {
        return true;
      }
    }
  }
  
  // Colisão com os Ministros / NPCs estacionados
  for (let key in NPCS) {
    const npc = NPCS[key];
    // Ignorar mesa e terminal nas colisões físicas de grade se quisermos atravessar, mas eles são sólidos
    const npcX = npc.gridX * TILE_SIZE;
    const npcY = npc.gridY * TILE_SIZE;
    
    // Caixa de colisão simples do NPC
    if (left < npcX + TILE_SIZE &&
        right > npcX &&
        top < npcY + TILE_SIZE &&
        bottom > npcY) {
      return true;
    }
  }
  
  return false;
}

// ================= RENDERIZADOR GRÁFICO (CANVAS) =================

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. Desenhar Chão e Parede baseados no Grid
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const tile = MAP_GRID[r][c];
      const posX = c * TILE_SIZE;
      const posY = r * TILE_SIZE;
      
      if (tile === 1) {
        // Coluna/Parede de Concreto Branco Estilo Niemeyer (Congresso Nacional)
        ctx.fillStyle = "#cbd5e1"; // Base/borda cinza claro
        ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Relevo de bloco de parede branco
        ctx.fillStyle = "#f8fafc"; 
        ctx.fillRect(posX + 2, posY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        
        // Top highlight (Brilho superior branco puro)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(posX + 2, posY + 2, TILE_SIZE - 4, 3);
        
        // Sombra inferior do bloco cinza suave
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(posX + 2, posY + TILE_SIZE - 5, TILE_SIZE - 4, 3);
        
        // Divisórias verticais limpas
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(posX + TILE_SIZE/2 - 1, posY + 2, 2, TILE_SIZE - 4);
      } else if (tile === 2) {
        // Tapete Vermelho Presidencial Aveludado (Contraste lindo com o mármore branco)
        const carpetGrad = ctx.createLinearGradient(posX, posY, posX + TILE_SIZE, posY);
        carpetGrad.addColorStop(0, "#991b1b"); // Sombra lateral
        carpetGrad.addColorStop(0.2, "#b91c1c");
        carpetGrad.addColorStop(0.5, "#dc2626"); // Centro vermelho brilhante
        carpetGrad.addColorStop(0.8, "#b91c1c");
        carpetGrad.addColorStop(1, "#991b1b");
        
        ctx.fillStyle = carpetGrad;
        ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Textura aveludada (pontos de pixel art)
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(posX + 6, posY + 8, 2, 2);
        ctx.fillRect(posX + 20, posY + 18, 2, 2);
        ctx.fillRect(posX + 12, posY + 26, 2, 2);
        
        // Franjas douradas nas bordas do tapete (esquerda e direita)
        ctx.fillStyle = "#fbbf24"; // Amarelo Dourado Brilhante
        for (let fy = 0; fy < TILE_SIZE; fy += 4) {
          if (c === 12 && MAP_GRID[r][c - 1] !== 2) {
            ctx.fillRect(posX + 1, posY + fy, 2, 2);
          }
          if (c === 13 && MAP_GRID[r][c + 1] !== 2) {
            ctx.fillRect(posX + TILE_SIZE - 3, posY + fy, 2, 2);
          }
        }
      } else if (tile === 6) {
        // Gabinete de Servidores (IA) em chapa metálica branca/cinza claro
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1;
        ctx.strokeRect(posX + 2, posY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        
        // Grelhas horizontais cinzas
        ctx.fillStyle = "#cbd5e1";
        for (let gy = 6; gy < TILE_SIZE - 6; gy += 4) {
          ctx.fillRect(posX + 6, posY + gy, TILE_SIZE - 12, 2);
        }
        
        // LEDs Piscantes com brilho neon
        const time = Date.now();
        ctx.save();
        
        // LED Verde
        const lGreen = (Math.sin(time / 150) > 0);
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = lGreen ? 6 : 0;
        ctx.fillStyle = lGreen ? "#10b981" : "#047857";
        ctx.fillRect(posX + 6, posY + 6, 3, 3);
        
        // LED Azul
        const lBlue = (Math.sin(time / 220) > 0);
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = lBlue ? 6 : 0;
        ctx.fillStyle = lBlue ? "#3b82f6" : "#1d4ed8";
        ctx.fillRect(posX + 14, posY + 6, 3, 3);
        
        // LED Vermelho
        const lRed = (Math.sin(time / 100) > 0);
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = lRed ? 6 : 0;
        ctx.fillStyle = lRed ? "#ef4444" : "#b91c1c";
        ctx.fillRect(posX + 22, posY + 6, 3, 3);
        
        ctx.restore();
      } else if (tile === 4) {
        // Vaso de Planta Presidencial sobre mármore branco
        const isDark = (r + c) % 2 === 0;
        ctx.fillStyle = isDark ? "#ffffff" : "#f1f5f9";
        ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Linhas de rejunte finas claras
        ctx.strokeStyle = "#e2e8f0";
        ctx.strokeRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Vaso de cerâmica branca luxuosa
        ctx.fillStyle = "#cbd5e1"; // Sombra
        ctx.fillRect(posX + 8, posY + 20, 16, 8);
        ctx.fillStyle = "#f8fafc"; // Brilho/Luz
        ctx.fillRect(posX + 10, posY + 20, 12, 6);
        ctx.fillStyle = "#64748b"; // Terra interna escura
        ctx.fillRect(posX + 7, posY + 18, 18, 3);
        
        // Folhas da planta
        ctx.fillStyle = "#065f46"; // Verde Escuro
        ctx.beginPath(); ctx.ellipse(posX + 11, posY + 14, 5, 8, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(posX + 21, posY + 14, 5, 8, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = "#10b981"; // Verde Claro
        ctx.beginPath(); ctx.ellipse(posX + 16, posY + 10, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(posX + 13, posY + 13, 2.5, 5, -Math.PI / 6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(posX + 19, posY + 13, 2.5, 5, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
      } else {
        // Chão de Mármore Branco do Congresso Nacional (Ladrilhos claros e amplos)
        const isDark = (r + c) % 2 === 0;
        ctx.fillStyle = isDark ? "#ffffff" : "#f1f5f9";
        ctx.fillRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Linhas de rejunte finas cinza claro
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.strokeRect(posX, posY, TILE_SIZE, TILE_SIZE);
        
        // Brilho reflexivo sutil nas placas de mármore
        if ((r * c) % 7 === 3) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.fillRect(posX + 4, posY + 4, 12, 1);
          ctx.fillRect(posX + 4, posY + 4, 1, 12);
        }
      }
      
      // Mesas e Mobílias (Tile 3)
      if (tile === 3) {
        // Pernas e sombra da mesa
        ctx.fillStyle = "#334155"; // Pernas de metal escuro modernas
        ctx.fillRect(posX + 4, posY + 14, 3, 8);
        ctx.fillRect(posX + TILE_SIZE - 7, posY + 14, 3, 8);
        
        // Tampo de Madeira Clara/Marfim moderna (Estilo Congresso)
        ctx.fillStyle = "#d97706"; // Base madeira
        ctx.fillRect(posX + 2, posY + 4, TILE_SIZE - 4, 11);
        ctx.fillStyle = "#f59e0b"; // Face superior mel/marfim
        ctx.fillRect(posX + 3, posY + 5, TILE_SIZE - 6, 8);
        
        // Borda dourada cromada
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(posX + 2, posY + 13, TILE_SIZE - 4, 2);
        
        // Notebooks e papéis
        if (c % 2 === 0) {
          ctx.fillStyle = "#475569"; // Notebook cinza
          ctx.fillRect(posX + 8, posY + 7, 10, 4);
          ctx.fillStyle = "#0284c7"; // Tela azul acesa
          ctx.fillRect(posX + 9, posY + 4, 8, 3);
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(posX + 7, posY + 6, 8, 5);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(posX + 9, posY + 7, 7, 5);
          
          ctx.fillStyle = "#ef4444"; // Caneca de café
          ctx.fillRect(posX + 18, posY + 8, 4, 4);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(posX + 21, posY + 9, 2, 2);
        }
      }
    }
  }

  // 2. Desenhar NPCs (Ministros, Mesa, Terminal)
  for (let key in NPCS) {
    const npc = NPCS[key];
    const npcX = npc.gridX * TILE_SIZE;
    const npcY = npc.gridY * TILE_SIZE;
    
    const time = Date.now();
    const bob = Math.sin((time + npc.gridX * 120) / 280) * 1.3;
    
    if (npc.id === "mesa") {
      // Mesa presidencial grande em mogno mel moderno
      ctx.fillStyle = "#451a03"; // Sombra
      ctx.fillRect(npcX - 16, npcY + 12, TILE_SIZE * 2, 10);
      
      ctx.fillStyle = "#d97706"; // Madeira mel
      ctx.fillRect(npcX - 18, npcY + 2, TILE_SIZE * 2 + 4, TILE_SIZE - 10);
      ctx.fillStyle = "#f59e0b"; // Topo claro
      ctx.fillRect(npcX - 16, npcY + 3, TILE_SIZE * 2, TILE_SIZE - 14);
      
      ctx.fillStyle = "#fbbf24"; // Detalhes dourados
      ctx.fillRect(npcX + 10, npcY + 9, 12, 3);
      
      // Documentos
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(npcX - 6, npcY + 5, 10, 8);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(npcX + 22, npcY + 6, 8, 7);
      ctx.fillStyle = "#2563eb"; // Caneta azul
      ctx.fillRect(npcX + 4, npcY + 6, 1, 6);
      
      if (gameState.round <= 3 && getDistanceToNPC(npc) < 48) {
        drawInteractionPrompt(npcX + TILE_SIZE/2, npcY - 8, "Despachar Ano " + gameState.round);
      }
      continue;
    }

    if (npc.id === "terminal") {
      // Terminal Holográfico IA (Design branco metálico)
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(npcX + 2, npcY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      
      const screenGrad = ctx.createLinearGradient(npcX + 6, npcY + 6, npcX + TILE_SIZE - 6, npcY + TILE_SIZE - 10);
      screenGrad.addColorStop(0, "#0ea5e9");
      screenGrad.addColorStop(1, "#f8fafc");
      ctx.fillStyle = screenGrad;
      ctx.fillRect(npcX + 6, npcY + 6, TILE_SIZE - 12, TILE_SIZE - 16);
      
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const codeOffset = Math.floor(time / 200) % 4;
      ctx.moveTo(npcX + 10, npcY + 10 - codeOffset);
      ctx.lineTo(npcX + 22, npcY + 10 - codeOffset);
      ctx.moveTo(npcX + 10, npcY + 14 - codeOffset);
      ctx.lineTo(npcX + 18, npcY + 14 - codeOffset);
      ctx.moveTo(npcX + 10, npcY + 18 - codeOffset);
      ctx.lineTo(npcX + 20, npcY + 18 - codeOffset);
      ctx.stroke();
      
      if (gameState.round > 3) {
        drawExclamationMark(npcX + TILE_SIZE/2, npcY - 14);
        if (getDistanceToNPC(npc) < 48) {
          drawInteractionPrompt(npcX + TILE_SIZE/2, npcY - 32, "Consultar IA");
        }
      }
      continue;
    }

    // --- DESENHAR NPC MINISTRO ---
    // Cadeira de couro bege moderna (Congresso Nacional)
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(npcX + TILE_SIZE/2, npcY + 12 + bob, 12, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(npcX + TILE_SIZE/2 - 2, npcY + 20 + bob, 4, 6);
    
    // Ombros e Roupa do NPC
    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.arc(npcX + TILE_SIZE/2, npcY + 24 + bob, 11, Math.PI, 0, false);
    ctx.fill();
    
    // Rosto
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(npcX + TILE_SIZE/2 - 6, npcY + 10 + bob, 12, 10);
    
    // Cabelo
    ctx.fillStyle = "#334155";
    if (npc.id === "saude") {
      ctx.fillStyle = "#d97706";
      ctx.fillRect(npcX + TILE_SIZE/2 - 6, npcY + 6 + bob, 12, 5);
      ctx.fillRect(npcX + TILE_SIZE/2 - 2, npcY + 11 + bob, 4, 8);
    } else if (npc.id === "educacao") {
      ctx.fillStyle = "#4338ca";
      ctx.fillRect(npcX + TILE_SIZE/2 - 7, npcY + 6 + bob, 14, 6);
      ctx.fillRect(npcX + TILE_SIZE/2 - 7, npcY + 12 + bob, 3, 8);
      ctx.fillRect(npcX + TILE_SIZE/2 + 4, npcY + 12 + bob, 3, 8);
    } else if (npc.id === "seguranca") {
      ctx.fillStyle = "#64748b";
      ctx.fillRect(npcX + TILE_SIZE/2 - 6, npcY + 7 + bob, 12, 4);
      ctx.fillStyle = "#334155";
      ctx.fillRect(npcX + TILE_SIZE/2 - 8, npcY + 4 + bob, 16, 4);
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(npcX + TILE_SIZE/2 - 1, npcY + 5 + bob, 2, 2);
    } else if (npc.id === "economia") {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(npcX + TILE_SIZE/2 - 6, npcY + 6 + bob, 12, 5);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(npcX + TILE_SIZE/2 - 6, npcY + 6 + bob, 6, 3);
    }
    
    // Olhos
    ctx.fillStyle = "#020617";
    ctx.fillRect(npcX + TILE_SIZE/2 - 3, npcY + 13 + bob, 2, 2);
    ctx.fillRect(npcX + TILE_SIZE/2 + 2, npcY + 13 + bob, 2, 2);
    
    // Roupas específicas
    if (npc.id === "saude") { 
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(npcX + 8, npcY + 22 + bob, 5, 8);
      ctx.fillRect(npcX + TILE_SIZE - 13, npcY + 22 + bob, 5, 8);
      ctx.fillStyle = "#0891b2";
      ctx.fillRect(npcX + 12, npcY + 21 + bob, 8, 2);
    } else if (npc.id === "economia") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(npcX + TILE_SIZE/2 - 2, npcY + 20 + bob, 4, 4);
      ctx.fillStyle = "#047857";
      ctx.fillRect(npcX + TILE_SIZE/2 - 1, npcY + 21 + bob, 2, 7);
    } else if (npc.id === "educacao") {
      ctx.fillStyle = "#8b5cf6";
      ctx.fillRect(npcX + 6, npcY + 20 + bob, 5, 7);
    } else if (npc.id === "seguranca") {
      ctx.fillStyle = "#eab308";
      ctx.fillRect(npcX + TILE_SIZE/2 - 3, npcY + 22 + bob, 2, 2);
    }

    if (gameState.round <= 3 && !gameState.resolvedCrises.includes(npc.id)) {
      drawExclamationMark(npcX + TILE_SIZE/2, npcY - 10);
    }
    
    if (gameState.round <= 3 && getDistanceToNPC(npc) < 48) {
      drawInteractionPrompt(npcX + TILE_SIZE/2, npcY - 26, "Falar com Ministro");
    }
  }

  // 3. Desenhar Jogador (Presidente)
  const px = player.x;
  const py = player.y;

  // Sombra sob os pés
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Sombra mais clara para combinar com chão claro
  ctx.beginPath();
  ctx.ellipse(px + player.width/2, py + player.height - 1, 9, 3, 0, 0, Math.PI*2);
  ctx.fill();

  const walkCycle = Math.floor(Date.now() / 120) % 4;
  const pBob = (player.isMoving) ? Math.sin(Date.now() / 60) * 1.5 : 0;
  
  let leftLegY = py + 24;
  let rightLegY = py + 24;
  
  if (player.isMoving) {
    if (walkCycle === 1) leftLegY -= 2;
    if (walkCycle === 3) rightLegY -= 2;
  }

  // Pernas
  ctx.fillStyle = "#1e293b"; 
  ctx.fillRect(px + 4, leftLegY, 5, 5);
  ctx.fillRect(px + player.width - 9, rightLegY, 5, 5);
  
  // Sapatos
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(px + 3, leftLegY + 4, 6, 2);
  ctx.fillRect(px + player.width - 10, rightLegY + 4, 6, 2);

  // Terno Azul Presidencial
  ctx.fillStyle = "#1e3a8a";
  ctx.fillRect(px + 2, py + 12 + pBob, player.width - 4, 13);
  
  // Camisa branca / gola
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(px + player.width/2 - 3, py + 12 + pBob, 6, 3);

  // Rosto
  ctx.fillStyle = "#fed7aa";
  ctx.fillRect(px + 4, py + 3 + pBob, player.width - 8, 10);

  // Cabelo Grisalho
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(px + 3, py + pBob, player.width - 6, 4);
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(px + 4, py - 1 + pBob, player.width - 8, 2);
  
  if (player.dir === "down") {
    // Gravata Vermelha
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(px + player.width/2 - 1, py + 14 + pBob, 2, 7);
    
    // Olhos
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(px + 6, py + 7 + pBob, 2, 2);
    ctx.fillRect(px + 12, py + 7 + pBob, 2, 2);
    
    // Sobrancelhas
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(px + 5, py + 5 + pBob, 4, 1);
    ctx.fillRect(px + 11, py + 5 + pBob, 4, 1);
  } else if (player.dir === "up") {
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(px + 3, py + 4 + pBob, player.width - 6, 6);
  } else if (player.dir === "left") {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(px + 4, py + 14 + pBob, 2, 4);
    
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(px + 6, py + pBob, 8, 10);
    
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(px + 5, py + 7 + pBob, 2, 2);
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(px + 2, py + 8 + pBob, 2, 2);
  } else if (player.dir === "right") {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(px + player.width - 6, py + 14 + pBob, 2, 4);
    
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(px + player.width - 14, py + pBob, 8, 10);
    
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(px + player.width - 7, py + 7 + pBob, 2, 2);
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(px + player.width - 4, py + 8 + pBob, 2, 2);
  }

  // 4. Efeito de Iluminação de Vinheta (Vignette Claro / Soft Shadow)
  // Vinheta clara para manter o Congresso Nacional iluminado e ensolarado
  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width / 2.8,
    canvas.width / 2, canvas.height / 2, canvas.width / 1.3
  );
  vignette.addColorStop(0, "rgba(255, 255, 255, 0)");
  vignette.addColorStop(1, "rgba(15, 23, 42, 0.07)"); // Apenas um leve sombreamento cinza macio nos cantos distantes
  
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Auxiliar: Calcula distância do jogador a um NPC
function getDistanceToNPC(npc) {
  const playerCenterX = player.x + player.width/2;
  const playerCenterY = player.y + player.height/2;
  const npcCenterX = npc.gridX * TILE_SIZE + TILE_SIZE/2;
  const npcCenterY = npc.gridY * TILE_SIZE + TILE_SIZE/2;
  
  const dx = playerCenterX - npcCenterX;
  const dy = playerCenterY - npcCenterY;
  
  return Math.sqrt(dx*dx + dy*dy);
}

// Desenha o balão flutuante indicando interação pendente
function drawInteractionPrompt(x, y, text) {
  ctx.save();
  ctx.font = "bold 9px sans-serif";
  const textWidth = ctx.measureText(text).width;
  const padX = 8;
  const padY = 4;
  
  // Fundo
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x - textWidth/2 - padX, y - 8 - padY, textWidth + padX*2, 16 + padY, 4);
  ctx.fill();
  ctx.stroke();
  
  // Setinha para baixo
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 8 + padY/2);
  ctx.lineTo(x + 4, y + 8 + padY/2);
  ctx.lineTo(x, y + 12 + padY/2);
  ctx.closePath();
  ctx.fillStyle = "#6366f1";
  ctx.fill();
  
  // Texto
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 4);
  ctx.restore();
}

// Desenha o clássico ponto de exclamação animado do RPG
function drawExclamationMark(x, y) {
  const time = Date.now();
  const bounce = Math.sin(time / 150) * 3; // Efeito flutuar
  
  ctx.save();
  ctx.fillStyle = "#ef4444";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  
  // Caixa do ponto
  ctx.beginPath();
  ctx.arc(x, y + bounce - 6, 3, 0, Math.PI*2); // Círculo superior
  ctx.fillRect(x - 1.5, y + bounce - 14, 3, 7); // Haste
  ctx.fill();
  ctx.stroke();
  
  // Pingo de baixo
  ctx.beginPath();
  ctx.arc(x, y + bounce, 1.5, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

// ================= SISTEMA DE DIÁLOGO E TOMADA DE DECISÃO =================

function handleInteraction() {
  // Se já há um diálogo aberto, o jogador deve tomar a decisão pelas opções e não pelo teclado
  if (!document.getElementById("dialog-box").classList.contains("hidden")) {
    return;
  }
  
  // 1. Procurar NPC mais próximo para interagir
  let closestNPC = null;
  let minDistance = 9999;
  
  for (let key in NPCS) {
    const npc = NPCS[key];
    const dist = getDistanceToNPC(npc);
    if (dist < 48 && dist < minDistance) {
      minDistance = dist;
      closestNPC = npc;
    }
  }
  
  if (!closestNPC) return;
  
  // 2. Executar ação com base no NPC e estado
  if (closestNPC.id === "terminal") {
    if (gameState.round > 3) {
      openAITerminal();
    }
    return;
  }
  
  if (closestNPC.id === "mesa") {
    if (gameState.round <= 3) {
      checkRoundProgression();
    }
    return;
  }
  
  // Conversar com Ministro
  if (gameState.round <= 3) {
    if (gameState.resolvedCrises.includes(closestNPC.id)) {
      // Já resolvida
      openTalkDialog(closestNPC, "Presidente, já colocamos em prática sua decisão para este ano. Vamos acompanhar os impactos nos relatórios do fim de ano.");
    } else {
      // Abrir crise
      openCrisisDialog(closestNPC);
    }
  }
}

// Oculta e Exibe o Mapa 2D para alternar foco com as Caixas de Diálogo
function hideMap() {
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    canvasContainer.classList.add("hidden");
  }
}

function showMap() {
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    canvasContainer.classList.remove("hidden");
  }
}

// Diálogo de conversa normal (sem decisões)
function openTalkDialog(npc, text) {
  hideMap();
  drawAvatarOnCanvas(npc.avatarColor, npc.color);
  document.getElementById("dialog-speaker-name").innerText = npc.name;
  document.getElementById("dialog-speaker-role").innerText = npc.role;
  
  document.getElementById("dialog-options").innerHTML = "";
  document.getElementById("dialog-close-btn").classList.remove("hidden");
  document.getElementById("dialog-box").classList.remove("hidden");
  
  typewriter(text);
}

// Abre diálogo de Crise/Decisão
function openCrisisDialog(npc) {
  hideMap();
  const pasta = npc.id;
  const rodada = gameState.round;
  
  const crise = CRISES_DATA[rodada]?.[pasta];
  if (!crise) return;
  
  gameState.currentCrisis = crise;
  gameState.currentSpeaker = npc;
  
  drawAvatarOnCanvas(npc.avatarColor, npc.color);
  document.getElementById("dialog-speaker-name").innerText = npc.name;
  document.getElementById("dialog-speaker-role").innerText = npc.role;
  document.getElementById("dialog-close-btn").classList.add("hidden");
  
  // Atualiza HUD da Missão Atual para o despacho do ministro
  updateMissionHUD(npc, 2);

  const formattedText = `⚠️ **CRISE: ${crise.titulo}**\n\n${crise.descricao}`;
  
  // Renderizar opções
  const optionsDiv = document.getElementById("dialog-options");
  optionsDiv.innerHTML = "";
  
  crise.opcoes.forEach(opt => {
    const isAffordable = gameState.budget >= opt.custo;
    
    const btn = document.createElement("button");
    btn.className = `dialog-option-btn ${isAffordable ? "" : "disabled"}`;
    btn.onclick = () => {
      if (isAffordable) {
        updateMissionHUD(npc, 3);
        makeDecision(pasta, opt);
      } else {
        alert(`⚠️ ORÇAMENTO INSUFICIENTE: Você possui $${gameState.budget}B, mas esta decisão custa $${opt.custo}B.`);
      }
    };
    
    // Mapeamento dos impactos para pílulas visuais
    const tradName = { economia: "Economia", saude: "Saúde", educacao: "Educação", seguranca: "Segurança", meioambiente: "Meio Amb.", infraestrutura: "Infraest.", satisfacao: "Aprovação", orcamento: "Tesouro" };
    let impactoHTML = Object.keys(opt.impacto).map(k => {
      const val = opt.impacto[k];
      const sign = val > 0 ? '+' : '';
      const cls = val > 0 ? 'positive' : 'negative';
      return `<span class="opt-impact-item ${cls}">${tradName[k] || k}: ${sign}${val}%</span>`;
    }).join(" ");

    // Simulação do Assistente de IA em tempo real ao passar o mouse (Hover)
    btn.onmouseenter = () => {
      let impactText = `🔮 <strong>PROJEÇÃO DE IA - OPÇÃO ${opt.id}:</strong><br>`;
      impactText += `💰 Custo Fiscal: ${opt.custo > 0 ? '$' + opt.custo + ' Bilhões' : 'Sem custo (Austeridade)'}<br>`;
      if (!isAffordable) {
        impactText += `<span style="color:#ef4444; font-weight:bold;">⚠️ VERBA INSUFICIENTE: Custa $${opt.custo}B (Disponível: $${gameState.budget}B).</span><br>`;
      }
      const impactosStr = Object.keys(opt.impacto).map(k => {
        const sign = opt.impacto[k] > 0 ? '+' : '';
        return `${tradName[k] || k} (${sign}${opt.impacto[k]}%)`;
      }).join(", ");
      impactText += `📈 <strong>Impactos:</strong> ${impactosStr}`;
      updateAIAssistant(impactText);
    };
    
    btn.onmouseleave = () => {
      updateAIAssistant();
    };
    
    btn.innerHTML = `
      <span class="opt-badge">${opt.id}</span>
      <div class="option-card-rich">
        <div class="opt-header-row">
          <span class="opt-title-text">${opt.texto}</span>
          <span class="opt-cost-pill ${opt.custo > 0 ? 'paid' : 'free'}">
            ${opt.custo > 0 ? `💰 CUSTO: $${opt.custo}B` : "✨ SEM CUSTO"}
          </span>
        </div>
        <span class="opt-desc">${opt.detalhes}</span>
        <div class="opt-impact-row">
          <strong style="font-size:10px; color:var(--text-muted);">📈 IMPACTOS:</strong> ${impactoHTML}
        </div>
        <div class="opt-btn-action">
          ${isAffordable ? `✅ TOMAR ESTA DECISÃO` : `⚠️ ORÇAMENTO INSUFICIENTE ($${opt.custo}B)`}
        </div>
      </div>
    `;
    
    optionsDiv.appendChild(btn);
  });
  
  document.getElementById("dialog-box").classList.remove("hidden");
  typewriter(formattedText);
}

// Executa a decisão selecionada pelo jogador
function makeDecision(pasta, opcao) {
  // Deduz orçamento
  gameState.budget -= opcao.custo;
  
  // Aplica impactos nos indicadores do país (limita entre 0 e 100)
  Object.keys(opcao.impacto).forEach(key => {
    if (gameState.stats[key] !== undefined) {
      gameState.stats[key] = Math.max(0, Math.min(100, gameState.stats[key] + opcao.impacto[key]));
    }
  });
  
  // O Orçamento do Tesouro Geral é influenciado diretamente pela economia local
  // Economizar verba do ano (custo = 0) aumenta as economias do Tesouro
  const fiscalImpact = Math.round((20 - opcao.custo) * 0.4);
  gameState.stats.orcamento = Math.max(0, Math.min(100, gameState.stats.orcamento + fiscalImpact));
  
  // Adiciona ao histórico de decisões
  gameState.history.push({
    rodada: gameState.round,
    pasta: pasta,
    opcao: opcao
  });
  
  // Marca como resolvida na rodada
  gameState.resolvedCrises.push(pasta);
  
  // Atualiza HUD imediatamente
  updateHUD();
  
  // Gera feedback no painel lateral
  addFeedReactions(opcao.dialogos);
  
  // Fecha diálogo da crise (mantendo o mapa oculto para a cutscene)
  closeDialog(true);
  
  // Dispara a animação 2D de consequência (Cutscene Canvas)
  setTimeout(() => {
    ConsequenceAnimator.play(pasta, opcao, function() {
      // Abre diálogo técnico curto de agradecimento do ministro após a animação
      if (gameState.currentSpeaker) {
        openTalkDialog(gameState.currentSpeaker, opcao.consequencia);
      } else {
        showMap();
      }
    });
  }, 150);
}

// Diálogo de Evento Inesperado
function openEventDialog(event) {
  hideMap();
  gameState.activeEvent = event;
  
  // Desenhar avatar especial de alerta (Vermelho/Alarme)
  drawAvatarOnCanvas("#fee2e2", "#ef4444");
  document.getElementById("dialog-speaker-name").innerText = "ALERTA NACIONAL";
  document.getElementById("dialog-speaker-role").innerText = "Gabinete de Gestão de Crises";
  document.getElementById("dialog-close-btn").classList.add("hidden");
  
  const text = `**EVENTO INESPERADO: ${event.titulo}**\n\n${event.descricao}`;
  
  const optionsDiv = document.getElementById("dialog-options");
  optionsDiv.innerHTML = "";
  
  event.opcoes.forEach((opt, idx) => {
    const isAffordable = gameState.budget >= opt.custo;
    
    const btn = document.createElement("button");
    btn.className = `dialog-option-btn ${isAffordable ? "" : "disabled"}`;
    btn.onclick = () => {
      if (isAffordable) {
        resolveEvent(opt);
      }
    };
    
    btn.innerHTML = `
      <span class="opt-badge">${idx + 1}</span>
      <div class="opt-text-container">
        <span class="opt-title"><strong>${opt.texto}</strong></span>
        <span class="opt-cost">${opt.custo > 0 ? `Custo: $${opt.custo} Bilhões` : "Sem custo fiscal"}</span>
      </div>
    `;
    optionsDiv.appendChild(btn);
  });
  
  document.getElementById("dialog-box").classList.remove("hidden");
  typewriter(text);
}

function resolveEvent(opcao) {
  gameState.budget -= opcao.custo;
  
  // Aplica impactos
  Object.keys(opcao.impacto).forEach(key => {
    if (gameState.stats[key] !== undefined) {
      gameState.stats[key] = Math.max(0, Math.min(100, gameState.stats[key] + opcao.impacto[key]));
    }
  });
  
  const fiscalImpact = Math.round((10 - opcao.custo) * 0.4);
  gameState.stats.orcamento = Math.max(0, Math.min(100, gameState.stats.orcamento + fiscalImpact));
  
  // Registra no histórico como evento
  gameState.history.push({
    rodada: gameState.round,
    pasta: "evento",
    opcao: {
      id: "EVENT",
      texto: gameState.activeEvent.titulo + ": " + opcao.texto,
      custo: opcao.custo,
      consequencia: opcao.consequencia
    }
  });
  
  // Atualiza HUD
  updateHUD();
  
  // Add feed
  const feed = document.getElementById("reactions-feed");
  const feedItem = document.createElement("div");
  feedItem.className = "feed-item press";
  feedItem.innerHTML = `
    <div class="feed-item-header">ALERTA RESOLVIDO <span class="feed-item-time">Agora</span></div>
    <div class="feed-item-content">${opcao.consequencia}</div>
  `;
  feed.insertBefore(feedItem, feed.firstChild);
  
  gameState.activeEvent = null;
  closeDialog(true);
  
  // Avança de rodada efetivamente
  proceedToNextYear();
}

function closeDialog(keepMapHidden = false) {
  document.getElementById("dialog-box").classList.add("hidden");
  if (typewriterTimer) clearInterval(typewriterTimer);
  if (!keepMapHidden) {
    showMap();
  }
}

// Efeito typewriter de máquina de escrever clássico dos RPGs
function typewriter(text) {
  const container = document.getElementById("dialog-text");
  container.innerHTML = "";
  
  if (typewriterTimer) clearInterval(typewriterTimer);
  
  // Substitui formatações markdown simples para negrito
  let cleanText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  cleanText = cleanText.replace(/\n/g, '<br>');
  
  // Para fins pedagógicos e fluidez de gameplay, o typewriter escreve em lotes curtos
  let index = 0;
  let currentHtml = "";
  
  // Cria elementos temporários para escrever sem quebrar tags HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanText;
  const nodes = Array.from(tempDiv.childNodes);
  
  let nodeIndex = 0;
  let textCharIndex = 0;
  
  typewriterTimer = setInterval(() => {
    if (nodeIndex >= nodes.length) {
      clearInterval(typewriterTimer);
      return;
    }
    
    const currentNode = nodes[nodeIndex];
    
    if (currentNode.nodeType === Node.TEXT_NODE) {
      const text = currentNode.textContent;
      if (textCharIndex < text.length) {
        container.innerHTML += text[textCharIndex];
        textCharIndex++;
      } else {
        nodeIndex++;
        textCharIndex = 0;
      }
    } else {
      // É uma tag HTML (como strong ou br), insere inteira de uma vez
      container.appendChild(currentNode.cloneNode(true));
      nodeIndex++;
      textCharIndex = 0;
    }
  }, 10); // Velocidade rápida de renderização
}

// Desenha o avatar do falante no canvas minúsculo da caixa de diálogo
function drawAvatarOnCanvas(bgColor, mainColor) {
  const avCanvas = document.getElementById("dialogAvatarCanvas");
  const avCtx = avCanvas.getContext("2d");
  
  avCtx.fillStyle = bgColor;
  avCtx.fillRect(0, 0, avCanvas.width, avCanvas.height);
  
  // Desenho de terno/ombro retro
  avCtx.fillStyle = mainColor;
  avCtx.beginPath();
  avCtx.arc(40, 68, 25, Math.PI, 0, false);
  avCtx.fill();
  
  // Cabeça
  avCtx.fillStyle = "#ffedd5";
  avCtx.beginPath();
  avCtx.arc(40, 36, 16, 0, Math.PI*2);
  avCtx.fill();
  
  // Cabelo preto básico
  avCtx.fillStyle = "#1e293b";
  avCtx.fillRect(24, 20, 32, 10);
}

// ================= GERENCIAMENTO DE RODADAS E EVENTOS =================

function checkRoundProgression() {
  if (gameState.resolvedCrises.length < 4) {
    // Ainda há ministros pendentes
    const pendentes = 4 - gameState.resolvedCrises.length;
    openTalkDialog(NPCS.mesa, `Presidente, você ainda precisa despachar com mais ${pendentes} Ministros antes de encerrar o Ano ${gameState.round}. Eles estão com alertas (!) em suas salas.`);
    return;
  }
  
  // Se todos resolvidos, prossegue
  openTalkConfirmDialog();
}

function openTalkConfirmDialog() {
  hideMap();
  drawAvatarOnCanvas("#ede9fe", "#8b5cf6");
  document.getElementById("dialog-speaker-name").innerText = "Mesa de Despacho";
  document.getElementById("dialog-speaker-role").innerText = "Diário Oficial";
  document.getElementById("dialog-close-btn").classList.add("hidden");
  
  const text = `**ENCERRAMENTO DO ANO ${gameState.round}**\n\nTodos os relatórios das pastas ministeriais foram assinados. Você gastou as verbas disponíveis e os impactos foram registrados. Deseja encerrar as atividades deste ano fiscal e passar para o próximo ciclo?`;
  
  const optionsDiv = document.getElementById("dialog-options");
  optionsDiv.innerHTML = `
    <button class="dialog-option-btn" onclick="triggerEndOfYear()">
      <span class="opt-badge">1</span>
      <div class="opt-text-container">
        <span class="opt-title"><strong>Sim, publicar despacho oficial e avançar.</strong></span>
      </div>
    </button>
    <button class="dialog-option-btn" onclick="closeDialog()">
      <span class="opt-badge">2</span>
      <div class="opt-text-container">
        <span class="opt-title"><strong>Não, continuar revisando a sala.</strong></span>
      </div>
    </button>
  `;
  
  document.getElementById("dialog-box").classList.remove("hidden");
  typewriter(text);
}

// Gatilho que avalia eventos inesperados e avança o ano
function triggerEndOfYear() {
  closeDialog(true);
  
  // Verifica se dispara algum evento inesperado baseado em triggers
  let triggeredEvent = null;
  for (let event of UNEXPECTED_EVENTS) {
    // Confere se atende gatilho e se já não foi disparado anteriormente no histórico
    const jaOcorreu = gameState.history.some(h => h.opcao.texto && h.opcao.texto.startsWith(event.titulo));
    if (!jaOcorreu && event.gatilho(gameState.stats)) {
      triggeredEvent = event;
      break;
    }
  }
  
  if (triggeredEvent) {
    // Disparar o diálogo do evento! O avanço de ano ocorrerá após resolver o evento
    setTimeout(() => {
      openEventDialog(triggeredEvent);
    }, 200);
  } else {
    // Sem eventos, avança direto
    proceedToNextYear();
  }
}

// Avalia as decisões tomadas e retorna as consequências correspondentes para a rodada seguinte
function avaliarConsequencias(rodadaAnterior) {
  let consequencias = [];
  
  // Filtra as decisões tomadas especificamente na rodada que acabou
  const decisoesRodada = gameState.history.filter(h => h.rodada === rodadaAnterior);
  
  decisoesRodada.forEach(dec => {
    const pasta = dec.pasta;
    const opcaoId = dec.opcao.id;
    
    if (rodadaAnterior === 1) {
      if (pasta === "saude" && opcaoId === "C") {
        consequencias.push({
          titulo: "Colapso Sanitário de Pandemia",
          descricao: "A decisão de ignorar a quarentena e priorizar a economia sem restrições médicas resultou em hospitais superlotados e filas funerárias históricas.",
          impacto: { saude: -15, satisfacao: -15 }
        });
      }
      if (pasta === "educacao" && opcaoId === "C") {
        consequencias.push({
          titulo: "Ocupação Universitária e Escolar",
          descricao: "A concessão das escolas gerou protestos de sindicatos. Alunos e professores ocuparam 40% das instituições federais contra a privatização.",
          impacto: { educacao: -10, satisfacao: -10 }
        });
      }
      if (pasta === "seguranca" && opcaoId === "C") {
        consequencias.push({
          titulo: "Tragédia de Violência Urbana",
          descricao: "A liberação do porte de armas gerou um aumento exponencial de homicídios comuns por desentendimentos banais de trânsito e familiares.",
          impacto: { seguranca: -15, satisfacao: -10 }
        });
      }
      if (pasta === "economia" && opcaoId === "C") {
        consequencias.push({
          titulo: "Comércio Quebrado e Desemprego",
          descricao: "O racionamento severo de energia e as tarifas escarlates altas sufocaram as finanças de pequenas indústrias e comércios locais, forçando falências.",
          impacto: { economia: -10, satisfacao: -15 }
        });
      }
    } else if (rodadaAnterior === 2) {
      if (pasta === "saude" && opcaoId === "C") {
        consequencias.push({
          titulo: "Crise Congênita de Zika e Dengue",
          descricao: "Sem ações sanitárias físicas, o surto avançou. O aumento crítico de bebês com microcefalia levou famílias a processarem a União por descaso.",
          impacto: { saude: -15, satisfacao: -15 }
        });
      }
      if (pasta === "educacao" && opcaoId === "C") {
        consequencias.push({
          titulo: "Apagão Científico (Fuga de Cérebros)",
          descricao: "O corte radical de bolsas na pós-graduação de humanas gerou greve de pesquisadores e causou a emigração massiva de cérebros para o exterior.",
          impacto: { educacao: -15, economia: -10 }
        });
      }
      if (pasta === "seguranca" && opcaoId === "C") {
        consequencias.push({
          titulo: "Invasão Crítica de Sistemas Públicos",
          descricao: "Sem investimento na agência digital de segurança, hackers vazaram na Deep Web os dados fiscais e o sigilo bancário de milhões de contribuintes.",
          impacto: { seguranca: -15, infraestrutura: -15 }
        });
      }
      if (pasta === "economia" && opcaoId === "C") {
        consequencias.push({
          titulo: "A Revolta Popular da Fome",
          descricao: "A alta drástica dos juros segurou a inflação no mercado, mas sem programas de cestas básicas subsidiadas, famílias saquearam supermercados nas capitais.",
          impacto: { satisfacao: -20, economia: -10 }
        });
      }
      if (pasta === "economia" && opcaoId === "B") {
        consequencias.push({
          titulo: "Falência de Agricultores Familiares",
          descricao: "A zeragem de tarifas de importação inundou os mercados com grãos estrangeiros subsidiados, inviabilizando a concorrência e quebrando o produtor nacional menor.",
          impacto: { economia: -10, orcamento: -10 }
        });
      }
    }
  });
  
  return consequencias;
}

function proceedToNextYear() {
  const rodadaAnterior = gameState.round;
  
  if (gameState.round < 3) {
    gameState.round++;
    gameState.budget = getAnnualBudget(); // Renova a verba anual do perfil
    gameState.resolvedCrises = []; // Reseta ministros despachados
    
    // Reposiciona o presidente no centro
    player.x = 12 * TILE_SIZE + 6;
    player.y = 9 * TILE_SIZE;
    player.dir = "up";
    
    // 1. Calcula as consequências da gestão do ano anterior
    const consequencias = avaliarConsequencias(rodadaAnterior);
    
    // 2. Aplica as penalidades nos indicadores
    consequencias.forEach(c => {
      Object.keys(c.impacto).forEach(key => {
        if (gameState.stats[key] !== undefined) {
          gameState.stats[key] = Math.max(0, Math.min(100, gameState.stats[key] + c.impacto[key]));
        }
      });
    });
    
    // 3. Atualiza os gráficos do HUD
    updateHUD();
    
    // Add feed de rodada
    const feed = document.getElementById("reactions-feed");
    
    // Limpa o placeholder no primeiro feed
    const placeholder = feed.querySelector(".feed-placeholder");
    if (placeholder) {
      feed.innerHTML = "";
    }
    
    const feedItem = document.createElement("div");
    feedItem.className = "feed-item governors";
    feedItem.innerHTML = `
      <div class="feed-item-header">ANO ${gameState.round} INICIADO <span class="feed-item-time">Agora</span></div>
      <div class="feed-item-content">Orçamento de $${gameState.budget}B liberado. Fale com os ministros no palácio para resolver as novas crises.</div>
    `;
    feed.insertBefore(feedItem, feed.firstChild);
    
    // 4. Constrói o texto do relatório de consequências
    if (consequencias.length > 0) {
      let relatorioTexto = `**DIÁRIO OFICIAL: RELATÓRIO DE IMPACTO DE GOVERNANÇA (ANO ${rodadaAnterior})**\n\nPresidente, a análise dos dados do ano anterior aponta que certas escolhas geraram graves desdobramentos inevitáveis para a nação:\n\n`;
      
      consequencias.forEach((c, idx) => {
        relatorioTexto += `🔴 **${c.titulo}**\n*Ocorrência*: ${c.descricao}\n*Impactos*: `;
        const impactosString = Object.keys(c.impacto).map(k => {
          const trad = {
            economia: "Economia", saude: "Saúde", educacao: "Educação",
            seguranca: "Segurança", meioambiente: "Meio Ambiente",
            infraestrutura: "Infraestrutura", satisfacao: "Aprovação Popular",
            orcamento: "Orçamento"
          };
          return `${trad[k] || k} (${c.impacto[k]}%)`;
        }).join(", ");
        relatorioTexto += `${impactosString}\n\n`;
        
        // Adiciona cada consequência como manchete no feed
        const feedC = document.createElement("div");
        feedC.className = "feed-item press";
        feedC.innerHTML = `
          <div class="feed-item-header">MANCHETE CRÍTICA <span class="feed-item-time">Ano ${rodadaAnterior}</span></div>
          <div class="feed-item-content"><strong>${c.titulo}</strong>: ${c.descricao}</div>
        `;
        feed.insertBefore(feedC, feed.firstChild);
      });
      
      relatorioTexto += `Esses problemas penalizaram nossos indicadores e inflaram a insatisfação social. Precisamos rever nossas prioridades de investimentos.`;
      
      // Mostra o Diário Oficial com efeito typewriter
      setTimeout(() => {
        openTalkDialog(NPCS.mesa, relatorioTexto);
      }, 250);
    } else {
      // Caso não tenha nenhuma escolha inadequada de custo zero (austeridade prejudicial)
      setTimeout(() => {
        openTalkDialog(NPCS.mesa, `Ano ${gameState.round} iniciado, Presidente! Seu governo anterior evitou colapsos diretos. Fale com os Ministros para priorizar a distribuição dos novos $100B.`);
      }, 250);
    }
  } else {
    // FIM DO JOGO / MANDATO CONCLUÍDO
    gameState.round = 4; // Fim
    updateHUD();
    
    const feed = document.getElementById("reactions-feed");
    
    // Limpa o placeholder no primeiro feed
    const placeholder = feed.querySelector(".feed-placeholder");
    if (placeholder) {
      feed.innerHTML = "";
    }
    
    const feedItem = document.createElement("div");
    feedItem.className = "feed-item ministers";
    feedItem.innerHTML = `
      <div class="feed-item-header">MANDATO CONCLUÍDO <span class="feed-item-time">Agora</span></div>
      <div class="feed-item-content">Governança encerrada. Caminhe até o Terminal de IA no canto do gabinete para processar a análise final das suas decisões.</div>
    `;
    feed.insertBefore(feedItem, feed.firstChild);
    
    setTimeout(() => {
      openTalkDialog(NPCS.mesa, "Presidente, seu mandato de 3 anos chegou ao fim! Suas decisões moldaram o destino deste país. Por favor, acione o Terminal de Inteligência Artificial no gabinete para processar o relatório de desempenho.");
    }, 200);
  }
}

// ================= ATUALIZADORES DE RENDER E UI HUD =================

function updateHUD() {
  // Orçamento
  document.getElementById("hud-budget").innerText = `$${gameState.budget}B`;
  
  // Ano / Rodada
  if (gameState.round <= 3) {
    document.getElementById("hud-round").innerText = `Ano ${gameState.round} / 3`;
  } else {
    document.getElementById("hud-round").innerText = "Mandato Concluído";
  }
  
  // Atualiza barras de progresso, porcentagens e tags de acessibilidade
  Object.keys(gameState.stats).forEach(key => {
    const val = gameState.stats[key];
    const bar = document.getElementById(`stat-bar-${key}`);
    const valSpan = document.getElementById(`stat-val-${key}`);
    const tag = document.getElementById(`stat-tag-${key}`);
    
    if (bar) bar.style.width = `${val}%`;
    if (valSpan) valSpan.innerText = `${val}%`;

    if (tag) {
      if (val >= 65) {
        tag.innerText = "🟢 BOM";
        tag.className = "status-tag good";
      } else if (val >= 35) {
        tag.innerText = "🟡 ATENÇÃO";
        tag.className = "status-tag warning";
      } else {
        tag.innerText = "🔴 CRÍTICO";
        tag.className = "status-tag critical";
      }
    }
  });

  // Atualiza a Missão HUD
  updateMissionHUD();

  // Atualiza o Assistente de IA Presidencial
  updateAIAssistant();
}

// Atualizador do Assistente de IA Presidencial no Painel Lateral Web
function updateAIAssistant(customText = null) {
  const contentDiv = document.getElementById("ia-assistant-content");
  if (!contentDiv) return;

  if (customText) {
    contentDiv.innerHTML = customText;
    return;
  }

  // Identifica setores críticos (abaixo de 30%)
  const crises = [];
  const trad = {
    economia: "Economia", saude: "Saúde", educacao: "Educação",
    seguranca: "Segurança", meioambiente: "Meio Ambiente",
    infraestrutura: "Infraestrutura", satisfacao: "Aprovação Popular"
  };

  Object.keys(gameState.stats).forEach(key => {
    if (gameState.stats[key] < 30 && key !== "orcamento") {
      crises.push(`${trad[key] || key} (${gameState.stats[key]}%)`);
    }
  });

  let html = `🤖 <strong>[ASSISTENTE VIRTUAL]</strong><br>`;
  if (crises.length > 0) {
    html += `<div class="ia-alert-urgent">🚨 <strong>ALERTA DE CRISE:</strong> Setores em estado crítico (< 30%):<br>${crises.join(", ")}</div>`;
  } else if (gameState.stats.satisfacao >= 70) {
    html += `🌟 <strong>EXCELENTE GOVERNANÇA:</strong> Aprovação popular elevada! O país prospera sob seu mandato.`;
  } else {
    html += `📊 <strong>STATUS DO GOVERNO:</strong> Indicadores sob controle. Passe o mouse sobre as opções para simular o impacto.`;
  }

  contentDiv.innerHTML = html;
}

// Adiciona reações dos grupos de interesse no painel de feeds lateral
function addFeedReactions(dialogos) {
  const feed = document.getElementById("reactions-feed");
  
  // Limpa o placeholder no primeiro feed
  const placeholder = feed.querySelector(".feed-placeholder");
  if (placeholder) {
    feed.innerHTML = "";
  }
  
  // Mapeamento dos grupos, estilos de CSS e ícones
  const grupos = [
    { key: "imprensa", class: "press", header: "Imprensa Nacional" },
    { key: "empresarios", class: "business", header: "Líderes Empresariais" },
    { key: "trabalhadores", class: "workers", header: "Central de Trabalhadores" },
    { key: "governadores", class: "governors", header: "Fórum de Governadores" },
    { key: "ministros", class: "ministers", header: "Conselho de Ministros" }
  ];
  
  // Insere as reações ordenadas de forma reversa (mais recentes em cima)
  grupos.forEach(grp => {
    if (dialogos[grp.key]) {
      const feedItem = document.createElement("div");
      feedItem.className = `feed-item ${grp.class}`;
      feedItem.innerHTML = `
        <div class="feed-item-header">${grp.header} <span class="feed-item-time">Agora</span></div>
        <div class="feed-item-content">${dialogos[grp.key]}</div>
      `;
      feed.insertBefore(feedItem, feed.firstChild);
    }
  });
  
  // Atualiza ícones dinamicamente
  lucide.createIcons();
}

// ================= TERMINAL DE INTELIGÊNCIA ARTIFICIAL (TELA FINAL) =================

function openAITerminal() {
  gameState.gameActive = false; // Para o Canvas loop
  
  // Exibe a tela de relatório
  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("report-screen").classList.add("active");
  
  // Calcula afinidade dos perfis
  const perfis = AIEngine.calcularPerfis(gameState.history, gameState.stats);
  const dominanteId = AIEngine.obterPerfilDominante(perfis);
  const metaDominante = AIEngine.PERFIS_METADATA[dominanteId];
  
  // Configura card de perfil dominante
  document.getElementById("result-profile-name").innerText = metaDominante.nome;
  document.getElementById("result-profile-sub").innerText = metaDominante.subtitulo;
  
  const iconBox = document.getElementById("result-profile-icon");
  iconBox.innerHTML = `<i data-lucide="${metaDominante.icon}"></i>`;
  iconBox.style.backgroundColor = metaDominante.cor;
  document.getElementById("profile-result-box").style.borderColor = metaDominante.cor;
  document.getElementById("profile-result-box").style.boxShadow = `0 0 30px ${metaDominante.cor}25`;
  
  // Gera relatório local heurístico imediatamente
  const relatorioLocal = AIEngine.gerarRelatorioLocal(gameState.history, gameState.stats, perfis);
  document.getElementById("report-text").innerHTML = formatMarkdown(relatorioLocal);
  
  // Carrega chave salva do Gemini e tenta gerar relatório por IA se houver chave cadastrada
  const savedKey = localStorage.getItem("gemini_api_key");
  const keyInput = document.getElementById("gemini-api-key");
  if (savedKey && keyInput) {
    keyInput.value = savedKey;
    gerarRelatorioIA(savedKey, perfis);
  }
  
  // Desenha gráfico de radar
  renderRadarChart(perfis);
  
  // Confetes festivos do fim de mandato!
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
  
  lucide.createIcons();
}

// Faz a renderização do radar chart de perfis usando Chart.js
function renderRadarChart(perfis) {
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }
  
  const ctxChart = document.getElementById("radarChart").getContext("2d");
  
  const dados = [
    perfis.fiscal,
    perfis.assistencial,
    perfis.desenvolvimento,
    perfis.ambiental,
    perfis.tecnocratico,
    perfis.populista,
    perfis.equilibrio
  ];
  
  radarChartInstance = new Chart(ctxChart, {
    type: 'radar',
    data: {
      labels: [
        'Fiscal',
        'Social',
        'Crescimento',
        'Ambiental',
        'Tecnocrático',
        'Populismo',
        'Equilíbrio'
      ],
      datasets: [{
        label: 'Afinidade de Governança (%)',
        data: dados,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          grid: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: {
            color: '#9ca3af',
            font: { family: 'Outfit', size: 11, weight: 'bold' }
          },
          ticks: {
            backdropColor: 'transparent',
            color: 'rgba(255,255,255,0.3)',
            showLabelBackdrop: false,
            font: { size: 9 },
            stepSize: 20
          },
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Aciona a geração de relatório com Gemini API
async function gerarRelatorioIA(apiKey, perfis) {
  const loadingDiv = document.getElementById("report-loading");
  const reportTextDiv = document.getElementById("report-text");
  
  if (loadingDiv) loadingDiv.classList.remove("hidden");
  reportTextDiv.style.opacity = "0.3";
  
  try {
    const relatorioIA = await AIEngine.gerarRelatorioGemini(
      apiKey,
      gameState.history,
      gameState.stats,
      perfis
    );
    reportTextDiv.innerHTML = formatMarkdown(relatorioIA);
  } catch (error) {
    console.error(error);
    alert("Não foi possível gerar o relatório pela API do Gemini. Exibindo relatório local padrão do simulador.\nDetalhes: " + error.message);
    // Fallback já está desenhado
  } finally {
    if (loadingDiv) loadingDiv.classList.add("hidden");
    reportTextDiv.style.opacity = "1";
  }
}

// Configurações da Chave Gemini
function toggleGeminiKeySection() {
  const body = document.getElementById("gemini-key-body");
  const arrow = document.getElementById("gemini-arrow");
  body.classList.toggle("hidden");
  arrow.style.transform = body.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
}

function saveGeminiKey() {
  const key = document.getElementById("gemini-api-key").value.trim();
  if (key) {
    localStorage.setItem("gemini_api_key", key);
    alert("API Key salva com sucesso! O relatório avançado será carregado.");
    const perfis = AIEngine.calcularPerfis(gameState.history, gameState.stats);
    gerarRelatorioIA(key, perfis);
  } else {
    alert("Por favor, insira uma chave válida.");
  }
}

function clearGeminiKey() {
  localStorage.removeItem("gemini_api_key");
  document.getElementById("gemini-api-key").value = "";
  alert("Chave apagada. O simulador voltará a usar o motor de relatórios local.");
  
  const perfis = AIEngine.calcularPerfis(gameState.history, gameState.stats);
  const relatorioLocal = AIEngine.gerarRelatorioLocal(gameState.history, gameState.stats, perfis);
  document.getElementById("report-text").innerHTML = formatMarkdown(relatorioLocal);
}

// Parser simplificado de Markdown para HTML
function formatMarkdown(md) {
  // O relatório pode vir de um serviço externo; escape antes de aplicar o
  // subconjunto de Markdown suportado para evitar inserir HTML arbitrário.
  let html = String(md)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
  
  // Headers
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  
  // Negrito e Itálico
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Listas
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
  // Ajusta múltiplos <ul> seguidos
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Tabelas
  // Substitui linhas de tabelas markdown simples
  html = html.replace(/\| (.*?) \|/g, (match, p1) => {
    const cells = p1.split(' | ').map(c => `<td>${c.trim()}</td>`).join('');
    return `<tr>${cells}</tr>`;
  });
  // Embrulha blocos de <tr> em tabelas
  html = html.replace(/(<tr>.*?<\/tr>)/gs, '<table>$1</table>');
  // Remove linhas separadoras de tabela markdown (---)
  html = html.replace(/<table><tr><td>:?---:?<\/td>.*?<\/tr><\/table>/g, '');
  
  // Parágrafos
  // Limpa quebras de linhas duplas para gerar tags p
  html = html.replace(/\n\n(?!<h|<ul|<block|<table)/g, '</p><p>');
  
  return `<p>${html}</p>`.replace(/<p>\s*<\/p>/g, '');
}

function restartGame() {
  // Oculta relatório, Mostra Introdução
  document.getElementById("report-screen").classList.remove("active");
  document.getElementById("intro-screen").classList.add("active");
  
  // Limpa formulário
  document.getElementById("president-name").value = "";
  document.getElementById("party-name").value = "";

  // A interface volta a destacar o perfil equilibrado; o estado precisa
  // acompanhar essa escolha para que uma nova partida não herde o perfil
  // fiscal anterior.
  gameState.countryProfile = "balanced";
  document.querySelectorAll(".profile-card").forEach((card, index) => {
    card.classList.toggle("selected", index === 0);
  });

  gameState.gameActive = false;
}
window.startNewGame = startNewGame;
window.selectCountryProfile = selectCountryProfile;
window.closeDialog = closeDialog;
window.triggerEndOfYear = triggerEndOfYear;
window.restartGame = restartGame;
window.toggleGeminiKeySection = toggleGeminiKeySection;
window.saveGeminiKey = saveGeminiKey;
window.clearGeminiKey = clearGeminiKey;
window.showTutorialModal = showTutorialModal;
window.closeTutorialModal = closeTutorialModal;
