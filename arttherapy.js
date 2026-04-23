/* ═══════════════════════════════════════════════════════════════════
   АРТ-ТЕРАПИЯ — модуль Марины Вороновой
   Добавить в index.html:
   1. Кнопку в nav: data-tab="arttherapy" 
   2. Секцию tab-arttherapy
   3. Этот скрипт перед </body>
   ═══════════════════════════════════════════════════════════════════ */

const ART_TECHNIQUES = {
  free:               { label: 'Свободный рисунок',       icon: '🎨', desc: 'Клиент рисует что хочет без ограничений' },
  family:             { label: 'Кинетический рисунок семьи', icon: '👨‍👩‍👧', desc: 'Семья в движении — динамика отношений' },
  tree:               { label: 'Дерево (тест Коха)',       icon: '🌳', desc: 'Образ дерева как проекция самости' },
  house_tree_person:  { label: 'Дом-Дерево-Человек',      icon: '🏠', desc: 'Три образа — три уровня психики' },
  nonexistent_animal: { label: 'Несуществующее животное',  icon: '🦄', desc: 'Проективная техника самопознания' },
  mandala:            { label: 'Мандала',                  icon: '⭕', desc: 'Круговой рисунок — интеграция и центрирование' },
  scribble:           { label: 'Каракули (Уинникотт)',     icon: '✏️', desc: 'Совместное рисование — игра и контакт' },
  self_portrait:      { label: 'Автопортрет',              icon: '🪞', desc: 'Образ себя — самовосприятие и идентичность' },
};

const MARINA_SYSTEM = `Ты — Марина Воронова, профессиональный арт-терапевт с 15-летним опытом. Интегрируешь юнгианский подход, феноменологию и клинические техники (Малкиоди, Кальфф, Бак, Лёвенфельд).

СТРУКТУРА АНАЛИЗА РИСУНКА:

**🎨 ПЕРВОЕ ВПЕЧАТЛЕНИЕ**
Целостное впечатление. Что бросается в глаза первым. Эмоциональный отклик.

**📐 ФОРМАЛЬНЫЕ ЭЛЕМЕНТЫ**
Линия (качество, давление, непрерывность), цвет (выбор, интенсивность), пространство (использование листа, пустоты), форма, размер, расположение.

**🔍 СОДЕРЖАТЕЛЬНЫЙ АНАЛИЗ**
Символы, образы, нарративы. Что изображено буквально и метафорически.

**💭 ПСИХОЛОГИЧЕСКАЯ ИНТЕРПРЕТАЦИЯ**
Возможные психологические аспекты с теоретической рамкой. ВАЖНО: интерпретации — гипотезы, не диагнозы.

**❓ ВОПРОСЫ ДЛЯ ДИАЛОГА**
3-5 конкретных вопросов для углубления понимания рисунка.

**📚 КЛИНИЧЕСКИЕ ЗАМЕЧАНИЯ**
Что стоит исследовать дополнительно. Ограничения интерпретации.

ВАЖНО:
- Всегда указывай что интерпретация — гипотеза
- Используй язык возможности: "может указывать", "возможно", "стоит исследовать"
- Учитывай контекст предоставленный психологом
- Будь конкретна и практична для учебных целей`;

