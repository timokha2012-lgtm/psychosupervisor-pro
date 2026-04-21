/* ============================================
   PsychoSupervisor Pro — Main Application v2
   Full AI integration via OpenRouter
   ============================================ */

const App = {
  // ===== STATE =====
  state: {
    student: {
      name: 'Студент',
      email: '',
      xp: 0,
      level: 1,
      sessions: [],
      badges: [],
      transcriptsDone: 0
    },
    currentClient: null,
    session: {
      active: false,
      messages: [],
      startTime: null,
      phase: 'contact',
      trust: 20,
      anxiety: 60,
      openness: 30,
      score: 50
    },
    charts: { progress: null, skills: null },
    selectedModel: 'anthropic/claude-3-5-sonnet',
    aiEnabled: false
  },

  // ===== LEVELS =====
  levels: [
    { level: 1, title: 'Стажёр',      xp: 0,    icon: '🌱' },
    { level: 2, title: 'Слушатель',   xp: 200,  icon: '👂' },
    { level: 3, title: 'Практик',     xp: 500,  icon: '🎓' },
    { level: 4, title: 'Консультант', xp: 1000, icon: '💼' },
    { level: 5, title: 'Специалист',  xp: 2000, icon: '⚕️' },
    { level: 6, title: 'Мастер',      xp: 3500, icon: '🏆' },
    { level: 7, title: 'Эксперт',     xp: 5500, icon: '🌟' }
  ],

  // ===== ALL BADGES =====
  allBadges: [
    { id: 'first_session',  emoji: '🌱', name: 'Первая сессия',       desc: 'Провести первую сессию',           condition: s => s.sessions.length >= 1 },
    { id: 'five_sessions',  emoji: '⭐', name: 'Пять сессий',         desc: 'Провести 5 сессий',                condition: s => s.sessions.length >= 5 },
    { id: 'ten_sessions',   emoji: '🌟', name: 'Десять сессий',       desc: 'Провести 10 сессий',               condition: s => s.sessions.length >= 10 },
    { id: 'high_score',     emoji: '🏆', name: 'Мастер диалога',      desc: 'Набрать 80+ баллов',              condition: s => s.sessions.some(ss => ss.score >= 80) },
    { id: 'perfect',        emoji: '💎', name: 'Совершенство',        desc: 'Набрать 90+ баллов',              condition: s => s.sessions.some(ss => ss.score >= 90) },
    { id: 'addiction_pro',  emoji: '🛡️', name: 'Спец. по зависимостям', desc: '3 сессии с зависимостью',     condition: s => s.sessions.filter(ss => ss.category === 'addiction').length >= 3 },
    { id: 'trauma_care',    emoji: '💙', name: 'Безопасное пространство', desc: '3 сессии с травмой',         condition: s => s.sessions.filter(ss => ss.category === 'trauma').length >= 3 },
    { id: 'xp500',          emoji: '⚡', name: '500 XP',              desc: 'Накопить 500 XP',                 condition: s => s.xp >= 500 },
    { id: 'xp1000',         emoji: '🔥', name: '1000 XP',             desc: 'Накопить 1000 XP',                condition: s => s.xp >= 1000 },
    { id: 'transcript',     emoji: '📝', name: 'Аналитик',            desc: 'Проанализировать транскрипт',     condition: s => s.transcriptsDone >= 1 },
    { id: 'hardcase',       emoji: '💪', name: 'Сложный случай',      desc: 'Завершить сессию со сложностью ⭐⭐⭐', condition: s => s.sessions.some(ss => ss.difficulty === 3) },
    { id: 'spiritual',      emoji: '✝️', name: 'Духовный подход',     desc: 'Сессия с духовным кризисом',     condition: s => s.sessions.some(ss => ss.category === 'spiritual') },
    { id: 'ai_user',        emoji: '🤖', name: 'AI Практик',          desc: 'Провести сессию с AI-клиентом',  condition: s => s.sessions.some(ss => ss.aiMode) }
  ],

  // ===== INIT =====
  init() {
    this.loadState();
    this.updateAIStatus();
    this.updateAccessBadge();
    this.renderKnowledgeBase();
    this.renderBadges();
    this.updateHeaderXP();
    this.updateDashboardStats();
    this.updateProgressTab();
    document.getElementById('student-name-display').textContent = this.state.student.name;
    // Show AI setup on first launch if no key
    if (!AIEngine.hasKey() && !localStorage.getItem('psp_ai_dismissed')) {
      setTimeout(() => this.showAISetup(), 1200);
    }
  },

  // ===== STORAGE =====
  saveState() {
    try { localStorage.setItem('psp_student', JSON.stringify(this.state.student)); } catch(e) {}
  },
  loadState() {
    try {
      const saved = localStorage.getItem('psp_student');
      if (saved) this.state.student = { ...this.state.student, ...JSON.parse(saved) };
      if (!this.state.student.badges) this.state.student.badges = [];
      if (!this.state.student.sessions) this.state.student.sessions = [];
      if (!this.state.student.transcriptsDone) this.state.student.transcriptsDone = 0;
    } catch(e) {}
  },

  // ===== ACCESS SYSTEM =====
  enterOrActivate() {
    if (AccessSystem.hasAccess()) {
      this.enterApp();
    } else {
      this.showActivationModal();
    }
  },

  showActivationModal() {
    const modal = document.getElementById('access-modal');
    if (!modal) return;
    const statusBlock = document.getElementById('access-status-block');
    const statusContent = document.getElementById('access-status-content');

    if (AccessSystem.hasAccess()) {
      const info = AccessSystem.getStatusInfo();
      const plan = AccessSystem.getPlanData();
      statusBlock.classList.remove('hidden');
      document.getElementById('access-activate-block').style.display = 'none';
      statusContent.innerHTML = `
        <div style="text-align:center;padding:16px;">
          <div style="font-size:48px;margin-bottom:8px">✅</div>
          <h3 style="color:var(--accent-2)">Доступ активен</h3>
          <p style="font-size:15px;font-weight:600;margin:8px 0">${plan.name}</p>
          <p style="color:var(--text-2);font-size:13px">Действует до: <strong>${info.expires}</strong></p>
          <p style="color:${info.daysLeft < 7 ? '#dc2626' : '#059669'};font-size:13px">Осталось: <strong>${info.daysLeft} дней</strong></p>
          ${plan.ai ? '<p style="color:var(--accent-2);font-size:13px"><i class="fas fa-robot"></i> AI-режим включён</p>' : ''}
          <button class="btn-primary" style="margin-top:16px" onclick="App.closeModal('access-modal');App.enterApp()">
            <i class="fas fa-play"></i> Открыть тренажёр
          </button>
        </div>`;
    } else {
      statusBlock.classList.add('hidden');
      const activateBlock = document.getElementById('access-activate-block');
      if (activateBlock) activateBlock.style.display = '';
    }
    const resultEl = document.getElementById('access-activate-result');
    if (resultEl) { resultEl.textContent = ''; resultEl.className = 'api-test-result'; }
    const keyInput = document.getElementById('access-key-input');
    if (keyInput) keyInput.value = '';
    modal.classList.remove('hidden');
  },

  activateAccessKey() {
    const key = document.getElementById('access-key-input')?.value?.trim();
    const result = document.getElementById('access-activate-result');
    if (!key) {
      result.className = 'api-test-result error';
      result.textContent = 'Введите ключ доступа';
      return;
    }
    const activation = AccessSystem.activateKey(key);
    if (activation.ok) {
      result.className = 'api-test-result success';
      result.textContent = `✅ Доступ активирован! Тариф: ${activation.label}. Действует ${activation.days} дней.`;
      if (AccessSystem.isAIEnabled() && AIEngine.hasKey()) {
        this.updateAIStatus();
      }
      setTimeout(() => {
        this.closeModal('access-modal');
        this.enterApp();
        this.toast(`🎉 Добро пожаловать! Тариф: ${activation.label}`, 'success');
      }, 1500);
    } else {
      result.className = 'api-test-result error';
      result.textContent = `❌ ${activation.error}`;
    }
  },

  // ===== NAVIGATION =====
  enterApp() {
    // Allow entry with demo access key or paid key
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('app-page').classList.remove('hidden');
    this.init();
  },
  showLanding() {
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
  },
  goHome() { this.showTab('dashboard'); },
  playDemo() {
    this.enterApp();
    setTimeout(() => { this.showTab('trainer'); this.generateRandomClient(); }, 300);
  },

  // ===== TABS =====
  showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => { t.classList.remove('active'); t.classList.add('hidden'); });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const el = document.getElementById(`tab-${tab}`);
    if (el) { el.classList.remove('hidden'); el.classList.add('active'); }
    const btn = document.querySelector(`[data-tab="${tab}"]`);
    if (btn) btn.classList.add('active');
    if (tab === 'progress') { this.updateProgressTab(); this.renderCharts(); }
    if (tab === 'knowledge') this.renderKnowledgeBase();
  },

  // ===== AI STATUS =====
  updateAIStatus() {
    const indicator = document.getElementById('ai-status-indicator');
    const text = document.getElementById('ai-status-text');
    if (!indicator) return;
    if (AIEngine.hasKey()) {
      indicator.className = 'ai-status-indicator ai-on';
      indicator.querySelector('i').className = 'fas fa-robot';
      if (text) text.textContent = 'AI Online';
      this.state.aiEnabled = true;
    } else {
      indicator.className = 'ai-status-indicator ai-off';
      indicator.querySelector('i').className = 'fas fa-robot';
      if (text) text.textContent = 'AI офлайн';
      this.state.aiEnabled = false;
    }
  },

  updateAccessBadge() {
    const badge = document.getElementById('access-badge-header');
    if (!badge) return;
    if (AccessSystem.hasAccess()) {
      const info = AccessSystem.getStatusInfo();
      badge.textContent = `🔑 ${info.daysLeft} дн.`;
      badge.className = `access-badge${info.daysLeft < 7 ? ' expired' : ''}`;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  },

  setAILoading(loading) {
    const indicator = document.getElementById('ai-status-indicator');
    const text = document.getElementById('ai-status-text');
    if (!indicator) return;
    if (loading) {
      indicator.className = 'ai-status-indicator ai-loading';
      if (text) text.textContent = 'AI думает...';
    } else {
      this.updateAIStatus();
    }
  },

  // ===== AI SETUP MODAL =====
  showAISetup() {
    document.getElementById('ai-setup-modal').classList.remove('hidden');
  },

  skipAISetup() {
    localStorage.setItem('psp_ai_dismissed', '1');
    document.getElementById('ai-setup-modal').classList.add('hidden');
    this.toast('💡 AI-режим можно включить в Настройках (иконка 🤖 вверху)', 'info');
  },

  selectModel(model, el) {
    this.state.selectedModel = model;
    document.querySelectorAll('.model-option').forEach(o => o.style.borderColor = '');
    if (el) el.style.borderColor = 'var(--primary)';
  },

  toggleKeyVisibility() {
    const input = document.getElementById('api-key-input');
    const btn = document.getElementById('key-toggle-btn');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
      input.type = 'password';
      btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
  },

  toggleSettingsKeyVisibility() {
    const input = document.getElementById('settings-api-key');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  async testAPIKey() {
    const key = document.getElementById('api-key-input')?.value?.trim();
    if (!key) { this.toast('Введите API-ключ', 'warning'); return; }
    const result = document.getElementById('api-test-result');
    result.className = 'api-test-result testing';
    result.textContent = '⏳ Проверяем подключение...';
    result.classList.remove('hidden');
    const savedKey = AIEngine._apiKey;
    AIEngine._apiKey = key;
    const test = await AIEngine.testConnection();
    if (test.ok) {
      result.className = 'api-test-result success';
      result.textContent = `✅ Подключение работает! Ответ: "${test.response}"`;
    } else {
      result.className = 'api-test-result error';
      result.textContent = `❌ ${AIEngine.getErrorMessage(test.error)}`;
      AIEngine._apiKey = savedKey;
    }
  },

  saveAPIKey() {
    const key = document.getElementById('api-key-input')?.value?.trim();
    if (!key) { this.toast('Введите API-ключ', 'warning'); return; }
    AIEngine.saveKey(key);
    if (this.state.selectedModel) AIEngine.setModel(this.state.selectedModel);
    document.getElementById('ai-setup-modal').classList.add('hidden');
    this.updateAIStatus();
    this.toast('✅ AI-супервизор активирован! Начните сессию.', 'success');
  },

  // ===== SETTINGS MODAL =====
  openSettings() {
    const keyInput = document.getElementById('settings-api-key');
    const statusEl = document.getElementById('api-status-display');
    const modelSel = document.getElementById('settings-model-select');

    if (keyInput) keyInput.value = AIEngine._apiKey || '';
    if (statusEl) {
      if (AIEngine.hasKey()) {
        statusEl.innerHTML = `<span style="color:#059669">✅ Ключ активен · Модель: ${AIEngine._model}</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:var(--text-2)">⚪ Ключ не установлен — AI работает в скриптовом режиме</span>`;
      }
    }
    if (modelSel) modelSel.value = AIEngine._model;
    const testRes = document.getElementById('settings-test-result');
    if (testRes) { testRes.textContent = ''; testRes.className = 'api-test-result'; }
    document.getElementById('settings-modal').classList.remove('hidden');
  },

  async testAPIKeySettings() {
    const key = document.getElementById('settings-api-key')?.value?.trim();
    if (!key) { this.toast('Введите ключ', 'warning'); return; }
    const result = document.getElementById('settings-test-result');
    result.className = 'api-test-result testing';
    result.textContent = '⏳ Тестируем...';
    const savedKey = AIEngine._apiKey;
    AIEngine._apiKey = key;
    const test = await AIEngine.testConnection();
    if (test.ok) {
      result.className = 'api-test-result success';
      result.textContent = `✅ Работает! AI ответил: "${test.response}"`;
    } else {
      result.className = 'api-test-result error';
      result.textContent = `❌ ${AIEngine.getErrorMessage(test.error)}`;
      AIEngine._apiKey = savedKey;
    }
  },

  saveAPIKeySettings() {
    const key = document.getElementById('settings-api-key')?.value?.trim();
    if (!key) { this.toast('Введите ключ', 'warning'); return; }
    AIEngine.saveKey(key);
    this.closeModal('settings-modal');
    this.updateAIStatus();
    this.toast('✅ API-ключ сохранён! AI-режим активен.', 'success');
  },

  clearAPIKey() {
    if (!confirm('Удалить API-ключ? AI перейдёт в скриптовый режим.')) return;
    AIEngine.clearKey();
    this.closeModal('settings-modal');
    this.updateAIStatus();
    this.toast('🔄 Ключ удалён. Работаем в скриптовом режиме.', 'warning');
  },

  changeModel(model) {
    AIEngine.setModel(model);
    this.toast(`Модель изменена: ${model}`, 'success');
  },

  // ===== CLIENT MANAGEMENT =====
  generateRandomClient() {
    const client = ClientsDB.generate();
    this.setCurrentClient(client);
    this.showTab('trainer');
    this.toast(`🎲 Клиент сгенерирован: ${client.name}`, 'success');
  },

  showClientSelector() {
    this.renderClientSelector();
    document.getElementById('client-selector-modal').classList.remove('hidden');
  },

  renderClientSelector() {
    const cat = document.getElementById('filter-category')?.value || '';
    const diff = document.getElementById('filter-difficulty')?.value || '';
    const clients = ClientsDB.getAll(cat || null, diff || null);
    const grid = document.getElementById('clients-grid');
    if (!grid) return;
    grid.innerHTML = clients.map(c => `
      <div class="client-card" onclick="App.selectClient('${c.id}')">
        <div class="client-card-emoji">${c.emoji}</div>
        <div class="client-card-name">${c.name}, ${c.age}</div>
        <div class="client-card-type">${c.type}</div>
        <div class="client-card-desc">${c.request}</div>
        <div class="difficulty-stars">${ClientsDB.difficultyStars(c.difficulty)} ${ClientsDB.categoryLabel(c.category)}</div>
      </div>
    `).join('');
  },

  filterClients() { this.renderClientSelector(); },

  selectClient(id) {
    const client = ClientsDB.getById(id);
    if (!client) return;
    this.setCurrentClient({ ...client });
    this.closeModal('client-selector-modal');
    this.showTab('trainer');
    this.toast(`✅ Выбран клиент: ${client.name}`, 'success');
  },

  setCurrentClient(client) {
    this.state.currentClient = client;
    this.resetSession();
    document.getElementById('no-client-state').classList.add('hidden');
    document.getElementById('client-info-panel').classList.remove('hidden');
    document.getElementById('client-emoji').textContent = client.emoji;
    document.getElementById('client-name-display').textContent = `${client.name}, ${client.age}`;
    document.getElementById('client-type-badge').textContent = client.type;
    document.getElementById('client-age').textContent = `${client.age} · ${client.gender === 'f' ? 'Женщина' : 'Мужчина'}`;
    document.getElementById('client-request').textContent = client.request;
    document.getElementById('client-history').textContent = client.history;
    this.updateEmotionBars(client.trust, client.anxiety, client.openness);
    this.updateTechniques(client, this.state.session);
    document.getElementById('btn-start-session').classList.remove('hidden');
    document.getElementById('btn-end-session').classList.add('hidden');
  },

  // ===== SESSION MANAGEMENT =====
  resetSession() {
    const client = this.state.currentClient;
    this.state.session = {
      active: false, messages: [], startTime: null,
      phase: 'contact',
      trust: client ? client.trust : 20,
      anxiety: client ? client.anxiety : 60,
      openness: client ? client.openness : 30,
      score: 50, aiMode: false
    };
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('chat-messages').classList.add('hidden');
    document.getElementById('chat-placeholder').classList.remove('hidden');
    document.getElementById('chat-input-area').classList.add('hidden');
    document.getElementById('supervisor-hint').classList.add('hidden');
    document.getElementById('score-big').textContent = '–';
    document.getElementById('session-phase').textContent = 'Ожидание';
    document.getElementById('red-flags').innerHTML = '<div class="no-flags"><i class="fas fa-check-circle"></i> Пока нет</div>';
  },

  quickStart() {
    this.generateRandomClient();
    setTimeout(() => this.startSession(), 400);
  },

  startSession() {
    if (!this.state.currentClient) return;
    const client = this.state.currentClient;
    this.state.session.active = true;
    this.state.session.startTime = Date.now();
    this.state.session.aiMode = AIEngine.hasKey();

    document.getElementById('btn-start-session').classList.add('hidden');
    document.getElementById('btn-end-session').classList.remove('hidden');
    document.getElementById('chat-placeholder').classList.add('hidden');
    document.getElementById('chat-messages').classList.remove('hidden');
    document.getElementById('chat-input-area').classList.remove('hidden');
    document.getElementById('chat-messages').innerHTML = '';
    this.state.session.messages = [];

    const aiLabel = AIEngine.hasKey()
      ? `<span style="color:var(--accent-2)"><i class="fas fa-robot"></i> AI-режим</span>`
      : `<span style="color:var(--text-2)"><i class="fas fa-script"></i> Скриптовый режим</span>`;

    this.addSystemMessage(`📋 Клиент: ${client.name} · ${client.type} · ${ClientsDB.difficultyStars(client.difficulty)} · ${aiLabel}`);

    // Get opening message
    if (AIEngine.hasKey()) {
      this._getAIClientOpening(client);
    } else {
      setTimeout(() => {
        const opening = client.responses.opening[Math.floor(Math.random() * client.responses.opening.length)];
        this.addClientMessage(opening);
        this.state.session.messages.push({ role: 'client', text: opening, time: Date.now() });
        this._showInitialHint(client);
      }, 500);
    }

    this.toast(AIEngine.hasKey() ? '🤖 AI-сессия началась' : '▶️ Сессия началась', 'success');
  },

  async _getAIClientOpening(client) {
    this.showTyping();
    this.setAILoading(true);
    try {
      const opening = await AIEngine.generateClientResponse(
        client, [], '', { ...this.state.session, trust: client.trust }
      ) || client.responses.opening[0];
      this.hideTyping();
      this.setAILoading(false);
      this.addClientMessage(opening);
      this.state.session.messages.push({ role: 'client', text: opening, time: Date.now() });
      this._showInitialHint(client);
    } catch(e) {
      this.hideTyping();
      this.setAILoading(false);
      const opening = client.responses.opening[0];
      this.addClientMessage(opening);
      this.state.session.messages.push({ role: 'client', text: opening, time: Date.now() });
      this._showInitialHint(client);
    }
  },

  _showInitialHint(client) {
    const hint = Supervisor.getHint(client, this.state.session, '', 1);
    this.showHint(hint ? hint.text : '💡 Начало сессии: установите контакт. Используйте открытые вопросы. Покажите что слышите клиента.');
  },

  async endSession() {
    if (!this.state.session.active) return;
    const client = this.state.currentClient;
    const messages = this.state.session.messages;
    const duration = Math.round((Date.now() - this.state.session.startTime) / 60000);

    if (messages.filter(m => m.role === 'student').length < 2) {
      this.toast('Проведите хотя бы 2-3 обмена репликами', 'warning'); return;
    }

    this.state.session.active = false;
    const score = Supervisor.scoreSession(messages, client, this.state.session);
    this.state.session.score = score;

    // Show loading report
    document.getElementById('session-report-modal').classList.remove('hidden');
    document.getElementById('session-report-body').innerHTML = `
      <div class="report-loading"><i class="fas fa-spinner fa-spin"></i> Супервизор анализирует сессию${AIEngine.hasKey() ? ' (AI-разбор)' : ''}...</div>`;

    document.getElementById('btn-start-session').classList.remove('hidden');
    document.getElementById('btn-end-session').classList.add('hidden');
    document.getElementById('chat-input-area').classList.add('hidden');

    let analysis = null;

    // Try AI analysis first
    if (AIEngine.hasKey()) {
      this.setAILoading(true);
      try {
        const aiResult = await AIEngine.analyzeSessionFull(client, messages, this.state.session);
        if (aiResult) {
          analysis = {
            score: aiResult.score || score,
            errors: aiResult.errors || [],
            strengths: aiResult.strengths || [],
            recommendations: aiResult.recommendations || [],
            xpGained: Supervisor._calcXP(aiResult.score || score, messages.length, client.difficulty),
            sessionSummary: aiResult.summary || '',
            worked: aiResult.worked || '',
            missed: aiResult.missed || '',
            keyMoments: aiResult.keyMoments || [],
            clientProfile: aiResult.clientProfile || '',
            nextSession: aiResult.nextSession || ''
          };
        }
      } catch(e) { /* fallback below */ }
      this.setAILoading(false);
    }

    // Fallback to scripted analysis
    if (!analysis) {
      analysis = Supervisor.analyzeSession(messages, client, this.state.session, score);
    }

    this.saveSessionResult({
      id: Date.now(),
      clientId: client.id, clientName: client.name, clientType: client.type,
      clientEmoji: client.emoji, category: client.category, difficulty: client.difficulty,
      score: analysis.score, xpGained: analysis.xpGained,
      duration, messages: messages.length,
      date: new Date().toLocaleDateString('ru-RU'),
      aiMode: this.state.session.aiMode
    });

    this.addXP(analysis.xpGained);
    this.showSessionReport(analysis, client, duration);
  },

  saveSessionResult(result) {
    this.state.student.sessions.unshift(result);
    if (this.state.student.sessions.length > 50) this.state.student.sessions.pop();
    this.saveState();
    this.checkBadges();
    this.updateDashboardStats();
    this.renderRecentSessions();
  },

  // ===== CHAT =====
  handleChatKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
  },

  async sendMessage() {
    if (!this.state.session.active) return;
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    const client = this.state.currentClient;
    const session = this.state.session;

    this.addStudentMessage(text);
    session.messages.push({ role: 'student', text, time: Date.now() });

    // Update emotional state
    const newState = ClientsDB.updateEmotionalState(client, text, session);
    session.trust = newState.trust;
    session.anxiety = newState.anxiety;
    session.openness = newState.openness;
    this.updateEmotionBars(session.trust, session.anxiety, session.openness);

    // Update phase & score
    const phaseInfo = Supervisor.detectPhase(
      session.messages.filter(m => m.role === 'student').length,
      session.trust, session.openness
    );
    session.phase = phaseInfo.phase;
    document.getElementById('session-phase').textContent = phaseInfo.label;
    const score = Supervisor.scoreSession(session.messages, client, session);
    session.score = score;
    document.getElementById('score-big').textContent = score;

    this.updateRedFlags();
    this.updateTechniques(client, session);

    // Check for critical hint (scripted — always runs)
    const criticalHint = Supervisor.getHint(client, session, text, session.messages.length);
    if (criticalHint && criticalHint.type === 'critical') {
      this.showHint(criticalHint.text);
    }

    // Get client response
    this.showTyping();

    if (AIEngine.hasKey()) {
      this.setAILoading(true);
      try {
        const clientResp = await AIEngine.generateClientResponse(client, session.messages, text, session);
        this.hideTyping();
        this.setAILoading(false);
        if (clientResp) {
          this.addClientMessage(clientResp);
          session.messages.push({ role: 'client', text: clientResp, time: Date.now() });
        }
        // AI hint in background
        if (Math.random() > 0.45) {
          AIEngine.generateSupervisorHint(client, session.messages, text, session).then(hint => {
            if (hint) this.showHint(hint);
          }).catch(() => {});
        }
      } catch(e) {
        this.hideTyping();
        this.setAILoading(false);
        this._sendScriptedClientResponse(client, session, text);
        const errMsg = AIEngine.getErrorMessage(e.message);
        if (e.message !== 'NO_KEY') this.toast(`⚠️ AI: ${errMsg}`, 'warning');
      }
    } else {
      // Scripted fallback
      const delay = 1000 + Math.random() * 1500;
      setTimeout(() => {
        this.hideTyping();
        this._sendScriptedClientResponse(client, session, text);
        if (Math.random() > 0.55) {
          const hint = Supervisor.getHint(client, session, text, session.messages.length);
          if (hint) setTimeout(() => this.showHint(hint.text), 500);
        }
      }, delay);
    }
  },

  _sendScriptedClientResponse(client, session, studentText) {
    const studentCount = session.messages.filter(m => m.role === 'student').length;
    const resp = ClientsDB.getResponse(client, session.phase, studentText, studentCount);
    this.addClientMessage(resp);
    session.messages.push({ role: 'client', text: resp, time: Date.now() });
    this.scrollChat();
  },

  async askSupervisor() {
    if (!this.state.session.active) { this.toast('Сначала начните сессию', 'warning'); return; }
    const client = this.state.currentClient;
    const session = this.state.session;
    const question = document.getElementById('chat-input').value.trim();

    if (AIEngine.hasKey()) {
      this.setAILoading(true);
      // Show thinking bubble
      const thinkingId = 'thinking-' + Date.now();
      const thinkingEl = document.createElement('div');
      thinkingEl.className = 'msg msg-supervisor ai-thinking-msg';
      thinkingEl.id = thinkingId;
      thinkingEl.innerHTML = `<div class="msg-bubble"><i class="fas fa-brain"></i><span>⏳ Супервизор анализирует...</span></div>`;
      document.getElementById('chat-messages').appendChild(thinkingEl);
      this.scrollChat();

      try {
        const advice = await AIEngine.generateSupervisorAdvice(client, session.messages, question, session);
        document.getElementById(thinkingId)?.remove();
        this.setAILoading(false);
        if (advice) {
          this.addSupervisorMessage(advice);
          session.messages.push({ role: 'supervisor', text: advice, time: Date.now() });
        }
      } catch(e) {
        document.getElementById(thinkingId)?.remove();
        this.setAILoading(false);
        const fallback = Supervisor.getSupervisorResponse(client, session, question);
        this.addSupervisorMessage(fallback);
        session.messages.push({ role: 'supervisor', text: fallback, time: Date.now() });
      }
    } else {
      const response = Supervisor.getSupervisorResponse(client, session, question);
      this.addSupervisorMessage(response);
      session.messages.push({ role: 'supervisor', text: response, time: Date.now() });
    }
    this.scrollChat();
  },

  dismissHint() { document.getElementById('supervisor-hint').classList.add('hidden'); },

  showHint(text) {
    document.getElementById('hint-text').textContent = text;
    document.getElementById('supervisor-hint').classList.remove('hidden');
  },

  // ===== MESSAGE RENDERERS =====
  addClientMessage(text) {
    const client = this.state.currentClient;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const el = document.createElement('div');
    el.className = 'msg msg-client';
    el.innerHTML = `
      <div class="msg-label">${client.emoji} ${client.name}</div>
      <div class="msg-bubble">${this.escapeHtml(text)}</div>
      <div class="msg-time">${time}</div>`;
    document.getElementById('chat-messages').appendChild(el);
    this.scrollChat();
  },

  addStudentMessage(text) {
    const name = this.state.student.name;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    const el = document.createElement('div');
    el.className = 'msg msg-student';
    el.innerHTML = `
      <div class="msg-label">👨‍💼 ${name} (Вы)</div>
      <div class="msg-bubble">${this.escapeHtml(text)}</div>
      <div class="msg-time">${time}</div>`;
    document.getElementById('chat-messages').appendChild(el);
    this.scrollChat();
  },

  addSupervisorMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg msg-supervisor';
    el.innerHTML = `<div class="msg-bubble"><i class="fas fa-chalkboard-teacher"></i><span>${this.escapeHtml(text)}</span></div>`;
    document.getElementById('chat-messages').appendChild(el);
    this.scrollChat();
  },

  addSystemMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg msg-supervisor';
    el.innerHTML = `<div class="msg-bubble" style="background:rgba(108,99,255,0.08);border-color:rgba(108,99,255,0.3)">
      <i class="fas fa-info-circle" style="color:var(--primary)"></i><span style="color:var(--primary)">${text}</span></div>`;
    document.getElementById('chat-messages').appendChild(el);
  },

  showTyping() {
    const el = document.createElement('div');
    el.className = 'msg msg-client typing-indicator';
    el.id = 'typing-indicator';
    el.innerHTML = `<div class="msg-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    document.getElementById('chat-messages').appendChild(el);
    this.scrollChat();
  },

  hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  },

  scrollChat() {
    const chat = document.getElementById('chat-messages');
    if (chat) chat.scrollTop = chat.scrollHeight;
  },

  // ===== SUPERVISOR PANEL =====
  updateEmotionBars(trust, anxiety, openness) {
    const bt = document.getElementById('bar-trust');
    const ba = document.getElementById('bar-anxiety');
    const bo = document.getElementById('bar-openness');
    if (bt) bt.style.width = trust + '%';
    if (ba) ba.style.width = anxiety + '%';
    if (bo) bo.style.width = openness + '%';
  },

  updateTechniques(client, session) {
    const list = document.getElementById('techniques-list');
    if (!list) return;
    const techs = Supervisor.suggestTechniques(client, session.phase, session);
    list.innerHTML = techs.map(t => `<div class="technique-item" onclick="App.showTechniqueInfo('${t}')">${t}</div>`).join('');
  },

  showTechniqueInfo(name) {
    const item = KnowledgeDB.items.find(k => k.title.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
    if (item) this.showKnowledgeDetail(item.id);
    else this.toast(`Ищите "${name}" в Базе знаний`, 'info');
  },

  updateRedFlags() {
    const client = this.state.currentClient;
    const messages = this.state.session.messages;
    const flags = Supervisor.detectRedFlags(client, messages);
    const container = document.getElementById('red-flags');
    if (!container) return;
    if (!flags.length) {
      container.innerHTML = '<div class="no-flags"><i class="fas fa-check-circle"></i> Пока нет</div>';
    } else {
      container.innerHTML = flags.map(f => `<div class="red-flag-item">${f}</div>`).join('');
    }
  },

  // ===== SESSION REPORT =====
  showSessionReport(analysis, client, duration) {
    const body = document.getElementById('session-report-body');
    const scoreClass = analysis.score >= 80 ? 'score-high' : analysis.score >= 60 ? 'score-mid' : 'score-low';
    const aiLabel = this.state.session.aiMode
      ? '<span style="font-size:12px;color:var(--accent-2)"><i class="fas fa-robot"></i> AI-анализ</span>'
      : '<span style="font-size:12px;color:var(--text-2)">Скриптовый анализ</span>';

    body.innerHTML = `
      <div class="report-score-big">
        <span class="report-score-num ${scoreClass}">${analysis.score}</span>
        <div class="report-score-label">${this.scoreLabel(analysis.score)} ${aiLabel}</div>
      </div>
      <div class="report-section">
        <div class="xp-gained"><i class="fas fa-star" style="color:var(--accent-3)"></i> +<span>${analysis.xpGained}</span> XP заработано</div>
      </div>
      ${analysis.sessionSummary ? `
      <div class="report-section">
        <h4><i class="fas fa-info-circle" style="color:var(--primary)"></i> Итог сессии</h4>
        <p>${analysis.sessionSummary}</p>
      </div>` : ''}
      ${analysis.worked ? `
      <div class="report-section report-section--good">
        <h4><i class="fas fa-check-circle" style="color:#059669"></i> Что сработало</h4>
        <p style="font-size:14px;line-height:1.8;color:var(--text)">${analysis.worked}</p>
      </div>` : ''}
      ${analysis.missed ? `
      <div class="report-section report-section--warn">
        <h4><i class="fas fa-exclamation-circle" style="color:#D97706"></i> Что упустил</h4>
        <p style="font-size:14px;line-height:1.8;color:var(--text)">${analysis.missed}</p>
      </div>` : ''}
      ${analysis.clientProfile ? `
      <div class="report-section">
        <h4><i class="fas fa-user-circle" style="color:var(--primary)"></i> Психологический портрет клиента</h4>
        <p style="font-size:14px;line-height:1.8;color:var(--text-2)">${analysis.clientProfile}</p>
      </div>` : ''}
      ${analysis.errors && analysis.errors.length > 0 ? `
      <div class="report-section">
        <h4><i class="fas fa-exclamation-circle" style="color:#dc2626"></i> Ошибки и зоны роста</h4>
        <div class="report-errors">
          ${analysis.errors.map(e => `
            <div class="error-item">
              <div class="error-title">${e.title}</div>
              <div class="error-text">${e.text}</div>
              <div class="error-suggestion"><i class="fas fa-lightbulb"></i> ${e.suggestion}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}
      ${analysis.strengths && analysis.strengths.length > 0 ? `
      <div class="report-section">
        <h4><i class="fas fa-thumbs-up" style="color:var(--accent-2)"></i> Сильные стороны</h4>
        <div class="strengths-list">
          ${analysis.strengths.map(s => `<div class="strength-item"><i class="fas fa-check"></i>${s}</div>`).join('')}
        </div>
      </div>` : ''}
      ${analysis.recommendations && analysis.recommendations.length > 0 ? `
      <div class="report-section">
        <h4><i class="fas fa-compass" style="color:var(--primary)"></i> Рекомендации</h4>
        <div class="rec-list">
          ${analysis.recommendations.map(r => `<div class="rec-item"><i class="fas fa-arrow-right"></i>${r}</div>`).join('')}
        </div>
      </div>` : ''}
      ${analysis.nextSession ? `
      <div class="report-section report-section--next">
        <h4><i class="fas fa-calendar-check" style="color:var(--accent-2)"></i> План следующей сессии</h4>
        <p style="font-size:14px;line-height:1.8;color:var(--text)">${analysis.nextSession}</p>
      </div>` : ''}
    `;
  },

  scoreLabel(score) {
    if (score >= 90) return '🏆 Превосходно!';
    if (score >= 80) return '⭐ Отлично';
    if (score >= 70) return '✅ Хорошо';
    if (score >= 60) return '📈 Выше среднего';
    if (score >= 50) return '🔄 Средне';
    if (score >= 40) return '⚠️ Требует практики';
    return '❌ Нужно повторить базу';
  },

  closeReport() {
    document.getElementById('session-report-modal').classList.add('hidden');
    this.resetSession();
  },

  // ===== TRANSCRIPT NORMALIZER (Спикер 1/2 → Клиент/Психолог) =====
  normalizeTranscript() {
    const input = document.getElementById('trans-text-input');
    if (!input) return;
    let text = input.value;
    if (!text.trim()) { this.toast('Сначала вставьте транскрипт', 'warning'); return; }

    const s1role = document.getElementById('speaker1-role')?.value || 'Психолог';
    const s2role = document.getElementById('speaker2-role')?.value || 'Клиент';

    // Заменяем все варианты написания спикеров
    const patterns1 = [
      /^Спикер\s*1\s*:/gmi,
      /^Speaker\s*1\s*:/gmi,
      /^\[Спикер\s*1\]\s*/gmi,
      /^\[Speaker\s*1\]\s*/gmi,
      /^С1\s*:/gmi,
      /^Голос\s*1\s*:/gmi,
    ];
    const patterns2 = [
      /^Спикер\s*2\s*:/gmi,
      /^Speaker\s*2\s*:/gmi,
      /^\[Спикер\s*2\]\s*/gmi,
      /^\[Speaker\s*2\]\s*/gmi,
      /^С2\s*:/gmi,
      /^Голос\s*2\s*:/gmi,
    ];

    patterns1.forEach(p => { text = text.replace(p, `${s1role}:`); });
    patterns2.forEach(p => { text = text.replace(p, `${s2role}:`); });

    // Также заменяем таймкоды вида [00:01:23] или 00:01 —
    text = text.replace(/\[\d{1,2}:\d{2}(:\d{2})?\]\s*/g, '');
    text = text.replace(/\d{1,2}:\d{2}(:\d{2})?\s*[—-]\s*/g, '');

    input.value = text;
    this.toast(`✅ Готово! Спикер 1 → ${s1role}, Спикер 2 → ${s2role}`, 'success');
  },


  _speechRecognition: null,
  _speechTranscript: '',

  startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.toast('⚠️ Ваш браузер не поддерживает распознавание речи. Используйте Chrome.', 'warning');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'ru-RU';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    this._speechRecognition = rec;

    const output = document.getElementById('speech-transcript-output');
    const startBtn = document.getElementById('speech-start-btn');
    const stopBtn = document.getElementById('speech-stop-btn');
    const status = document.getElementById('speech-status');

    let finalTranscript = output?.value || '';
    let currentSpeaker = 'Клиент'; // alternates
    let turnCount = 0;

    rec.onstart = () => {
      startBtn?.classList.add('hidden');
      stopBtn?.classList.remove('hidden');
      status?.classList.remove('hidden');
      this.toast('🎙 Запись началась. Говорите...', 'info');
    };

    rec.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Auto-detect speaker change (pause-based) — simplified
          if (finalTranscript.length > 0 && !finalTranscript.endsWith('\n')) {
            finalTranscript += '\n';
          }
          turnCount++;
          const speaker = turnCount % 2 === 1 ? 'Клиент' : 'Психолог';
          finalTranscript += `${speaker}: ${transcript.trim()}\n`;
          if (output) output.value = finalTranscript;
        } else {
          interimTranscript = transcript;
        }
      }
      // Show interim in textarea as preview
      if (output && interimTranscript) {
        output.value = finalTranscript + `[${interimTranscript}]`;
      }
    };

    rec.onerror = (event) => {
      if (event.error === 'not-allowed') {
        this.toast('❌ Нет доступа к микрофону. Разрешите в браузере.', 'error');
      } else if (event.error === 'network') {
        this.toast('⚠️ Сетевая ошибка распознавания речи', 'warning');
      }
      this.stopSpeechRecognition();
    };

    rec.onend = () => {
      startBtn?.classList.remove('hidden');
      stopBtn?.classList.add('hidden');
      status?.classList.add('hidden');
    };

    rec.start();
  },

  stopSpeechRecognition() {
    if (this._speechRecognition) {
      this._speechRecognition.stop();
      this._speechRecognition = null;
    }
    document.getElementById('speech-start-btn')?.classList.remove('hidden');
    document.getElementById('speech-stop-btn')?.classList.add('hidden');
    document.getElementById('speech-status')?.classList.add('hidden');
    this.toast('⏹ Запись остановлена', 'info');
  },

  clearSpeechTranscript() {
    const output = document.getElementById('speech-transcript-output');
    if (output) output.value = '';
    this.clearTranscribeResult();
  },

  async analyzeAudioTranscript() {
    const text = document.getElementById('speech-transcript-output')?.value || '';
    const context = document.getElementById('audio-trans-context')?.value || '';
    if (text.trim().length < 50) {
      this.toast('Введите текст транскрипции (минимум несколько реплик)', 'warning');
      return;
    }
    // Copy to text panel and use existing analysis
    const textInput = document.getElementById('trans-text-input');
    const contextInput = document.getElementById('trans-context');
    if (textInput) textInput.value = text;
    if (contextInput) contextInput.value = context;
    this.showTranscribeResult('loading');
    let result = null;
    if (AIEngine.hasKey()) {
      this.setAILoading(true);
      try { result = await AIEngine.analyzeTranscriptAI(text, context); } catch(e) {}
      this.setAILoading(false);
    }
    if (!result) {
      await new Promise(r => setTimeout(r, 800));
      result = Supervisor.analyzeTranscript(text, context);
      if (result.error) { this.toast(result.error, 'error'); return; }
    }
    this.renderTranscribeResult(result);
    this.state.student.transcriptsDone = (this.state.student.transcriptsDone || 0) + 1;
    this.saveState(); this.checkBadges();
  },

  // ===== TRANSCRIPTION ANALYSIS =====
  switchTranscribeTab(tab) {
    document.querySelectorAll('.trans-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.trans-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`trans-${tab}-panel`).classList.remove('hidden');
    document.querySelectorAll('.trans-tab')[tab === 'text' ? 0 : 1].classList.add('active');
  },

  async analyzeTranscript() {
    const text = document.getElementById('trans-text-input')?.value || '';
    const context = document.getElementById('trans-context')?.value || '';
    if (text.trim().length < 50) { this.toast('Введите транскрипцию (минимум несколько реплик)', 'warning'); return; }

    this.showTranscribeResult('loading');

    let result = null;

    // Try AI analysis
    if (AIEngine.hasKey()) {
      this.setAILoading(true);
      try {
        result = await AIEngine.analyzeTranscriptAI(text, context);
      } catch(e) { /* fallback */ }
      this.setAILoading(false);
    }

    // Fallback
    if (!result) {
      await new Promise(r => setTimeout(r, 1200));
      result = Supervisor.analyzeTranscript(text, context);
      if (result.error) { this.toast(result.error, 'error'); return; }
    }

    this.renderTranscribeResult(result);
    this.state.student.transcriptsDone = (this.state.student.transcriptsDone || 0) + 1;
    this.saveState();
    this.checkBadges();
  },

  async analyzeAudio() {
    const fileInput = document.getElementById('audio-file-input');
    if (!fileInput.files.length) { this.toast('Сначала загрузите аудио файл', 'warning'); return; }
    this.showTranscribeResult('loading');

    // Note: For real audio — show instruction
    setTimeout(() => {
      const mockNote = `Клиент: Я не знаю как справляться с этим... уже несколько месяцев так.\nПсихолог: Расскажите, что происходит?\nКлиент: Работа стрессовая, отношения не клеятся. Иногда думаю — зачем всё это.\nПсихолог: Вам нужно просто отдохнуть. Все через это проходят.\nКлиент: Легко говорить...\nПсихолог: Попробуйте заняться спортом. Это помогает.\nКлиент: Я понимаю. Но сил нет даже встать.`;

      const toast = document.getElementById('transcribe-result-content');
      if (toast) toast.innerHTML = `
        <div style="padding:16px;background:rgba(255,179,71,0.1);border:1px solid rgba(255,179,71,0.3);border-radius:10px;margin-bottom:16px;font-size:13px;color:var(--text)">
          <strong><i class="fas fa-info-circle" style="color:#D97706"></i> Аудиотранскрипция</strong><br/>
          Прямая транскрипция аудио в браузере временно недоступна. Используйте <a href="https://app.rev.com" target="_blank" style="color:var(--primary)">Rev.com</a> или <a href="https://speechpad.ru" target="_blank" style="color:var(--primary)">Speechpad.ru</a>, вставьте текст в поле "Транскрипт". 
          Ниже — анализ демонстрационного транскрипта:
        </div>`;

      Supervisor.analyzeTranscript(mockNote, 'Демонстрационный транскрипт из аудио').then
        ? null : this.renderTranscribeResult(Supervisor.analyzeTranscript(mockNote, 'Демонстрационный транскрипт'));
      const r = Supervisor.analyzeTranscript(mockNote, 'Демонстрационный транскрипт');
      this.renderTranscribeResult(r);
      this.state.student.transcriptsDone = (this.state.student.transcriptsDone || 0) + 1;
      this.saveState();
      this.checkBadges();
    }, 1500);
  },

  showTranscribeResult(type) {
    const result = document.getElementById('transcribe-result');
    const content = document.getElementById('transcribe-result-content');
    result.classList.remove('hidden');
    if (type === 'loading') {
      content.innerHTML = `<div class="report-loading">
        <i class="fas fa-spinner fa-spin"></i>
        ${AIEngine.hasKey() ? 'AI-супервизор анализирует...' : 'Анализируем...'}
      </div>`;
    }
    result.scrollIntoView({ behavior: 'smooth' });
  },

  renderTranscribeResult(result) {
    const content = document.getElementById('transcribe-result-content');

    // Если AI вернул живой текст — показываем его напрямую как Арина
    if (result && result.freeText) {
      const formatted = result.freeText
        .replace(/\*\*([^*]+)\*\*/g, '<h3 style="font-size:14px;font-weight:bold;color:var(--accent);margin:1.5rem 0 0.5rem;text-transform:uppercase;letter-spacing:0.05em">$1</h3>')
        .replace(/\n\n/g, '</p><p style="font-size:15px;line-height:1.75;margin-bottom:0.5rem">')
        .replace(/\n/g, '<br/>');
      content.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border)">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:bold;color:#fff">А</div>
          <div>
            <div style="font-size:1rem;font-weight:bold">Арина</div>
            <div style="font-size:0.75rem;color:var(--text-2)">супервизор · ${new Date().toLocaleDateString('ru-RU')}</div>
          </div>
        </div>
        <div style="font-family:Georgia,serif"><p style="font-size:15px;line-height:1.75;margin-bottom:0.5rem">${formatted}</p></div>
        <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid var(--border)">
          <button onclick="App.analyzeTranscript()" style="padding:8px 20px;background:transparent;border:1px solid var(--accent);color:var(--accent);cursor:pointer;border-radius:6px;font-size:14px">Повторный анализ</button>
        </div>`;
      return;
    }

    const scoreClass = result.overallScore >= 80 ? 'score-high' : result.overallScore >= 60 ? 'score-mid' : 'score-low';
    const aiLabel = AIEngine.hasKey() ? ' <span style="font-size:12px;color:var(--accent-2)"><i class="fas fa-robot"></i> AI</span>' : '';

    content.innerHTML = `
      <div class="report-score-big" style="padding:16px 0">
        <span class="report-score-num ${scoreClass}">${result.overallScore}</span>
        <div class="report-score-label">${this.scoreLabel(result.overallScore)}${aiLabel}</div>
      </div>
      ${result.sessionDynamics ? `<div class="report-section"><p style="font-size:14px;color:var(--text-2)">${result.sessionDynamics}</p></div>` : ''}
      <div class="report-section">
        <h4 style="font-size:13px;color:var(--text-2)">📊 ${result.linesAnalyzed || '?'} реплик · Клиент: ${result.clientTurns || '?'} · Психолог: ${result.psychTurns || '?'}${result.context && result.context !== 'Не указан' ? ` · ${result.context}` : ''}</h4>
      </div>
      ${result.errors && result.errors.length > 0 ? `
      <div class="report-section">
        <h4><i class="fas fa-exclamation-circle" style="color:#dc2626"></i> Ошибки</h4>
        <div class="report-errors">
          ${result.errors.map(e => `
            <div class="error-item" style="${e.severity === 'critical' ? 'border-color:rgba(220,38,38,0.5);background:rgba(220,38,38,0.1)' : ''}">
              <div class="error-title">${e.title}</div>
              <div class="error-text">${e.text}</div>
              <div class="error-suggestion"><i class="fas fa-lightbulb"></i> ${e.alternative}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}
      <div class="report-section">
        <h4><i class="fas fa-thumbs-up" style="color:var(--accent-2)"></i> Сильные стороны</h4>
        <div class="strengths-list">
          ${(result.strengths || []).map(s => `<div class="strength-item"><i class="fas fa-check"></i>${s}</div>`).join('')}
        </div>
      </div>
      ${result.dynamics && result.dynamics.length ? `
      <div class="report-section">
        <h4><i class="fas fa-chart-bar" style="color:var(--primary)"></i> Динамика</h4>
        ${result.dynamics.map(d => `<p style="font-size:14px;color:var(--text-2);margin-bottom:6px">${d}</p>`).join('')}
      </div>` : ''}
      ${result.standoutMoments && result.standoutMoments.length ? `
      <div class="report-section">
        <h4><i class="fas fa-bookmark" style="color:var(--accent-3)"></i> Ключевые моменты</h4>
        ${result.standoutMoments.map(m => `<div style="padding:8px 12px;background:var(--bg);border-radius:8px;margin-bottom:6px;font-size:13px"><span style="font-weight:600;color:var(--primary)">${m.label}:</span> ${m.text}</div>`).join('')}
      </div>` : ''}
      <div class="report-section">
        <h4><i class="fas fa-compass" style="color:var(--primary)"></i> Рекомендации</h4>
        <div class="rec-list">
          ${(result.recommendations || []).map(r => `<div class="rec-item"><i class="fas fa-arrow-right"></i>${r}</div>`).join('')}
        </div>
      </div>
      ${result.nextStep ? `<div class="xp-gained" style="margin-top:12px"><i class="fas fa-arrow-right" style="color:var(--primary)"></i> Следующий шаг: ${result.nextStep}</div>` : ''}
    `;
  },

  clearTranscribeResult() {
    document.getElementById('transcribe-result').classList.add('hidden');
    if (document.getElementById('trans-text-input')) document.getElementById('trans-text-input').value = '';
    if (document.getElementById('trans-context')) document.getElementById('trans-context').value = '';
  },

  handleAudioFile(e) {
    const file = e.target.files[0]; if (!file) return;
    document.getElementById('audio-file-name').textContent = file.name;
    document.getElementById('audio-preview').classList.remove('hidden');
  },

  handleAudioDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      document.getElementById('audio-file-name').textContent = file.name;
      document.getElementById('audio-preview').classList.remove('hidden');
    }
  },

  clearAudio() {
    document.getElementById('audio-file-input').value = '';
    document.getElementById('audio-preview').classList.add('hidden');
  },

  // ===== PROGRESS & STATS =====

  addXP(amount) {
    this.state.student.xp += amount;
    const newLevel = this.calculateLevel(this.state.student.xp);
    const oldLevel = this.state.student.level;
    this.state.student.level = newLevel;
    this.saveState();
    this.updateHeaderXP();
    if (newLevel > oldLevel) {
      const levelData = this.levels.find(l => l.level === newLevel);
      this.toast(`🎉 Новый уровень: ${levelData.icon} ${levelData.title}!`, 'success');
    }
  },

  calculateLevel(xp) {
    let level = 1;
    for (const l of this.levels) { if (xp >= l.xp) level = l.level; }
    return level;
  },

  updateHeaderXP() {
    const el = document.getElementById('header-xp');
    if (el) el.textContent = this.state.student.xp;
  },

  updateDashboardStats() {
    const s = this.state.student;
    const sessions = s.sessions || [];
    document.getElementById('stat-sessions').textContent = sessions.length;
    document.getElementById('stat-xp').textContent = s.xp;
    document.getElementById('stat-level').textContent = s.level;
    if (sessions.length) {
      const avg = Math.round(sessions.reduce((sum, ss) => sum + (ss.score || 0), 0) / sessions.length);
      document.getElementById('stat-avg').textContent = avg + '%';
    } else {
      document.getElementById('stat-avg').textContent = '–';
    }
    document.getElementById('student-name-display').textContent = s.name || 'Студент';
    this.renderRecentSessions();
  },

  renderRecentSessions() {
    const list = document.getElementById('recent-sessions-list');
    if (!list) return;
    const sessions = (this.state.student.sessions || []).slice(0, 5);
    if (!sessions.length) {
      list.innerHTML = '<div class="empty-state"><i class="fas fa-moon"></i><p>Пока нет сессий. Начните первую практику!</p></div>'; return;
    }
    list.innerHTML = sessions.map(s => {
      const sc = s.score >= 80 ? 'score-high' : s.score >= 60 ? 'score-mid' : 'score-low';
      return `<div class="session-item">
        <div class="session-emoji">${s.clientEmoji || '👤'}</div>
        <div class="session-info">
          <div class="session-name">${s.clientName} — ${s.clientType} ${s.aiMode ? '<i class="fas fa-robot" style="color:var(--accent-2);font-size:11px" title="AI-сессия"></i>' : ''}</div>
          <div class="session-meta">${s.date} · ${s.messages} реплик · +${s.xpGained} XP</div>
        </div>
        <div class="session-score ${sc}">${s.score}</div>
      </div>`;
    }).join('');
  },

  updateProgressTab() {
    const s = this.state.student;
    const sessions = s.sessions || [];
    const level = this.levels.find(l => l.level === s.level) || this.levels[0];
    const nextLevel = this.levels.find(l => l.level === s.level + 1);

    document.getElementById('level-title-display').textContent = `${level.icon} ${level.title}`;
    document.getElementById('level-num-display').textContent = level.level;
    document.getElementById('xp-current').textContent = s.xp;
    document.getElementById('xp-next').textContent = nextLevel ? nextLevel.xp : '∞';

    if (nextLevel) {
      const pct = Math.min(100, Math.round(((s.xp - level.xp) / (nextLevel.xp - level.xp)) * 100));
      document.getElementById('xp-bar-fill').style.width = pct + '%';
    } else { document.getElementById('xp-bar-fill').style.width = '100%'; }

    document.getElementById('p-sessions').textContent = sessions.length;
    document.getElementById('p-xp').textContent = s.xp;
    if (sessions.length) {
      document.getElementById('p-avg').textContent = Math.round(sessions.reduce((a, b) => a + (b.score || 0), 0) / sessions.length);
      document.getElementById('p-best').textContent = Math.max(...sessions.map(ss => ss.score || 0));
    }
    document.getElementById('p-time').textContent = sessions.reduce((a, b) => a + (b.duration || 0), 0) + ' мин';
    document.getElementById('p-badges').textContent = s.badges.length;

    const historyList = document.getElementById('sessions-history-list');
    if (historyList) {
      if (!sessions.length) { historyList.innerHTML = '<div class="empty-state"><i class="fas fa-moon"></i><p>Пока нет сессий.</p></div>'; return; }
      historyList.innerHTML = sessions.map(ss => {
        const sc = ss.score >= 80 ? 'score-high' : ss.score >= 60 ? 'score-mid' : 'score-low';
        return `<div class="session-item">
          <div class="session-emoji">${ss.clientEmoji || '👤'}</div>
          <div class="session-info">
            <div class="session-name">${ss.clientName} — ${ss.clientType} ${ss.aiMode ? '<i class="fas fa-robot" style="color:var(--accent-2);font-size:11px"></i>' : ''}</div>
            <div class="session-meta">${ss.date} · ${ss.duration || 0} мин · +${ss.xpGained} XP · ${ClientsDB.difficultyStars(ss.difficulty)}</div>
          </div>
          <div class="session-score ${sc}">${ss.score}</div>
        </div>`;
      }).join('');
    }
  },

  renderCharts() {
    const sessions = this.state.student.sessions || [];
    const progressCtx = document.getElementById('progress-chart');
    if (progressCtx) {
      if (this.state.charts.progress) this.state.charts.progress.destroy();
      const data = sessions.slice(0, 10).reverse();
      this.state.charts.progress = new Chart(progressCtx, {
        type: 'line',
        data: {
          labels: data.length ? data.map((s, i) => `#${i+1} ${s.clientName || ''}`) : ['Нет данных'],
          datasets: [{ label: 'Оценка', data: data.length ? data.map(s => s.score || 0) : [0],
            borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.1)',
            tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#6C63FF' }]
        },
        options: { responsive: true, maintainAspectRatio: false,
          scales: { y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } } },
          plugins: { legend: { display: false } } }
      });
    }
    const skillsCtx = document.getElementById('skills-chart');
    if (skillsCtx) {
      if (this.state.charts.skills) this.state.charts.skills.destroy();
      const ss = sessions;
      const empathy    = ss.length ? Math.min(100, 40 + ss.filter(s => s.score > 65).length * 5) : 30;
      const questions  = ss.length ? Math.min(100, 35 + ss.length * 3) : 25;
      const structure  = ss.length ? Math.min(100, 30 + ss.length * 4) : 20;
      const risk       = ss.length ? Math.min(100, 50 + ss.filter(s => s.score > 70).length * 6) : 40;
      const alliance   = ss.length ? Math.min(100, ss.reduce((a,b) => a + (b.score||0), 0) / Math.max(ss.length,1) * 0.9) : 20;
      const spiritual  = ss.length ? Math.min(100, 30 + ss.filter(s => s.category === 'spiritual').length * 15) : 20;
      this.state.charts.skills = new Chart(skillsCtx, {
        type: 'radar',
        data: {
          labels: ['Эмпатия', 'Открытые вопросы', 'Структура', 'Оценка риска', 'Альянс', 'Духовный подход'],
          datasets: [{ label: 'Ваш профиль', data: [empathy, questions, structure, risk, alliance, spiritual],
            backgroundColor: 'rgba(108,99,255,0.2)', borderColor: '#6C63FF', pointBackgroundColor: '#6C63FF' }]
        },
        options: { responsive: true, maintainAspectRatio: false,
          scales: { r: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.08)' }, ticks: { display: false } } },
          plugins: { legend: { display: false } } }
      });
    }
  },

  // ===== BADGES =====
  checkBadges() {
    const s = this.state.student; let newBadge = false;
    this.allBadges.forEach(badge => {
      if (!s.badges.includes(badge.id) && badge.condition(s)) {
        s.badges.push(badge.id); newBadge = true;
        this.toast(`🏅 Новый бейдж: ${badge.emoji} ${badge.name}!`, 'success');
      }
    });
    if (newBadge) { this.saveState(); this.renderBadges(); document.getElementById('p-badges').textContent = s.badges.length; }
  },

  renderBadges() {
    const grid = document.getElementById('badges-grid');
    if (!grid) return;
    const earned = this.state.student.badges || [];
    grid.innerHTML = this.allBadges.map(b => `
      <div class="badge-item ${earned.includes(b.id) ? 'earned' : 'locked'}" title="${b.desc}">
        <div class="badge-emoji">${b.emoji}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>`).join('');
  },

  // ===== KNOWLEDGE BASE =====
  renderKnowledgeBase(items = null) {
    const grid = document.getElementById('knowledge-grid');
    if (!grid) return;
    const data = items || KnowledgeDB.getAll();
    grid.innerHTML = data.map(item => `
      <div class="knowledge-card" onclick="App.showKnowledgeDetail('${item.id}')">
        <div class="kcard-tag tag-${item.category}">${KnowledgeDB.getCategoryLabel(item.category)}</div>
        <h4>${item.title}</h4>
        <p>${item.short}</p>
        ${item.example ? `<div class="kcard-example">${item.example.substring(0, 120)}...</div>` : ''}
      </div>`).join('');
  },

  filterKnowledge(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderKnowledgeBase(KnowledgeDB.getByCategory(cat));
  },

  searchKnowledge(query) {
    if (!query.trim()) { this.renderKnowledgeBase(); return; }
    this.renderKnowledgeBase(KnowledgeDB.search(query));
  },

  showKnowledgeDetail(id) {
    const item = KnowledgeDB.getById(id);
    if (!item) return;
    let modal = document.getElementById('knowledge-detail-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'knowledge-detail-modal'; modal.className = 'modal'; document.body.appendChild(modal); }

    const stepsHtml = item.steps ? `<div class="kdetail-steps">${item.steps.map((step, i) => `<div class="kdetail-step"><div class="kdetail-step-num">${i+1}</div><div class="kdetail-step-text">${step}</div></div>`).join('')}</div>` : '';
    const exampleHtml = item.example ? `<div class="kcard-example" style="white-space:pre-line;font-size:13px;margin-top:12px">${item.example}</div>` : '';
    const verseHtml = item.verse ? `<div class="kdetail-verse">${item.verse.split('—')[0]}<strong>— ${item.verse.split('—')[1] || ''}</strong></div>` : '';
    const mistakesHtml = item.mistakes ? `<div class="report-section" style="margin-top:16px"><h4 style="font-size:14px"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i> Ошибки применения</h4>${item.mistakes.map(m => `<p style="font-size:13px;color:var(--text-2);padding:4px 0;border-bottom:1px solid var(--border)">${m}</p>`).join('')}</div>` : '';

    modal.innerHTML = `
      <div class="modal-overlay" onclick="App.closeModal('knowledge-detail-modal')"></div>
      <div class="modal-box modal-box--wide">
        <div class="modal-header">
          <h3><span class="kcard-tag tag-${item.category}" style="margin-right:8px">${KnowledgeDB.getCategoryLabel(item.category)}</span>${item.title}</h3>
          <button onclick="App.closeModal('knowledge-detail-modal')"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body kdetail-body">
          <p>${item.full || item.short}</p>
          ${stepsHtml}${exampleHtml}${mistakesHtml}${verseHtml}
        </div>
      </div>`;
    modal.classList.remove('hidden');
  },

  // ===== PROFILE =====
  showProfile() {
    document.getElementById('profile-name-input').value = this.state.student.name || '';
    document.getElementById('profile-email-input').value = this.state.student.email || '';
    document.getElementById('profile-modal').classList.remove('hidden');
  },

  saveProfile() {
    const name = document.getElementById('profile-name-input').value.trim();
    const email = document.getElementById('profile-email-input').value.trim();
    if (name) { this.state.student.name = name; document.getElementById('student-name-display').textContent = name; }
    if (email) this.state.student.email = email;
    this.saveState();
    this.closeModal('profile-modal');
    this.toast('✅ Профиль сохранён', 'success');
  },

  resetProgress() {
    if (!confirm('Сбросить весь прогресс? Это нельзя отменить.')) return;
    localStorage.removeItem('psp_student');
    this.state.student = { name: 'Студент', email: '', xp: 0, level: 1, sessions: [], badges: [], transcriptsDone: 0 };
    this.saveState();
    this.closeModal('profile-modal');
    this.updateDashboardStats(); this.updateProgressTab(); this.updateHeaderXP(); this.renderBadges();
    this.toast('🔄 Прогресс сброшен', 'warning');
  },

  // ===== FAQ =====
  toggleFaq(el) {
    el.classList.toggle('open');
  },

  // ===== MODALS =====
  closeModal(id) { document.getElementById(id)?.classList.add('hidden'); },
  openModal(id) { document.getElementById(id)?.classList.remove('hidden'); },

  // ===== KEYS GENERATOR =====
  generateSaleKeys(type, period, countInputId, resultId) {
    const countEl = document.getElementById(countInputId);
    const resultEl = document.getElementById(resultId);
    if (!countEl || !resultEl) return;

    const count = Math.min(50, Math.max(1, parseInt(countEl.value) || 5));
    const keys = [];
    for (let i = 0; i < count; i++) {
      keys.push(AccessSystem.generateKey(type, period));
    }

    const prices = { BASE: '1 000 ₽ · 30 дней', PROF: '2 500 ₽ · 90 дней + AI', TEAM: '8 900 ₽ · 365 дней + AI' };
    const price = prices[type] || '';

    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `
      <div class="keys-result-header">
        <span>${count} ключей · ${price}</span>
        <button class="btn-ghost btn-sm" onclick="App._copyKeysList('${resultId}')">
          <i class="fas fa-copy"></i> Скопировать все
        </button>
      </div>
      <div class="keys-result-list" id="${resultId}-list">
${keys.map((k,i) => `        <div class="keys-result-item">
          <span class="keys-result-num">${i+1}</span>
          <code class="keys-result-code">${k}</code>
          <button class="btn-ghost btn-sm" onclick="App._copyText('${k}')"><i class="fas fa-copy"></i></button>
        </div>`).join('\n')}
      </div>`;

    this.toast(`✅ ${count} ключей создано!`, 'success');
  },

  async _copyKeysList(resultId) {
    const listEl = document.getElementById(resultId + '-list');
    if (!listEl) return;
    const codes = [...listEl.querySelectorAll('.keys-result-code')].map(el => el.textContent).join('\n');
    await this._copyText(codes);
    this.toast('📋 Все ключи скопированы!', 'success');
  },

  async _copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
  },


  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(el);
    setTimeout(() => { el.classList.add('hiding'); setTimeout(() => el.remove(), 300); }, 3500);
  },

  // ===== UTILS =====
  escapeHtml(text) {
    return (text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
};

// ===== AUTO-INIT =====
document.addEventListener('DOMContentLoaded', () => {
  App.loadState();
  App.updateHeaderXP();
});
