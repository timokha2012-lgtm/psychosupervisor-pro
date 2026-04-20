/* ============================================
   PsychoSupervisor Pro — AI Engine
   OpenRouter proxy (works from Russia without VPN)
   Supports: Claude 3 Haiku, GPT-4o-mini, Gemini Flash
   ============================================ */

const AIEngine = {

  // ===== CONFIG =====
  // OpenRouter.ai — работает из России, CORS разрешён, оплата картой РФ
  ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',

  // Fallback endpoints (если один недоступен)
  ENDPOINTS: [
    'https://openrouter.ai/api/v1/chat/completions',
  ],

  // Рекомендуемые модели (дешевле → дороже)
  MODELS: {
    fast:    'google/gemini-flash-1.5',          // $0.075/1M tokens — быстрый, дешёвый
    smart:   'anthropic/claude-3-haiku',          // $0.25/1M tokens — лучший для диалога
    premium: 'openai/gpt-4o-mini',               // $0.15/1M tokens — GPT качество
    free:    'mistralai/mistral-7b-instruct:free' // БЕСПЛАТНО (лимит)
  },

  // ===== STATE =====
  _apiKey: null,
  _model: 'google/gemini-flash-1.5',
  _useFallback: false,
  _requestCount: 0,

  // ===== INIT =====
  init() {
    this._apiKey = this.loadKey();
    const savedModel = localStorage.getItem('psp_model');
    if (savedModel) this._model = savedModel;
  },

  // ===== KEY MANAGEMENT =====
  DEFAULT_KEY: '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',

  loadKey() {
    return localStorage.getItem('psp_openrouter_key') || this.DEFAULT_KEY;
  },

  saveKey(key) {
    localStorage.setItem('psp_openrouter_key', key.trim());
    this._apiKey = key.trim();
  },

  clearKey() {
    localStorage.removeItem('psp_openrouter_key');
    this._apiKey = null;
  },

  hasKey() {
    return !!(this._apiKey && this._apiKey.length > 10);
  },

  setModel(model) {
    this._model = model;
    localStorage.setItem('psp_model', model);
  },

  // ===== CORE REQUEST =====
  async chat(messages, options = {}) {
    if (!this.hasKey()) {
      throw new Error('NO_KEY');
    }

    const body = {
      model: options.model || this._model,
      messages,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature ?? 0.8,
      stream: false
    };

    let lastError = null;

    for (const endpoint of this.ENDPOINTS) {
      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this._apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'PsychoSupervisorPro'
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000) // 30s timeout
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          if (resp.status === 401) throw new Error('INVALID_KEY');
          if (resp.status === 429) throw new Error('RATE_LIMIT');
          if (resp.status === 402) throw new Error('NO_CREDITS');
          throw new Error(err.error?.message || `HTTP ${resp.status}`);
        }

        const data = await resp.json();
        this._requestCount++;
        return data.choices?.[0]?.message?.content || '';

      } catch (e) {
        lastError = e;
        if (e.message === 'INVALID_KEY' || e.message === 'NO_CREDITS') throw e;
        // Try next endpoint on network error
        continue;
      }
    }

    throw lastError || new Error('ALL_ENDPOINTS_FAILED');
  },

  // ===== CLIENT RESPONSE GENERATOR =====
  async generateClientResponse(client, sessionMessages, studentMessage, sessionState) {
    const systemPrompt = this._buildClientSystemPrompt(client, sessionState);

    // Build conversation history (last 10 exchanges)
    const history = sessionMessages.slice(-20).map(m => ({
      role: m.role === 'student' ? 'user' : m.role === 'client' ? 'assistant' : null,
      content: m.text
    })).filter(m => m.role !== null);

    history.push({ role: 'user', content: studentMessage });

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history
    ];

    try {
      const response = await this.chat(messages, {
        maxTokens: 350,
        temperature: 0.85
      });
      let text = response.trim();
      // Если обрезало на полуслове — дописываем многоточие
      if (text && !text.match(/[.!?…)"'\u2019\u201d\n]$/)) {
        // Обрезаем до последней точки/восклицания/вопроса
        const lastPunct = Math.max(
          text.lastIndexOf('.'),
          text.lastIndexOf('!'),
          text.lastIndexOf('?'),
          text.lastIndexOf('…')
        );
        if (lastPunct > text.length * 0.5) {
          text = text.substring(0, lastPunct + 1);
        } else {
          text = text + '...';
        }
      }
      return text;
    } catch (e) {
      return null;
    }
  },

  _buildClientSystemPrompt(client, sessionState) {
    const trustPct = sessionState.trust || client.trust;
    const anxietyPct = sessionState.anxiety || client.anxiety;
    const opennessPct = sessionState.openness || client.openness;

    return `Ты играешь роль клиента на психологической консультации. Веди себя СТРОГО по роли, не выходи из неё.

ПРОФИЛЬ КЛИЕНТА:
- Имя: ${client.name}, ${client.age}
- Проблема: ${client.type}
- Запрос: ${client.request}
- История: ${client.history}
- Черты личности: ${client.traits.join(', ')}

ТЕКУЩЕЕ СОСТОЯНИЕ (0-100):
- Тревога: ${anxietyPct}% ${anxietyPct > 70 ? '(очень высокая, заметна в речи)' : anxietyPct > 40 ? '(умеренная)' : '(низкая)'}
- Доверие к психологу: ${trustPct}% ${trustPct < 30 ? '(низкое — защищаешься, закрыт)' : trustPct < 60 ? '(среднее — осторожен)' : '(высокое — более открыт)'}
- Открытость: ${opennessPct}%

ПРАВИЛА ПОВЕДЕНИЯ:
1. Отвечай ТОЛЬКО от имени клиента. Никаких комментариев, объяснений "как клиент".
2. 2-4 предложения. ОБЯЗАТЕЛЬНО заканчивай мысль до последней точки. Не обрывайся на полуслове.
3. Учитывай уровень доверия: при низком — защищаешься, при высоком — раскрываешься.
4. При директивных советах психолога — сопротивляйся естественно.
5. Периодически добавляй паузы: "...", "(молчит)", "(вздыхает)".
6. Говори разговорным русским языком. Никакого книжного стиля.
7. Не будь слишком позитивным — настоящие клиенты сопротивляются изменениям.
8. Иногда уходи от темы, меняй предмет разговора — это реалистично.
9. КРИТИЧНО: всегда заканчивай мысль до конца! Не обрывайся на полуслове. Каждое предложение должно быть завершённым.

Отвечай только репликой клиента, без кавычек и пояснений.`;
  },

  // ===== SUPERVISOR HINT GENERATOR =====
  async generateSupervisorHint(client, sessionMessages, studentMessage, sessionState) {
    const systemPrompt = this._buildSupervisorSystemPrompt(client, sessionState, 'hint');

    const lastExchanges = sessionMessages.slice(-8).map(m => {
      const role = m.role === 'student' ? 'Психолог' : m.role === 'client' ? 'Клиент' : 'Система';
      return `${role}: ${m.text}`;
    }).join('\n');

    const userMsg = `Последний обмен репликами:\n${lastExchanges}\n\nПсихолог только что написал: "${studentMessage}"\n\nДай КРАТКУЮ подсказку (1-2 предложения) что сейчас важно.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMsg }
      ], { maxTokens: 120, temperature: 0.7 });
      return '💡 ' + response.trim();
    } catch (e) {
      return null;
    }
  },

  // ===== SUPERVISOR DIRECT ADVICE =====
  async generateSupervisorAdvice(client, sessionMessages, question, sessionState) {
    const systemPrompt = this._buildSupervisorSystemPrompt(client, sessionState, 'advice');

    const context = sessionMessages.slice(-12).map(m => {
      const role = m.role === 'student' ? 'Психолог' : m.role === 'client' ? 'Клиент' : null;
      return role ? `${role}: ${m.text}` : null;
    }).filter(Boolean).join('\n');

    const userMsg = question
      ? `Контекст сессии:\n${context}\n\nВопрос студента: "${question}"`
      : `Контекст сессии:\n${context}\n\nДай рекомендацию по текущей ситуации в сессии.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMsg }
      ], { maxTokens: 300, temperature: 0.7 });
      return response.trim();
    } catch (e) {
      return null;
    }
  },

  // ===== SESSION ANALYSIS =====
  async analyzeSessionFull(client, sessionMessages, sessionState) {
    const systemPrompt = `Ты опытный супервизор-психолог с 20+ лет практики. Пишешь разбор сессии КАК ЖИВОЙ ЧЕЛОВЕК — прямо, конкретно, с цитатами из диалога. Не как робот с шаблонами, а как наставник который реально читал каждую реплику и заметил детали. Сочетаешь КПТ, МИ, DBT, ACT и духовное измерение.`;

    const transcript = sessionMessages
      .filter(m => m.role !== 'system')
      .map(m => {
        if (m.role === 'client') return `КЛИЕНТ: ${m.text}`;
        if (m.role === 'student') return `ПСИХОЛОГ: ${m.text}`;
        return null;
      }).filter(Boolean).join('\n');

    const clientInfo = `Клиент: ${client.name}, ${client.age}. Тип: ${client.type}. Запрос: ${client.request}.`;

    const prompt = `${clientInfo}

ТРАНСКРИПТ СЕССИИ:
${transcript}

Напиши детальный супервизорский разбор в JSON:
{
  "score": число 0-100,
  "summary": "3-4 предложения — кто этот клиент, что происходило в сессии, куда движется работа",
  "worked": "Подробно (4-6 предложений) ЧТО СРАБОТАЛО — с конкретными цитатами из диалога ('когда ты сказал ... — клиент открылся потому что...')",
  "missed": "Подробно (4-6 предложений) ЧТО УПУСТИЛ — конкретные моменты с цитатами, почему это важно, что за этим стоит психологически",
  "errors": [{"title": "название ошибки", "text": "подробное объяснение с цитатой из диалога", "suggestion": "конкретная альтернативная фраза которую можно было сказать"}],
  "strengths": ["конкретная сильная сторона с примером из диалога"],
  "keyMoments": [{"label": "название момента", "text": "что произошло и почему это важно психологически"}],
  "clientProfile": "2-3 предложения — психологический портрет клиента: защиты, паттерны, мотивация",
  "nextSession": "Конкретный план следующей встречи: с чего начать, какую тему не отпускать, что исследовать",
  "recommendations": ["конкретная рекомендация студенту для роста"]
}
Только JSON. Пиши развёрнуто, цитируй реплики, будь конкретным.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], { maxTokens: 800, temperature: 0.6, model: 'anthropic/claude-3-haiku' });

      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // ===== TRANSCRIPT ANALYSIS =====
  async analyzeTranscriptAI(text, context) {
    const systemPrompt = `Ты супервизор-психолог с 20+ лет опыта. Читаешь транскрипт как живой человек — замечаешь детали, цитируешь конкретные фразы, пишешь развёрнуто и честно. Не шаблонные советы, а реальный разбор конкретной сессии. Интегрируешь КПТ, МИ, DBT, ACT, гуманистический и духовный подход.`;

    const prompt = `Контекст: ${context || 'Не указан'}

ТРАНСКРИПТ (может быть в любом формате — диалог, заметки, свободный текст):
${text}

Напиши полный супервизорский разбор в JSON:
{
  "overallScore": число 0-100,
  "sessionDynamics": "4-5 предложений — динамика сессии, кто этот клиент, что происходило, куда движется работа",
  "worked": "ЧТО СРАБОТАЛО (4-6 предложений) — конкретные удачные моменты с цитатами из диалога и объяснением почему это было правильно",
  "missed": "ЧТО УПУСТИЛ (4-6 предложений) — конкретные пропущенные моменты с цитатами, что за ними стоит, почему важно было не пройти мимо",
  "errors": [{"title": "название ошибки", "text": "подробное объяснение с цитатой из транскрипта", "alternative": "конкретная фраза-замена которую можно было сказать", "severity": "high/medium/critical"}],
  "strengths": ["конкретная сильная сторона с примером из транскрипта"],
  "dynamics": ["конкретное наблюдение о динамике с цитатой"],
  "standoutMoments": [{"type": "good/concern", "label": "название момента", "text": "подробное объяснение что произошло и почему важно"}],
  "clientProfile": "психологический портрет клиента: защитные механизмы, паттерны, мотивация к изменениям",
  "nextSession": "конкретный план следующей сессии: с чего начать, что исследовать, какую тему не отпускать",
  "recommendations": ["конкретная рекомендация для роста студента"],
  "nextStep": "самый важный один шаг который нужно сделать прямо сейчас"
}
Только JSON. Пиши развёрнуто, цитируй реплики из транскрипта, будь конкретным как живой супервизор.`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], { maxTokens: 1000, temperature: 0.6, model: 'anthropic/claude-3-haiku' });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return null;
    } catch (e) {
      return null;
    }
  },

  // ===== SYSTEM PROMPT FOR SUPERVISOR =====
  _buildSupervisorSystemPrompt(client, sessionState, mode) {
    const trust = sessionState.trust || client.trust;
    const anxiety = sessionState.anxiety || client.anxiety;
    const phase = sessionState.phase || 'contact';

    const phaseLabels = {
      contact: 'установление контакта',
      exploration: 'исследование проблемы',
      insight: 'формирование инсайта',
      change: 'работа с изменением'
    };

    const base = `Ты опытный супервизор-психолог для студентов. Твой стиль: прямой, конкретный, поддерживающий. Ты сочетаешь КПТ, МИ, DBT, ACT, гуманистический подход и библейскую мудрость (специализация ведущего).

ТЕКУЩИЙ КЛИЕНТ: ${client.name}, ${client.age}
Тип: ${client.type}
Запрос: ${client.request}
История: ${client.history}

СОСТОЯНИЕ СЕССИИ:
- Фаза: ${phaseLabels[phase] || phase}
- Доверие клиента: ${trust}%
- Тревога клиента: ${anxiety}%
- Категория: ${ClientsDB?.categoryLabel(client.category) || client.category}`;

    if (mode === 'hint') {
      return base + `\n\nДАВАЙ ТОЛЬКО КРАТКИЕ ПОДСКАЗКИ (1-2 предложения). Конкретные, практичные. Не читай лекции. Начинай с 💡`;
    }

    return base + `\n\nДАВАЙ КОНКРЕТНЫЕ, ПРИМЕНИМЫЕ СОВЕТЫ. Укажи технику, фразу или вопрос который можно использовать прямо сейчас. 3-5 предложений максимум.`;
  },

  // ===== AUDIO TRANSCRIPTION (Whisper via OpenRouter) =====
  async transcribeAudio(audioFile) {
    // Note: OpenRouter doesn't support Whisper directly
    // We simulate transcription for now and note this limitation
    // For real transcription: use AssemblyAI or Deepgram (both work in Russia)
    throw new Error('WHISPER_NOT_SUPPORTED');
  },

  // ===== CONNECTION TEST =====
  async testConnection() {
    try {
      const result = await this.chat([
        { role: 'user', content: 'Ответь одним словом: "Работает"' }
      ], { maxTokens: 10, temperature: 0 });
      return { ok: true, response: result };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  // ===== ERROR MESSAGES =====
  getErrorMessage(code) {
    const messages = {
      'NO_KEY': 'Введите API-ключ OpenRouter для активации AI-функций',
      'INVALID_KEY': 'Неверный API-ключ. Проверьте ключ на openrouter.ai',
      'RATE_LIMIT': 'Превышен лимит запросов. Подождите минуту.',
      'NO_CREDITS': 'Закончились кредиты OpenRouter. Пополните баланс на openrouter.ai',
      'ALL_ENDPOINTS_FAILED': 'Не удалось подключиться. Проверьте интернет.',
      'WHISPER_NOT_SUPPORTED': 'Транскрипция аудио: вставьте текст транскрипта вручную'
    };
    return messages[code] || code;
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => AIEngine.init());
