/* ═══════════════════════════════════════════════════════════════════
   ПОСЛЕСЕССИОННЫЙ ЧАТ С АРИНОЙ
   Автоматически запускается после завершения сессии
   ═══════════════════════════════════════════════════════════════════ */

const ArinaChat = {
  _messages: [],
  _sessionData: null,
  _client: null,

  ARINA_SYSTEM: `Ты — Арина, супервизор-психолог с 22 годами клинической практики. Только что завершилась учебная сессия студента-психолога с клиентом.

Твой стиль:
- Прямой, тёплый, без сюсюканья
- Говоришь как умный коллега за кофе
- Конкретные цитаты из сессии когда нужно
- Можешь мягко поддеть если видишь самообман
- Интегрируешь КПТ, МИ, DBT, ACT, Франкл, духовное измерение
- Короткие ответы (3-5 предложений), только по делу

Отвечай на вопросы студента по прошедшей сессии. Будь наставником, не лектором.`,

  open(sessionData, client, analysis) {
    this._sessionData = sessionData;
    this._client = client;
    this._messages = [];

    // Создаём модальное окно
    let modal = document.getElementById('arina-chat-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'arina-chat-modal';
      modal.className = 'modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = this._renderModal(client, analysis);
    modal.classList.remove('hidden');

    // Первое сообщение от Арины
    setTimeout(() => this._sendArinaOpening(client, analysis), 500);
  },

  _renderModal(client, analysis) {
    return `
    <div class="modal-overlay" onclick="ArinaChat.close()"></div>
    <div class="modal-box modal-box--wide" style="max-width:680px;height:85vh;display:flex;flex-direction:column">
      <div class="modal-header" style="background:linear-gradient(135deg,#1A1A2E,#16213E);border-radius:16px 16px 0 0;flex-shrink:0">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:20px">🎓</div>
          <div>
            <h3 style="color:#fff;font-size:15px;margin:0">Арина Волкова</h3>
            <small style="color:rgba(255,255,255,0.5)"><span class="online-dot"></span> Супервизор · 22 года практики</small>
          </div>
        </div>
        <button onclick="ArinaChat.close()" style="color:rgba(255,255,255,0.6);background:none;border:none;cursor:pointer;font-size:18px"><i class="fas fa-times"></i></button>
      </div>

      <div id="arina-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:var(--bg)"></div>

      <div style="padding:12px 16px;background:#fff;border-top:1px solid var(--border);flex-shrink:0">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          ${this._quickQuestions(client).map(q =>
            `<button onclick="ArinaChat.quickAsk('${q.replace(/'/g, "\\'")}')" style="background:var(--primary-light);color:var(--primary);border:none;border-radius:20px;padding:5px 12px;font-size:12px;cursor:pointer;font-family:var(--font)">${q}</button>`
          ).join('')}
        </div>
        <div style="display:flex;gap:8px">
          <textarea id="arina-input" rows="2" style="flex:1;border:2px solid var(--border);border-radius:10px;padding:10px;font-family:var(--font);font-size:14px;resize:none;outline:none" placeholder="Спросите Арину о сессии..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();ArinaChat.send()}"></textarea>
          <button onclick="ArinaChat.send()" style="width:42px;height:42px;align-self:flex-end;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>`;
  },

  _quickQuestions(client) {
    const base = ['Где я ошибся?', 'Что сработало?', 'Как работать с сопротивлением?'];
    const catQ = {
      addiction: ['Как работать с отрицанием?', 'МИ техники для этого клиента'],
      anxiety: ['Как снизить тревогу клиента?', 'Когнитивные техники здесь'],
      depression: ['Как мотивировать?', 'Риски которые я пропустил'],
      trauma: ['Как работать с травмой безопасно?', 'Признаки диссоциации'],
      personality: ['Как держать границы?', 'Валидация при ПРЛ'],
      spiritual: ['Как работать с гневом на Бога?', 'Франкл в этом случае'],
      relationship: ['Работа с созависимостью', 'Системный подход здесь'],
    };
    return [...base, ...(catQ[client?.category] || [])].slice(0, 4);
  },

  async _sendArinaOpening(client, analysis) {
    const score = analysis?.score || 50;
    const context = this._buildContext();

    const prompt = `Сессия только что завершилась. Оценка: ${score}/100.
Клиент: ${client?.name}, ${client?.age}. ${client?.type}.
${analysis?.worked ? 'Что сработало: ' + analysis.worked : ''}
${analysis?.missed ? 'Что упущено: ' + analysis.missed : ''}

Дай короткое (3-4 предложения) открывающее послесессионное сообщение студенту. Начни с самого важного наблюдения. Пригласи задать вопросы.`;

    this._addMessage('arina', '⏳ Арина анализирует сессию...');

    try {
      const body = {
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        system: this.ARINA_SYSTEM,
        messages: [{ role: 'user', content: prompt }]
      };

      const resp = await fetch('https://psychosupervisor-proxy-production.up.railway.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });

      const data = await resp.json();
      const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';

      // Убираем сообщение загрузки
      const msgs = document.getElementById('arina-messages');
      if (msgs && msgs.lastChild) msgs.removeChild(msgs.lastChild);

      this._addMessage('arina', text);
      this._messages.push({ role: 'assistant', content: text });

    } catch(e) {
      const msgs = document.getElementById('arina-messages');
      if (msgs && msgs.lastChild) msgs.removeChild(msgs.lastChild);
      const fallback = `Сессия завершена. Оценка ${score}/100 — ${score >= 70 ? 'хорошая работа' : 'есть над чем поработать'}. Задавайте вопросы — разберём конкретные моменты.`;
      this._addMessage('arina', fallback);
      this._messages.push({ role: 'assistant', content: fallback });
    }
  },

  quickAsk(question) {
    const input = document.getElementById('arina-input');
    if (input) input.value = question;
    this.send();
  },

  async send() {
    const input = document.getElementById('arina-input');
    const text = input?.value?.trim();
    if (!text) return;
    input.value = '';

    this._addMessage('student', text);
    this._messages.push({ role: 'user', content: text });

    const typingId = 'arina-typing-' + Date.now();
    this._addMessage('arina', '...', typingId);

    try {
      const context = this._buildContext();
      const systemWithContext = this.ARINA_SYSTEM + '\n\n' + context;

      const body = {
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: systemWithContext,
        messages: this._messages
      };

      const resp = await fetch('https://psychosupervisor-proxy-production.up.railway.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000)
      });

      const data = await resp.json();
      const answer = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';

      document.getElementById(typingId)?.remove();
      this._addMessage('arina', answer);
      this._messages.push({ role: 'assistant', content: answer });

    } catch(e) {
      document.getElementById(typingId)?.remove();
      this._addMessage('arina', 'Не удалось получить ответ. Попробуйте ещё раз.');
    }
  },

  _buildContext() {
    const client = this._client;
    const session = this._sessionData;
    if (!client) return '';

    const transcript = (session?.messages || [])
      .filter(m => m.role !== 'system')
      .slice(-20)
      .map(m => {
        if (m.role === 'client') return `Клиент: ${m.text}`;
        if (m.role === 'student') return `Психолог: ${m.text}`;
        return null;
      })
      .filter(Boolean)
      .join('\n');

    return `КОНТЕКСТ СЕССИИ:
Клиент: ${client.name}, ${client.age}. ${client.type}. Запрос: ${client.request}.
История: ${client.history}
Оценка сессии: ${session?.score || '–'}/100

ТРАНСКРИПТ (последние реплики):
${transcript}`;
  },

  _addMessage(role, text, id) {
    const container = document.getElementById('arina-messages');
    if (!container) return;

    const div = document.createElement('div');
    if (id) div.id = id;

    if (role === 'arina') {
      div.innerHTML = `
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🎓</div>
          <div style="background:#fff;border:1px solid var(--border);border-radius:10px 10px 10px 2px;padding:12px 14px;font-size:14px;line-height:1.7;max-width:85%">
            <strong style="font-size:11px;color:var(--text-2);display:block;margin-bottom:4px">Арина</strong>
            ${text}
          </div>
        </div>`;
    } else {
      div.innerHTML = `
        <div style="display:flex;justify-content:flex-end">
          <div style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;border-radius:10px 10px 2px 10px;padding:12px 14px;font-size:14px;line-height:1.7;max-width:80%">
            ${text}
          </div>
        </div>`;
    }

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  close() {
    document.getElementById('arina-chat-modal')?.classList.add('hidden');
  }
};