const ArtTherapy = {
  _imageData: null,
  _lastAnalysis: null,
  _chatMessages: [],

  render() {
    return `
    <div class="art-container">
      <div class="art-header">
        <h2><i class="fas fa-palette"></i> Арт-терапия</h2>
        <p>Загрузи рисунок клиента — Марина Воронова проведёт профессиональный арт-терапевтический разбор</p>
      </div>

      <div class="art-layout">
        <!-- Левая панель: загрузка -->
        <div class="art-upload-panel">
          <div class="art-marina-card">
            <div class="art-marina-avatar">🎨</div>
            <div>
              <div class="art-marina-name">Марина Воронова</div>
              <div class="art-marina-title">Арт-терапевт · 15 лет практики</div>
              <div class="art-marina-online"><span class="online-dot"></span> Онлайн</div>
            </div>
          </div>

          <!-- Техника -->
          <div class="form-group" style="margin-top:16px">
            <label><i class="fas fa-tools"></i> Техника рисунка</label>
            <select id="art-technique" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:10px;font-family:var(--font);font-size:14px">
              ${Object.entries(ART_TECHNIQUES).map(([k,v]) => 
                `<option value="${k}">${v.icon} ${v.label}</option>`
              ).join('')}
            </select>
          </div>

          <!-- Контекст -->
          <div class="form-group">
            <label><i class="fas fa-info-circle"></i> Контекст (необязательно)</label>
            <textarea id="art-context" rows="3" style="width:100%;border:2px solid var(--border);border-radius:10px;padding:10px;font-family:var(--font);font-size:13px;resize:vertical" placeholder="Возраст клиента, запрос, что происходило до рисования..."></textarea>
          </div>

          <!-- Загрузка -->
          <div id="art-upload-zone" class="art-upload-zone" onclick="document.getElementById('art-file-input').click()" ondragover="event.preventDefault()" ondrop="ArtTherapy.drop(event)">
            <i class="fas fa-cloud-upload-alt" style="font-size:32px;color:var(--primary);margin-bottom:12px"></i>
            <p style="font-weight:600;margin-bottom:4px">Загрузите рисунок</p>
            <p style="font-size:13px;color:var(--text-2)">JPG, PNG, WebP · до 10 МБ</p>
            <input type="file" id="art-file-input" accept="image/*" style="display:none" onchange="ArtTherapy.fileSelected(this)">
          </div>

          <div id="art-preview-wrap" class="hidden" style="margin-top:12px">
            <img id="art-preview" style="width:100%;border-radius:10px;border:2px solid var(--border)">
            <button class="btn-ghost" style="width:100%;margin-top:8px" onclick="ArtTherapy.clear()">
              <i class="fas fa-times"></i> Убрать рисунок
            </button>
          </div>

          <button id="art-analyze-btn" class="btn-primary" style="width:100%;margin-top:12px" disabled onclick="ArtTherapy.analyze()">
            <i class="fas fa-search"></i> Анализировать рисунок
          </button>
        </div>

        <!-- Правая панель: результат -->
        <div class="art-result-panel">
          <div id="art-placeholder" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:400px;color:var(--text-2);text-align:center">
            <i class="fas fa-palette" style="font-size:48px;opacity:0.2;margin-bottom:16px"></i>
            <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Загрузите рисунок</h3>
            <p style="font-size:14px">Марина проведёт профессиональный разбор</p>
          </div>

          <div id="art-result" class="hidden"></div>

          <!-- Чат с Мариной -->
          <div id="art-chat" class="hidden" style="margin-top:20px;border:1.5px solid var(--border);border-radius:12px;overflow:hidden">
            <div style="padding:12px 16px;background:linear-gradient(135deg,var(--bg-dark),var(--bg-dark-2));display:flex;align-items:center;gap:10px">
              <span style="font-size:20px">🎨</span>
              <div>
                <div style="font-size:14px;font-weight:700;color:#fff">Марина Воронова</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.5)">Задайте вопрос по рисунку</div>
              </div>
            </div>
            <div id="art-chat-messages" style="height:200px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px"></div>
            <div style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border)">
              <textarea id="art-chat-input" rows="2" style="flex:1;border:2px solid var(--border);border-radius:8px;padding:8px;font-family:var(--font);font-size:13px;resize:none" placeholder="Спросите Марину о рисунке..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ArtTherapy.sendChat()}"></textarea>
              <button class="btn-send" onclick="ArtTherapy.sendChat()"><i class="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  fileSelected(input) {
    const file = input.files[0];
    if (!file) return;
    this._loadFile(file);
  },

  drop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) this._loadFile(file);
  },

  _loadFile(file) {
    if (file.size > 10 * 1024 * 1024) { App.toast('Файл слишком большой — максимум 10 МБ', 'error'); return; }
    if (!file.type.startsWith('image/')) { App.toast('Только изображения (JPG, PNG, WebP)', 'warning'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this._imageData = { base64: dataUrl.split(',')[1], mediaType: file.type };

      const preview = document.getElementById('art-preview');
      if (preview) {
        preview.src = dataUrl;
        document.getElementById('art-preview-wrap').classList.remove('hidden');
        document.getElementById('art-upload-zone').style.display = 'none';
      }
      document.getElementById('art-analyze-btn').disabled = false;
      App.toast('Рисунок загружен', 'success');
    };
    reader.readAsDataURL(file);
  },

  clear() {
    this._imageData = null;
    this._lastAnalysis = null;
    this._chatMessages = [];
    document.getElementById('art-preview-wrap').classList.add('hidden');
    document.getElementById('art-upload-zone').style.display = '';
    document.getElementById('art-analyze-btn').disabled = true;
    document.getElementById('art-file-input').value = '';
    document.getElementById('art-result').classList.add('hidden');
    document.getElementById('art-result').innerHTML = '';
    document.getElementById('art-placeholder').style.display = '';
    document.getElementById('art-chat').classList.add('hidden');
    document.getElementById('art-chat-messages').innerHTML = '';
  },

  async analyze() {
    if (!this._imageData) { App.toast('Сначала загрузите рисунок', 'warning'); return; }

    const context   = document.getElementById('art-context').value.trim();
    const technique = document.getElementById('art-technique').value;
    const techData  = ART_TECHNIQUES[technique];

    document.getElementById('art-placeholder').style.display = 'none';
    const resultEl = document.getElementById('art-result');
    resultEl.classList.remove('hidden');
    resultEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-2)"><i class="fas fa-spinner fa-spin" style="font-size:28px;color:var(--primary);margin-bottom:12px;display:block"></i>Марина анализирует рисунок...</div>`;

    this._chatMessages = [];
    document.getElementById('art-chat-messages').innerHTML = '';

    const userText = `Техника: ${techData.label}\n${context ? 'Контекст: ' + context : ''}\n\nПожалуйста, проведи профессиональный арт-терапевтический разбор этого рисунка.`;

    try {
      // Используем vision через Railway прокси
      const body = {
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: MARINA_SYSTEM,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: this._imageData.mediaType, data: this._imageData.base64 } },
            { type: 'text', text: userText }
          ]
        }]
      };

      const resp = await fetch('https://psychosupervisor-proxy-production.up.railway.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120000)
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const analysis = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';

      this._lastAnalysis = analysis;
      this._renderResult(resultEl, analysis, techData, context);
      document.getElementById('art-chat').classList.remove('hidden');

      // Первое сообщение от Марины
      this._addChatMsg('marina', 'Разбор готов. Если хотите углубиться в какой-то аспект или задать вопрос по рисунку — я здесь.');

      if (typeof App !== 'undefined') {
        App.state.student.transcriptsDone = (App.state.student.transcriptsDone || 0) + 1;
        App.saveState();
      }

    } catch(e) {
      resultEl.innerHTML = `<div style="color:#ef4444;padding:20px;text-align:center"><i class="fas fa-exclamation-circle"></i> Ошибка анализа: ${e.message}</div>`;
    }
  },

  _renderResult(container, text, techData, context) {
    const sections = this._parseSections(text);

    const sectionStyles = {
      'ПЕРВОЕ ВПЕЧАТЛЕНИЕ':        { bg: '#f0f9ff', border: '#0ea5e9', icon: '👁️' },
      'ФОРМАЛЬНЫЕ ЭЛЕМЕНТЫ':       { bg: '#fdf4ff', border: '#a855f7', icon: '📐' },
      'СОДЕРЖАТЕЛЬНЫЙ АНАЛИЗ':     { bg: '#fff7ed', border: '#f97316', icon: '🔍' },
      'ПСИХОЛОГИЧЕСКАЯ ИНТЕРПРЕТАЦИЯ': { bg: '#ecfdf5', border: '#10b981', icon: '💭' },
      'ВОПРОСЫ ДЛЯ ДИАЛОГА':      { bg: '#fef9c3', border: '#eab308', icon: '❓' },
      'КЛИНИЧЕСКИЕ ЗАМЕЧАНИЯ':     { bg: '#fef2f2', border: '#ef4444', icon: '📋' },
    };

    let html = `<div style="background:var(--primary-light);border-radius:10px;padding:10px 14px;margin-bottom:16px;display:flex;gap:8px;align-items:center">
      <span style="font-size:20px">${techData.icon}</span>
      <div><strong>${techData.label}</strong>${context ? `<br><span style="font-size:12px;color:var(--text-2)">${context}</span>` : ''}</div>
    </div>`;

    if (sections.length) {
      sections.forEach(sec => {
        const key = Object.keys(sectionStyles).find(k => sec.title.toUpperCase().includes(k));
        const style = key ? sectionStyles[key] : { bg: '#f8fafc', border: '#94a3b8', icon: '📝' };
        html += `<div style="background:${style.bg};border-left:3px solid ${style.border};border-radius:8px;padding:14px 16px;margin-bottom:12px">
          <div style="font-weight:700;font-size:13px;margin-bottom:8px">${style.icon} ${sec.title}</div>
          <div style="font-size:13px;line-height:1.7;color:var(--text)">${this._md(sec.body)}</div>
        </div>`;
      });
    } else {
      html += `<div style="font-size:14px;line-height:1.8">${this._md(text)}</div>`;
    }

    container.innerHTML = html;
  },

  _parseSections(text) {
    const sections = [];
    const lines = text.split('\n');
    let current = null;

    for (const line of lines) {
      const heading = line.match(/^\*{1,2}([^*]+)\*{1,2}$/) || line.match(/^#{1,3}\s+(.+)$/);
      if (heading) {
        if (current) sections.push(current);
        current = { title: heading[1].trim(), body: '' };
      } else if (current) {
        current.body += line + '\n';
      }
    }
    if (current) sections.push(current);
    return sections;
  },

  _md(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  },

  async sendChat() {
    const input = document.getElementById('art-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    this._addChatMsg('user', text);
    this._chatMessages.push({ role: 'user', content: text });

    const context = `Марина Воронова, арт-терапевт. Ты уже провела разбор рисунка.\n\nТвой анализ:\n${this._lastAnalysis || ''}\n\nОтвечай на вопросы психолога коротко и по делу (2-4 предложения).`;

    try {
      const body = {
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: context,
        messages: this._chatMessages
      };

      const resp = await fetch('https://psychosupervisor-proxy-production.up.railway.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });

      const data = await resp.json();
      const answer = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
      this._chatMessages.push({ role: 'assistant', content: answer });
      this._addChatMsg('marina', answer);
    } catch(e) {
      this._addChatMsg('marina', 'Не удалось получить ответ. Попробуйте ещё раз.');
    }
  },

  _addChatMsg(role, text) {
    const container = document.getElementById('art-chat-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.style.cssText = role === 'marina'
      ? 'background:var(--bg);border:1px solid var(--border);border-radius:10px 10px 10px 2px;padding:10px 14px;font-size:13px;line-height:1.6'
      : 'background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;border-radius:10px 10px 2px 10px;padding:10px 14px;font-size:13px;line-height:1.6;align-self:flex-end;margin-left:auto;max-width:80%';
    div.innerHTML = role === 'marina' ? `<strong style="font-size:11px;color:var(--text-2)">🎨 Марина</strong><br>${text}` : text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }
};
