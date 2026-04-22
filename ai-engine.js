/* ═══════════════════════════════════════════════════════════════════
   Engine v3 — AI-запросы через Railway proxy с PSP-аутентификацией
   
   Изменения:
   - Передаём X-PSP-Key (ключ подписки) в каждый запрос к прокси
   - Прокси валидирует ключ в Supabase перед форвардингом
   - X-Client-Key (Anthropic key) — по-прежнему поддерживается
   ═══════════════════════════════════════════════════════════════════ */
const Engine = {

  PROXY:    'https://psychosupervisor-proxy-production.up.railway.app/',
  LS_KEY:   'psp2_anthropic_key',

  MODELS: {
    supervisor: 'claude-sonnet-4-20250514',
    client:     'claude-haiku-4-20250514',
    fast:       'claude-haiku-4-20250514',
    vision:     'claude-sonnet-4-20250514',
  },

  ALL_MODELS: [
    'claude-sonnet-4-20250514',
    'claude-haiku-4-20250514',
    'claude-3-7-sonnet-20250219',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
  ],

  _working:    null,
  _proxyKeyOk: null,

  init() {
    const hasKey = this.hasClientKey();
    const hasPsp = typeof Access !== 'undefined' && Access.getPspKey();
    console.log(`[Engine] init | clientKey=${hasKey} | pspKey=${!!hasPsp} | proxy=${this.PROXY}`);
    setTimeout(() => this._pingProxy(), 3000);
    // Тихая ревалидация PSP-ключа
    if (typeof Access !== 'undefined') {
      setTimeout(() => Access.silentRevalidate(), 5000);
    }
    return this;
  },

  getKey()      { try { return localStorage.getItem(this.LS_KEY) || ''; } catch(e) { return ''; } },
  saveKey(k)    { try { localStorage.setItem(this.LS_KEY, (k||'').trim()); } catch(e) {} },
  clearKey()    { try { localStorage.removeItem(this.LS_KEY); } catch(e) {} },
  hasClientKey(){ return this.getKey().length > 20; },

  isReady() {
    if (this.hasClientKey()) return true;
    if (typeof Access !== 'undefined' && Access.hasAccess()) return true;
    return this._proxyKeyOk !== false;
  },

  async _pingProxy() {
    try {
      const r = await fetch(this.PROXY, { signal: AbortSignal.timeout(4000) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) {
        this._proxyKeyOk = d.key_set !== false;
        console.log(`[Engine] ✅ proxy OK | supabase=${d.supabase} key_set=${d.key_set}`);
      } else {
        this._proxyKeyOk = false;
      }
    } catch(e) {
      console.warn('[Engine] proxy ping failed:', e.message);
      this._proxyKeyOk = false;
    }
    UI && UI.updateAIStatus && UI.updateAIStatus();
  },

  /* ════════════════════════════════════════════════════════════════
     БАЗОВЫЙ CHAT — теперь передаёт X-PSP-Key
  ════════════════════════════════════════════════════════════════ */
  async chat(system, messages, opts = {}) {
    const preferred = opts.model || this._working || this.MODELS.supervisor;
    const models    = [preferred, ...this.ALL_MODELS.filter(m => m !== preferred)];
    const uniq      = [...new Set(models)];

    const msgs = (messages || [])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content || m.text || '' }));
    if (!msgs.length || msgs[msgs.length-1].role !== 'user') {
      msgs.push({ role: 'user', content: 'Продолжай.' });
    }

    for (const model of uniq) {
      try {
        const result = await this._request(system, msgs, model, opts.maxTokens || 1000);
        this._working = model;
        return result;
      } catch(err) {
        const code = err.code || 0;
        // 403 = PSP-ключ невалиден — не пробуем другие модели, сразу кидаем
        if (code === 403) throw err;
        // 5xx — пробуем следующую модель
        if (code >= 500 || err.message?.includes('overloaded')) continue;
        throw err;
      }
    }
    throw new Error('Все модели недоступны. Попробуйте позже.');
  },

  async _request(system, messages, model, maxTokens) {
    const body = {
      model,
      max_tokens: maxTokens,
      system,
      messages,
    };

    // Заголовки аутентификации
    const headers = { 'Content-Type': 'application/json' };

    // 1. Клиентский Anthropic-ключ (приоритет)
    if (this.hasClientKey()) {
      headers['X-Client-Key'] = this.getKey();
    }
    // 2. PSP-ключ подписки (для серверного ключа прокси)
    else if (typeof Access !== 'undefined' && Access.getPspKey()) {
      headers['X-PSP-Key'] = Access.getPspKey();
    }

    const resp = await fetch(this.PROXY, {
      method:  'POST',
      headers,
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(90000),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));

      // Специальная обработка ошибки PSP-ключа
      if (resp.status === 403) {
        const e = new Error(err.error || 'Ключ доступа недействителен');
        e.code = 403;
        e.pspError = true;
        // Показываем модал повторной активации
        UI && UI.showAccessExpired && UI.showAccessExpired(err.error);
        throw e;
      }

      if (resp.status === 401) {
        const e = new Error('Требуется ключ доступа PSP');
        e.code = 401;
        throw e;
      }

      const e = new Error(err.error?.message || err.error || `HTTP ${resp.status}`);
      e.code = resp.status;
      throw e;
    }

    const data = await resp.json();
    const text = data.content
      ?.filter(b => b.type === 'text')
      ?.map(b => b.text)
      ?.join('') || '';

    if (!text) throw new Error('Пустой ответ от AI');
    return text;
  },

  /* Vision — для арт-терапии */
  async vision(system, imageBase64, mediaType, textPrompt, opts = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.hasClientKey()) {
      headers['X-Client-Key'] = this.getKey();
    } else if (typeof Access !== 'undefined' && Access.getPspKey()) {
      headers['X-PSP-Key'] = Access.getPspKey();
    }

    const body = {
      model:      opts.model || this.MODELS.vision,
      max_tokens: opts.maxTokens || 1500,
      system,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: textPrompt },
        ],
      }],
    };

    const resp = await fetch(this.PROXY, {
      method:  'POST',
      headers,
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(120000),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
      if (resp.status === 403) {
        UI && UI.showAccessExpired && UI.showAccessExpired(err.error);
        throw new Error('Ключ доступа недействителен');
      }
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    return data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
  },

  /* Форматирование ошибок для UI */
  errMsg(msg) {
    if (!msg) return 'Ошибка AI';
    if (msg.includes('403') || msg.includes('PSP') || msg.includes('ключ')) {
      return '🔑 Ключ доступа истёк. Проверьте подписку.';
    }
    if (msg.includes('401')) return '🔑 Требуется ключ доступа';
    if (msg.includes('overloaded') || msg.includes('529')) return '⏳ AI перегружен, повторите через минуту';
    if (msg.includes('timeout') || msg.includes('AbortError')) return '⏱ Таймаут — попробуйте ещё раз';
    if (msg.includes('rate') || msg.includes('429')) return '⚠️ Слишком много запросов, подождите';
    return `AI: ${msg.slice(0, 80)}`;
  },
};
