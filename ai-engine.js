/* ============================================
   PsychoSupervisor Pro — AI Engine v3
   Anthropic Claude API через Vercel прокси
   ============================================ */

const AIEngine = {

  ENDPOINT: 'https://psych-trainer-v2.vercel.app/api/claude',
  _requestCount: 0,

  init() {},

  hasKey() { return true; },
  saveKey(key) { localStorage.setItem('psp_openrouter_key', key.trim()); },
  loadKey() { return localStorage.getItem('psp_openrouter_key') || ''; },
  clearKey() { localStorage.removeItem('psp_openrouter_key'); },
  setModel(model) { localStorage.setItem('psp_model', model); },

  async chat(messages, options = {}) {
    const systemMsg = messages.find(m => m.role === 'system');
    const userMsgs = messages.filter(m => m.role !== 'system');
    const body = {
      model: 'anthropic/claude-3-5-sonnet',
      max_tokens: options.maxTokens || 600,
      system: systemMsg ? systemMsg.content : undefined,
      messages: userMsgs,
    };
    try {
      const resp = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(45000)
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this._requestCount++;
      if (data.content) return data.content.map(b => b.text || '').join('');
      return data.choices?.[0]?.message?.content || '';
    } catch (e) { throw e; }
  },

  async generateClientResponse(client, sessionMessages, studentMessage, sessionState) {
    const trustPct = sessionState.trust || client.trust;
    const anxietyPct = sessionState.anxiety || client.anxiety;
    const opennessPct = sessionState.openness || client.openness;
    const system = `Ты играешь роль клиента на психологической консультации. Веди себя СТРОГО по роли.

ПРОФИЛЬ:
- Имя: ${client.name}, ${client.age}
- Проблема: ${client.type}
- Запрос: ${client.request}
- История: ${client.history}
- Черты: ${client.traits.join(', ')}

СОСТОЯНИЕ:
- Тревога: ${anxietyPct}% ${anxietyPct > 70 ? '(очень высокая)' : anxietyPct > 40 ? '(умеренная)' : '(низкая)'}
- Доверие: ${trustPct}% ${trustPct < 30 ? '(низкое — закрыт)' : trustPct < 60 ? '(среднее)' : '(высокое — открыт)'}
- Открытость: ${opennessPct}%

ПРАВИЛА: 2-4 предложения. Разговорный русский. Сопротивляйся советам. Периодически "(молчит)", "(вздыхает)". ОБЯЗАТЕЛЬНО заканчивай мысль.
Отвечай только репликой клиента, без кавычек.`;

    const history = sessionMessages.slice(-20).map(m => ({
      role: m.role === 'student' ? 'user' : 'assistant',
      content: m.text
    }));
    history.push({ role: 'user', content: studentMessage });

    try {
      const response = await this.chat([{ role: 'system', content: system }, ...history], { maxTokens: 350 });
      let text = response.trim();
      if (text && !text.match(/[.!?…)"'
]$/)) {
        const lastPunct = Math.max(text.lastIndexOf('.'), text.lastIndexOf('!'), text.lastIndexOf('?'));
        if (lastPunct > text.length * 0.5) text = text.substring(0, lastPunct + 1);
        else text = text + '...';
      }
      return text;
    } catch (e) { return null; }
  },

  async generateSupervisorHint(client, sessionMessages, studentMessage, sessionState) {
    const trust = sessionState.trust || client.trust;
    const anxiety = sessionState.anxiety || client.anxiety;
    const phase = sessionState.phase || 'contact';
    const phaseLabels = { contact: 'установление контакта', exploration: 'исследование', insight: 'инсайт', change: 'изменение' };
    const system = `Ты — Арина, супервизор-психолог 15 лет стажа. Прямо, живо, одна подсказка как живой человек смотрит через плечо. 1-2 предложения без буллетов.
Клиент: ${client.name}, ${client.age}. Проблема: ${client.type}. Фаза: ${phaseLabels[phase]}. Доверие: ${trust}%. Тревога: ${anxiety}%.`;
    const lastExchanges = sessionMessages.slice(-6).map(m => `${m.role === 'student' ? 'Психолог' : 'Клиент'}: ${m.text}`).join('
');
    try {
      const response = await this.chat([
        { role: 'system', content: system },
        { role: 'user', content: `${lastExchanges}

Психолог написал: "${studentMessage}"

Одна подсказка:` }
      ], { maxTokens: 120 });
      return '💡 ' + response.trim();
    } catch (e) { return null; }
  },

  async generateSupervisorAdvice(client, sessionMessages, question, sessionState) {
    const trust = sessionState.trust || client.trust;
    const anxiety = sessionState.anxiety || client.anxiety;
    const phase = sessionState.phase || 'contact';
    const phaseLabels = { contact: 'установление контакта', exploration: 'исследование', insight: 'инсайт', change: 'изменение' };
    const system = `Ты — Арина, супервизор-психолог 15 лет стажа. Прямо, живо, конкретный совет — что делать прямо сейчас. 2-4 предложения. Без буллетов.
Клиент: ${client.name}, ${client.age}. Проблема: ${client.type}. Фаза: ${phaseLabels[phase]}. Доверие: ${trust}%. Тревога: ${anxiety}%.`;
    const context = sessionMessages.slice(-12).map(m => {
      if (m.role === 'student') return `Психолог: ${m.text}`;
      if (m.role === 'client') return `Клиент: ${m.text}`;
      return null;
    }).filter(Boolean).join('
');
    const userMsg = question ? `Контекст:
${context}

Вопрос: "${question}"` : `Контекст:
${context}

Дай рекомендацию.`;
    try {
      const response = await this.chat([{ role: 'system', content: system }, { role: 'user', content: userMsg }], { maxTokens: 280 });
      return response.trim();
    } catch (e) { return null; }
  },

  async analyzeSessionFull(client, sessionMessages, sessionState) {
    const system = `Ты — Арина, супервизор-психолог 15 лет стажа. Разбор сессии — прямо, конкретно, с цитатами. Без буллетов. КПТ, МИ, DBT, ACT, духовное измерение.`;
    const transcript = sessionMessages.filter(m => m.role !== 'system').map(m => {
      if (m.role === 'client') return `КЛИЕНТ: ${m.text}`;
      if (m.role === 'student') return `ПСИХОЛОГ: ${m.text}`;
      return null;
    }).filter(Boolean).join('
');
    const prompt = `Клиент: ${client.name}, ${client.age}. Тип: ${client.type}. Запрос: ${client.request}.

ТРАНСКРИПТ:
${transcript}

JSON разбор:
{
  "score": число 0-100,
  "summary": "3-4 предложения о сессии",
  "worked": "ЧТО СРАБОТАЛО с цитатами",
  "missed": "ЧТО УПУСТИЛ с цитатами",
  "errors": [{"title": "ошибка", "text": "объяснение с цитатой", "suggestion": "альтернатива"}],
  "strengths": ["сильная сторона с примером"],
  "keyMoments": [{"label": "момент", "text": "что произошло"}],
  "clientProfile": "портрет клиента",
  "nextSession": "план следующей встречи",
  "recommendations": ["рекомендация"]
}
Только JSON.`;
    try {
      const response = await this.chat([{ role: 'system', content: system }, { role: 'user', content: prompt }], { maxTokens: 1000 });
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return null;
    } catch (e) { return null; }
  },

  async analyzeTranscriptAI(text, context) {
    const system = `Ты — Арина, супервизор-психолог с 15-летним стажем. Анализируешь реальные сессии. Говоришь прямо, живо, иногда с юмором — но всегда точно. Видишь то что терапевт не видит. Пишешь связным текстом без буллетов. Цитируешь конкретные фразы.`;
    const ctx = context && context.trim() ? `
Контекст: ${context}
` : '';
    const prompt = `Транскрибация сессии:${ctx}

${text}

Дай полный супервизорский разбор. Пиши как живой опытный супервизор — прямо, с характером, без пустых слов. Цитируй фразы из текста.

Структура:

**ЧТО СРАБОТАЛО**

**ЧТО УПУСТИЛ**

**КЛЮЧЕВЫЕ МОМЕНТЫ**

**ПЛАН НА СЛЕДУЮЩУЮ ВСТРЕЧУ**`;
    try {
      const response = await this.chat([{ role: 'system', content: system }, { role: 'user', content: prompt }], { maxTokens: 1500 });
      return { freeText: response.trim() };
    } catch (e) { return null; }
  },

  async testConnection() {
    try {
      const result = await this.chat([{ role: 'user', content: 'Ответь одним словом: Работает' }], { maxTokens: 10 });
      return { ok: true, response: result };
    } catch (e) { return { ok: false, error: e.message }; }
  },

  getErrorMessage(code) {
    return { 'RATE_LIMIT': 'Превышен лимит. Подождите минуту.', 'NO_CREDITS': 'Ресурсы AI исчерпаны.' }[code] || 'Ошибка соединения';
  }
};

document.addEventListener('DOMContentLoaded', () => AIEngine.init());
