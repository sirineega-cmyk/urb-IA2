/**
 * ConsequenceAnimator - Motor de Animação 2D Pixel Art em Alta Definição
 * Renderiza 3 cenas detalhadas em estilo 16-bit com física de partículas,
 * tráfego de veículos com iluminação e cidadãos animados com reações reais.
 */

const ConsequenceAnimator = (function() {
  let displayCanvas = null;
  let displayCtx = null;
  let bufferCanvas = null;
  let bufferCtx = null;
  
  // Resolução interna Pixel-Art (16-bit retro HD)
  const V_WIDTH = 384;
  const V_HEIGHT = 216;

  let animFrameId = null;
  let sceneIndex = 0; // 0: Anúncio, 1: Cidade/Infraestrutura, 2: Cidadãos/Ruas
  let sceneTimer = 0;
  let transitionAlpha = 0; // Fade transição
  let isTransitioning = false;

  let sceneData = null;
  let particles = [];
  let citizens = [];
  let vehicles = [];
  let timeStep = 0;

  // Avalia o resultado da escolha
  function evaluateOutcome(opcao) {
    const impactos = opcao.impacto || {};
    let totalScore = 0;
    let posCount = 0;
    let negCount = 0;

    Object.keys(impactos).forEach(k => {
      const val = impactos[k];
      totalScore += val;
      if (val > 0) posCount++;
      if (val < 0) negCount++;
    });

    if (totalScore >= 15 || (posCount > negCount && totalScore > 0)) return "good";
    if (totalScore <= -10 || (negCount >= posCount && totalScore < 0)) return "bad";
    return "mixed";
  }

  // Desenha retângulo pixel-perfect
  function pRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // Desenha círculo em pixel art
  function pCircle(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    cx = Math.round(cx);
    cy = Math.round(cy);
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r) {
          ctx.fillRect(cx + x, cy + y, 1, 1);
        }
      }
    }
  }

  // Desenha cidadão detalhado em Pixel Art
  function drawPixelCitizen(ctx, x, y, animFrame, state, colorShirt, isProtesting) {
    x = Math.round(x);
    y = Math.round(y);

    const bob = (animFrame % 2 === 0) ? 0 : -1;
    const legOffset = (animFrame % 4 === 1) ? 2 : (animFrame % 4 === 3) ? -2 : 0;

    // Sombra nos pés
    pRect(ctx, x - 3, y + 15, 8, 2, "rgba(0,0,0,0.3)");

    // Pernas / Calças
    pRect(ctx, x - 2, y + 10 + legOffset, 2, 5, "#1e293b");
    pRect(ctx, x + 2, y + 10 - legOffset, 2, 5, "#1e293b");

    // Sapatos
    pRect(ctx, x - 3, y + 14 + legOffset, 3, 2, "#0f172a");
    pRect(ctx, x + 2, y + 14 - legOffset, 3, 2, "#0f172a");

    // Tronco / Camisa
    pRect(ctx, x - 3, y + 3 + bob, 8, 7, colorShirt);

    // Braços e Reações
    if (state === "happy") {
      // Braços levantados comemoração
      pRect(ctx, x - 5, y + bob, 2, 5, colorShirt);
      pRect(ctx, x + 5, y + bob, 2, 5, colorShirt);
      // Mãozinhas
      pRect(ctx, x - 5, y - 2 + bob, 2, 2, "#fed7aa");
      pRect(ctx, x + 5, y - 2 + bob, 2, 2, "#fed7aa");
    } else if (state === "sad" || isProtesting) {
      if (isProtesting) {
        // Segurando cabo do cartaz
        pRect(ctx, x + 3, y - 2 + bob, 2, 8, colorShirt);
        // Haste do cartaz
        pRect(ctx, x + 4, y - 12 + bob, 1, 14, "#78350f");
        // Placa do cartaz de protesto
        pRect(ctx, x - 2, y - 18 + bob, 14, 8, "#fef08a");
        pRect(ctx, x - 1, y - 17 + bob, 12, 6, "#ef4444"); // Texto vermelho impresso
      } else {
        // Braços cruzados ou abaixados
        pRect(ctx, x - 4, y + 5 + bob, 2, 4, colorShirt);
        pRect(ctx, x + 4, y + 5 + bob, 2, 4, colorShirt);
      }
    } else {
      // Caminhando normal
      pRect(ctx, x - 4, y + 4 + bob + legOffset, 2, 4, colorShirt);
      pRect(ctx, x + 4, y + 4 + bob - legOffset, 2, 4, colorShirt);
    }

    // Cabeça / Tom de pele
    pRect(ctx, x - 3, y - 4 + bob, 8, 7, "#fed7aa");

    // Cabelo
    pRect(ctx, x - 3, y - 6 + bob, 8, 3, "#334155");

    // Olhos e Expressão
    if (state === "happy") {
      pRect(ctx, x - 1, y - 2 + bob, 2, 1, "#0f172a");
      pRect(ctx, x + 3, y - 2 + bob, 2, 1, "#0f172a");
      // Sorriso
      pRect(ctx, x, y + bob, 4, 1, "#ef4444");
    } else if (state === "sad") {
      pRect(ctx, x - 1, y - 2 + bob, 2, 1, "#0f172a");
      pRect(ctx, x + 3, y - 2 + bob, 2, 1, "#0f172a");
      // Boca triste
      pRect(ctx, x + 1, y + 1 + bob, 2, 1, "#0f172a");
    } else {
      pRect(ctx, x - 1, y - 2 + bob, 2, 2, "#0f172a");
      pRect(ctx, x + 3, y - 2 + bob, 2, 2, "#0f172a");
    }
  }

  // Desenha Veículo detalhado em Pixel Art (Ambulância, Polícia, Carro Comum)
  function drawPixelVehicle(ctx, x, y, type, outcome, frame) {
    x = Math.round(x);
    y = Math.round(y);

    if (type === "ambulance") {
      // Sombra
      pRect(ctx, x - 2, y + 16, 44, 3, "rgba(0,0,0,0.3)");
      // Chassi branco
      pRect(ctx, x, y, 40, 16, "#f8fafc");
      // Teto e detalhes
      pRect(ctx, x + 2, y - 2, 26, 2, "#e2e8f0");
      // Cabine
      pRect(ctx, x + 28, y + 3, 10, 8, "#38bdf8"); // Vidro parabrisa
      // Faixa de emergência
      pRect(ctx, x, y + 9, 38, 3, "#ef4444");
      // Cruz vermelha na lateral
      pRect(ctx, x + 12, y + 3, 6, 2, "#ef4444");
      pRect(ctx, x + 14, y + 1, 2, 6, "#ef4444");

      // Rodas animadas
      const rSpin = (frame % 2 === 0);
      pCircle(ctx, x + 8, y + 16, 3, "#0f172a");
      pCircle(ctx, x + 32, y + 16, 3, "#0f172a");
      pRect(ctx, x + 8, y + 16, 1, 1, rSpin ? "#94a3b8" : "#ffffff");
      pRect(ctx, x + 32, y + 16, 1, 1, rSpin ? "#ffffff" : "#94a3b8");

      // Giroflex no teto
      const sirenOn = Math.floor(frame / 6) % 2 === 0;
      const sColor = sirenOn ? (outcome === "good" ? "#10b981" : "#ef4444") : "#0284c7";
      pRect(ctx, x + 16, y - 4, 6, 2, sColor);

      // Brilho do Farol dianteiro
      pRect(ctx, x + 39, y + 10, 2, 3, "#fef08a");
      if (sirenOn) {
        ctx.fillStyle = "rgba(254, 240, 138, 0.2)";
        ctx.beginPath();
        ctx.moveTo(x + 41, y + 9);
        ctx.lineTo(x + 65, y + 3);
        ctx.lineTo(x + 65, y + 19);
        ctx.closePath();
        ctx.fill();
      }

    } else if (type === "police") {
      // Sombra
      pRect(ctx, x - 2, y + 14, 38, 3, "rgba(0,0,0,0.3)");
      // Carro de Polícia Preto e Branco
      pRect(ctx, x, y + 4, 34, 10, "#0f172a");
      pRect(ctx, x + 8, y, 18, 5, "#ffffff"); // Teto branco
      pRect(ctx, x + 10, y + 1, 6, 3, "#38bdf8"); // Vidro
      pRect(ctx, x + 20, y + 1, 5, 3, "#38bdf8");

      // Rodas
      pCircle(ctx, x + 7, y + 14, 3, "#0f172a");
      pCircle(ctx, x + 27, y + 14, 3, "#0f172a");

      // Giroflex
      const sirenOn = Math.floor(frame / 5) % 2 === 0;
      pRect(ctx, x + 14, y - 2, 3, 2, sirenOn ? "#ef4444" : "#1d4ed8");
      pRect(ctx, x + 17, y - 2, 3, 2, sirenOn ? "#1d4ed8" : "#ef4444");

    } else {
      // Carro Passeio Civil
      pRect(ctx, x, y + 4, 32, 9, "#2563eb");
      pRect(ctx, x + 6, y, 16, 5, "#1d4ed8");
      pRect(ctx, x + 8, y + 1, 5, 3, "#bae6fd");
      pCircle(ctx, x + 6, y + 13, 3, "#0f172a");
      pCircle(ctx, x + 24, y + 13, 3, "#0f172a");
    }
  }

  // Inicializa os elementos da cena atual
  function setupSceneElements() {
    particles = [];
    citizens = [];
    vehicles = [];
    timeStep = 0;

    const { pasta, outcome } = sceneData;

    // Criar Cidadãos de acordo com a cena
    if (sceneIndex === 0) {
      // CENA 1: Praça da Capital com pessoas paradas olhando o telão
      for (let i = 0; i < 9; i++) {
        citizens.push({
          x: 40 + i * 36 + Math.random() * 8,
          y: V_HEIGHT - 35 + (i % 3) * 6,
          state: outcome === "good" ? "happy" : (outcome === "bad" ? "sad" : "normal"),
          shirt: ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"][i % 5],
          animFrame: i,
          isProtesting: false
        });
      }
    } else if (sceneIndex === 1) {
      // CENA 2: Infraestrutura com tráfego de veículos
      if (pasta === "saude" || pasta === "seguranca") {
        vehicles.push({ x: -50, y: V_HEIGHT - 38, type: pasta === "saude" ? "ambulance" : "police", speed: 1.8 });
      } else {
        vehicles.push({ x: -40, y: V_HEIGHT - 36, type: "civil", speed: 1.4 });
      }

      for (let i = 0; i < 5; i++) {
        citizens.push({
          x: 30 + i * 70,
          y: V_HEIGHT - 30,
          state: outcome === "good" ? "happy" : "normal",
          shirt: ["#3b82f6", "#10b981", "#f59e0b"][i % 3],
          animFrame: i * 2,
          isProtesting: false
        });
      }
    } else if (sceneIndex === 2) {
      // CENA 3: Ruas da cidade com multidão reagindo (Manifestação ou Celebração)
      const count = outcome === "bad" ? 14 : 12;
      for (let i = 0; i < count; i++) {
        citizens.push({
          x: 15 + i * 25 + Math.random() * 6,
          y: V_HEIGHT - 36 + (i % 4) * 5,
          state: outcome === "good" ? "happy" : "sad",
          shirt: ["#ef4444", "#2563eb", "#059669", "#d97706", "#7c3aed"][i % 5],
          animFrame: Math.floor(Math.random() * 4),
          isProtesting: outcome === "bad"
        });
      }
    }

    // Sistema de Partículas (Chuva, Moedas, Estrelas, Corações)
    if (outcome === "bad") {
      // Chuva forte em pixel art
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * V_WIDTH,
          y: Math.random() * V_HEIGHT,
          speed: 4 + Math.random() * 4,
          len: 4 + Math.random() * 4
        });
      }
    } else if (outcome === "good") {
      const pCount = pasta === "economia" ? 35 : 20;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * V_WIDTH,
          y: Math.random() * -V_HEIGHT,
          vy: 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.8,
          size: 2 + Math.random() * 3,
          color: pasta === "economia" ? "#fbbf24" : (pasta === "saude" ? "#34d399" : "#a78bfa")
        });
      }
    }
  }

  // Renderiza a cena no Buffer Canvas em Pixel Art
  function renderPixelScene() {
    timeStep++;
    const ctx = bufferCtx;
    const { pasta, outcome } = sceneData;

    // 1. CÉU E CLIMA
    if (outcome === "good") {
      pRect(ctx, 0, 0, V_WIDTH, V_HEIGHT, "#38bdf8"); // Céu Azul Claro
      // Sol Radiante Pixel
      pCircle(ctx, V_WIDTH - 40, 35, 16, "#fef08a");
      pCircle(ctx, V_WIDTH - 40, 35, 12, "#fde047");
    } else if (outcome === "bad") {
      pRect(ctx, 0, 0, V_WIDTH, V_HEIGHT, "#1e293b"); // Céu Noturno Tempestuoso
      // Efeito de relâmpago piscante
      if (Math.random() < 0.02) {
        pRect(ctx, 0, 0, V_WIDTH, V_HEIGHT, "#94a3b8");
      }
    } else {
      pRect(ctx, 0, 0, V_WIDTH, V_HEIGHT, "#fb923c"); // Pôr do sol
    }

    // Nuvens Pixeladas
    const cloudColor = outcome === "bad" ? "#475569" : "#ffffff";
    const cX = (timeStep * 0.2) % (V_WIDTH + 80) - 40;
    pRect(ctx, cX, 20, 40, 10, cloudColor);
    pRect(ctx, cX + 8, 14, 24, 6, cloudColor);

    const cX2 = (timeStep * 0.12 + 180) % (V_WIDTH + 80) - 40;
    pRect(ctx, cX2, 35, 50, 12, cloudColor);
    pRect(ctx, cX2 + 10, 27, 30, 8, cloudColor);

    // 2. PRÉDIOS E BACKGROUND PARALLAX
    const bgBuildingColor = outcome === "bad" ? "#0f172a" : "#cbd5e1";
    pRect(ctx, 10, 80, 50, 90, bgBuildingColor);
    pRect(ctx, 70, 60, 65, 110, bgBuildingColor);
    pRect(ctx, 240, 75, 55, 95, bgBuildingColor);
    pRect(ctx, 310, 90, 60, 80, bgBuildingColor);

    // Janelas acesas nos prédios do fundo
    const windowColor = outcome === "bad" ? "#f59e0b" : "#ffffff";
    for (let wx = 75; wx < 130; wx += 14) {
      for (let wy = 70; wy < 160; wy += 18) {
        if ((wx + wy + Math.floor(timeStep/30)) % 3 !== 0) {
          pRect(ctx, wx, wy, 6, 8, windowColor);
        }
      }
    }

    // 3. RENDERIZAÇÃO DA CENA ESPECÍFICA (0, 1 ou 2)

    // CENA 0: O ANÚNCIO NO TELÃO DA PRAÇA
    if (sceneIndex === 0) {
      // Grande Estrutura de Telão de LED no Centro da Capital
      const tX = V_WIDTH / 2 - 75;
      const tY = 40;
      const tW = 150;
      const tH = 85;

      // Postes de sustentação metálicos
      pRect(ctx, tX + 15, tY + tH, 8, V_HEIGHT - (tY + tH) - 20, "#475569");
      pRect(ctx, tX + tW - 23, tY + tH, 8, V_HEIGHT - (tY + tH) - 20, "#475569");

      // Moldura da TV
      pRect(ctx, tX - 4, tY - 4, tW + 8, tH + 8, "#0f172a");
      pRect(ctx, tX, tY, tW, tH, "#0284c7"); // Fundo azul da TV

      // Conteúdo da Transmissão Presidencial no Telão
      pRect(ctx, tX + 10, tY + 10, 45, 45, "#1e293b"); // Busto do Presidente no telão
      pRect(ctx, tX + 18, tY + 16, 28, 20, "#fed7aa"); // Rosto
      pRect(ctx, tX + 15, tY + 36, 34, 18, "#1e3a8a"); // Terno

      // Texto de Manchete na TV (Simulação Pixel)
      pRect(ctx, tX + 65, tY + 14, 75, 6, "#ffffff");
      pRect(ctx, tX + 65, tY + 24, 60, 4, "#93c5fd");
      pRect(ctx, tX + 65, tY + 32, 70, 4, "#93c5fd");
      pRect(ctx, tX + 65, tY + 40, 50, 4, "#93c5fd");

      // Tarja de Plantão de Notícias Vermelha/Dourada
      pRect(ctx, tX, tY + tH - 18, tW, 18, outcome === "good" ? "#059669" : "#dc2626");
      pRect(ctx, tX + 6, tY + tH - 12, tW - 12, 6, "#ffffff");

      // Balões de pensamento/reação dos cidadãos na praça
      citizens.forEach((c, idx) => {
        if (idx % 3 === 0) {
          const popX = c.x - 4;
          const popY = c.y - 14;
          pRect(ctx, popX, popY, 12, 9, "#ffffff");
          pRect(ctx, popX + 2, popY + 2, 8, 5, outcome === "good" ? "#10b981" : "#ef4444");
        }
      });
    }

    // CENA 1: A TRANSFORMÇÃO DA INFRAESTRUTURA DA CIDADE
    if (sceneIndex === 1) {
      const bX = V_WIDTH / 2 - 60;
      const bY = 70;
      const bW = 120;
      const bH = 100;

      if (pasta === "saude") {
        // Hospital Central Pixel
        pRect(ctx, bX, bY, bW, bH, outcome === "bad" ? "#334155" : "#ffffff");
        pRect(ctx, bX - 2, bY - 2, bW + 4, 3, "#0891b2");
        // Cruz do Hospital
        const cCol = outcome === "good" ? "#10b981" : "#ef4444";
        pRect(ctx, bX + bW/2 - 5, bY + 15, 10, 30, cCol);
        pRect(ctx, bX + bW/2 - 15, bY + 25, 30, 10, cCol);

      } else if (pasta === "educacao") {
        // Universidade / Escola Pixel
        pRect(ctx, bX, bY, bW, bH, outcome === "bad" ? "#475569" : "#fef3c7");
        // Telhado clássico
        ctx.fillStyle = outcome === "bad" ? "#1e293b" : "#b45309";
        ctx.beginPath();
        ctx.moveTo(bX - 10, bY);
        ctx.lineTo(bX + bW/2, bY - 30);
        ctx.lineTo(bX + bW + 10, bY);
        ctx.closePath();
        ctx.fill();
        // Relógio central
        pCircle(ctx, bX + bW/2, bY - 10, 8, "#ffffff");

      } else if (pasta === "seguranca") {
        // QG de Segurança
        pRect(ctx, bX, bY, bW, bH, "#1e293b");
        pRect(ctx, bX + bW/2 - 15, bY + 20, 30, 35, outcome === "good" ? "#10b981" : "#ef4444");

      } else if (pasta === "economia") {
        // Bolsa de Valores / Banco Central
        pRect(ctx, bX, bY, bW, bH, outcome === "bad" ? "#0f172a" : "#065f46");
        // Colunas clássicas
        for (let colX = bX + 12; colX < bX + bW - 10; colX += 24) {
          pRect(ctx, colX, bY + 15, 10, bH - 15, "#ecfdf5");
        }
      }
    }

    // CENA 2: CIDADÃOS E IMPACTO POPULAR NAS RUAS
    if (sceneIndex === 2) {
      if (outcome === "good") {
        // Bandeiras e Faixas de Comemoração da População
        pRect(ctx, 40, 70, 80, 25, "#10b981");
        pRect(ctx, 45, 76, 70, 4, "#ffffff");
        pRect(ctx, 220, 65, 90, 25, "#3b82f6");
        pRect(ctx, 225, 71, 80, 4, "#ffffff");
      }
    }

    // 4. CHÃO E RUA DA CIDADE
    const roadY = V_HEIGHT - 30;
    pRect(ctx, 0, roadY, V_WIDTH, 30, outcome === "bad" ? "#0f172a" : "#334155"); // Asfalto
    pRect(ctx, 0, roadY, V_WIDTH, 3, "#cbd5e1"); // Calçada guia

    // Faixas Amarelas da Pista
    for (let rx = (timeStep * 1.5) % 40; rx < V_WIDTH; rx += 40) {
      pRect(ctx, rx, roadY + 14, 20, 3, "#f59e0b");
    }

    // Postes de Iluminação de Rua Pixel
    [30, 190, 350].forEach(lx => {
      pRect(ctx, lx, roadY - 50, 3, 50, "#64748b");
      pRect(ctx, lx - 4, roadY - 54, 11, 4, "#cbd5e1");
      // Luz amarela saindo do poste
      pCircle(ctx, lx + 1, roadY - 52, 4, "#fef08a");
    });

    // 5. DESENHAR VEÍCULOS
    vehicles.forEach(v => {
      v.x += v.speed;
      if (v.x > V_WIDTH + 60) v.x = -60;
      drawPixelVehicle(ctx, v.x, v.y, v.type, outcome, timeStep);
    });

    // 6. DESENHAR CIDADÃOS
    citizens.forEach(c => {
      drawPixelCitizen(ctx, c.x, c.y, timeStep + c.animFrame, c.state, c.shirt, c.isProtesting);
    });

    // 7. DESENHAR SISTEMA DE PARTÍCULAS
    if (outcome === "bad") {
      // Gotas de Chuva
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      particles.forEach(p => {
        p.y += p.speed;
        p.x -= 1.2;
        if (p.y > V_HEIGHT) {
          p.y = -10;
          p.x = Math.random() * V_WIDTH;
        }
        pRect(ctx, p.x, p.y, 1, p.len, "rgba(148, 163, 184, 0.7)");
      });
    } else if (outcome === "good") {
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y > V_HEIGHT + 10) {
          p.y = -10;
          p.x = Math.random() * V_WIDTH;
        }
        pRect(ctx, p.x, p.y, p.size, p.size, p.color);
      });
    }

    // 8. ESCALONAR BUFFER PIXEL-PERFECT PARA O CANVAS DE EXIBIÇÃO
    displayCtx.imageSmoothingEnabled = false;
    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.drawImage(
      bufferCanvas,
      0, 0, V_WIDTH, V_HEIGHT,
      0, 0, displayCanvas.width, displayCanvas.height
    );

    // Efeito de Fade Transição
    if (isTransitioning) {
      displayCtx.fillStyle = `rgba(15, 23, 42, ${transitionAlpha})`;
      displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
    }
  }

  // Avança para a próxima cena
  function nextScene() {
    if (sceneIndex < 2) {
      triggerSceneChange(sceneIndex + 1);
    }
  }

  // Volta para a cena anterior
  function prevScene() {
    if (sceneIndex > 0) {
      triggerSceneChange(sceneIndex - 1);
    }
  }

  // Efeito de transição de cena
  function triggerSceneChange(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    let fadeOut = true;

    const fadeInterval = setInterval(() => {
      if (fadeOut) {
        transitionAlpha += 0.15;
        if (transitionAlpha >= 1) {
          transitionAlpha = 1;
          fadeOut = false;
          sceneIndex = newIndex;
          setupSceneElements();
          updateSceneUI();
        }
      } else {
        transitionAlpha -= 0.15;
        if (transitionAlpha <= 0) {
          transitionAlpha = 0;
          isTransitioning = false;
          clearInterval(fadeInterval);
        }
      }
    }, 30);
  }

  // Atualiza Legendas e Timeline na Interface da Modal
  function updateSceneUI() {
    const captions = [
      "CENA 1/3: O Anúncio da Medida Presidencial é transmitido nos telões da Capital.",
      "CENA 2/3: Transformação e impacto na infraestrutura da cidade.",
      "CENA 3/3: A Reação dos Cidadãos e o clima social nas ruas do país."
    ];

    document.getElementById("scene-caption").innerText = captions[sceneIndex];

    // Atualiza Timeline Visual (Passos 1, 2, 3)
    document.querySelectorAll(".timeline-step").forEach((step, idx) => {
      if (idx === sceneIndex) {
        step.className = "timeline-step active";
      } else if (idx < sceneIndex) {
        step.className = "timeline-step completed";
      } else {
        step.className = "timeline-step";
      }
    });

    // Desabilita/Habilita botões de navegação
    document.getElementById("btn-prev-scene").disabled = (sceneIndex === 0);
    document.getElementById("btn-next-scene").disabled = (sceneIndex === 2);
  }

  // Loop Principal de Animação
  function gameLoop() {
    renderPixelScene();
    sceneTimer++;

    // Troca automática de cena a cada 4.5 segundos
    if (sceneTimer % 270 === 0 && sceneIndex < 2 && !isTransitioning) {
      nextScene();
    }

    animFrameId = requestAnimationFrame(gameLoop);
  }

  // Função Pública para Iniciar a Cutscene 3D Pixel Art
  function play(pasta, opcao, onCloseCallback) {
    const outcome = evaluateOutcome(opcao);
    sceneData = { pasta, opcao, outcome };
    sceneIndex = 0;
    sceneTimer = 0;

    displayCanvas = document.getElementById("consequenceCanvas");
    displayCtx = displayCanvas.getContext("2d");

    // Cria Buffer Canvas com resolução retro
    if (!bufferCanvas) {
      bufferCanvas = document.createElement("canvas");
      bufferCanvas.width = V_WIDTH;
      bufferCanvas.height = V_HEIGHT;
      bufferCtx = bufferCanvas.getContext("2d");
    }

    // Configurar Modal DOM
    const modal = document.getElementById("consequence-modal");
    const titleEl = document.getElementById("consequence-title");
    const badgeEl = document.getElementById("consequence-badge");
    const descEl = document.getElementById("consequence-desc");
    const statsContainer = document.getElementById("consequence-stats-list");

    if (outcome === "good") {
      badgeEl.className = "consequence-badge outcome-good";
      badgeEl.innerHTML = `<i data-lucide="sparkles"></i> CONSEQUÊNCIA POSITIVA`;
      titleEl.innerText = "Avanço e Progresso Social!";
    } else if (outcome === "bad") {
      badgeEl.className = "consequence-badge outcome-bad";
      badgeEl.innerHTML = `<i data-lucide="alert-triangle"></i> ALERTA NACIONAL / IMPACTO CRÍTICO`;
      titleEl.innerText = "Crise e Efeitos Colaterais Severos!";
    } else {
      badgeEl.className = "consequence-badge outcome-mixed";
      badgeEl.innerHTML = `<i data-lucide="scale"></i> TRADE-OFF EQUILIBRADO`;
      titleEl.innerText = "Decisão com Impactos Mistos";
    }

    descEl.innerText = opcao.consequencia || "Sua decisão causou impactos diretos na sociedade.";

    // Preencher Pílulas de Estatísticas
    statsContainer.innerHTML = "";
    const impactos = opcao.impacto || {};
    const nombres = {
      saude: "Saúde", educacao: "Educação", seguranca: "Segurança", economia: "Economia",
      meioambiente: "Meio Ambiente", infraestrutura: "Infraestrutura", satisfacao: "Aprovação Popular", orcamento: "Tesouro"
    };

    Object.keys(impactos).forEach(k => {
      const val = impactos[k];
      if (val === 0) return;
      const pill = document.createElement("div");
      const isPos = val > 0;
      pill.className = `stat-pill ${isPos ? "positive" : "negative"}`;
      pill.innerHTML = `<span>${nombres[k] || k}</span><strong>${isPos ? "+" : ""}${val}%</strong>`;
      statsContainer.appendChild(pill);
    });

    setupSceneElements();
    updateSceneUI();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(gameLoop);

    // O modal também nasce com a classe `hidden` no HTML. Removê-la é
    // indispensável, pois ela usa `display: none !important`.
    modal.classList.remove("hidden");
    modal.classList.add("active");

    if (window.lucide) {
      setTimeout(() => lucide.createIcons(), 50);
    }

    // Handlers dos botões de cena e fechar
    document.getElementById("btn-prev-scene").onclick = prevScene;
    document.getElementById("btn-next-scene").onclick = nextScene;

    const closeBtn = document.getElementById("consequence-close-btn");
    closeBtn.onclick = function() {
      stop();
      modal.classList.remove("active");
      modal.classList.add("hidden");
      if (typeof onCloseCallback === "function") {
        onCloseCallback();
      }
    };
  }

  function stop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  return {
    play: play,
    nextScene: nextScene,
    prevScene: prevScene,
    stop: stop
  };
})();
