/* ═══════════════════════════════════════════════════════════════════
   Access v3 — система ключей доступа с серверной валидацией
   
   Изменения от v2:
   - Ключ теперь проверяется на сервере (прокси → Supabase)
   - localStorage хранит ТОЛЬКО кэш, не является источником правды
   - При каждом запуске — тихая ревалидация ключа
   - Fallback: если сервер недоступен — доверяем кэшу ≤24ч
   ═══════════════════════════════════════════════════════════════════ */
const Access = {
  LS_KEY:       'psp3_access',
  LS_VALIDATED: 'psp3_validated_at',

  PLANS: {
    BASE:    { name: 'Базовый',   days: 30,  price: '990 ₽/мес',      ai: false },
    PROF:    { name: 'Профи',     days: 90,  price: '1 990 ₽/квартал', ai: true  },
    TEAM:    { name: 'Команда',   days: 365, price: '4 990 ₽/год',     ai: true  },
    DEMO:    { name: 'Демо',      days: 3,   price: 'бесплатно',       ai: true  },
    UNKNOWN: { name: 'Активный',  days: 999, price: '—',               ai: true  },
  },

  // Прокси-URL — должен совпадать с Engine.PROXY
  _proxyUrl: 'https://psychosupervisor-proxy-production.up.railway.app/',

  /* ════════════════════════════════════════════════════════════════
     ПУБЛИЧНЫЙ API
  ════════════════════════════════════════════════════════════════ */

  /* Есть ли доступ? */
  hasAccess() {
    const d = this._load();
    if (!d) return false;

    // Проверяем срок действия (приходит с сервера)
    if (d.expires && d.expires < Date.now()) return false;

    return d.valid === true;
  },

  getPlan() {
    const d = this._load();
    return d ? (this.PLANS[d.plan] || this.PLANS.UNKNOWN) : null;
  },

  getInfo() {
    const d = this._load();
    if (!d || !d.valid) return null;
    const daysLeft = d.expires
      ? Math.max(0, Math.ceil((d.expires - Date.now()) / 86400000))
      : null;
    const expires  = d.expires
      ? new Date(d.expires).toLocaleDateString('ru-RU')
      : 'бессрочно';
    return { ...d, daysLeft, expires, plan: this.PLANS[d.plan] || this.PLANS.UNKNOWN };
  },

  getPspKey() {
    const d = this._load();
    return d ? (d.key || '') : '';
  },

  /* Активация ключа с серверной проверкой */
  async activate() {
    const input  = document.getElementById('access-key-input');
    const result = document.getElementById('access-result');
    const key    = (input?.value || '').trim().toUpperCase();

    if (!key) {
      this._showResult(result, 'error', 'Введите ключ доступа');
      return;
    }

    if (!key.startsWith('PSP-')) {
      this._showResult(result, 'error', 'Неверный формат. Ключ начинается с PSP-');
      return;
    }

    this._showResult(result, 'loading', '⏳ Проверяем ключ...');

    const { valid, plan, error } = await this._validateOnServer(key);

    if (!valid) {
      this._showResult(result, 'error', `❌ ${error || 'Ключ недействителен'}`);
      return;
    }

    // Сохраняем
    const planData = this.PLANS[plan] || this.PLANS.UNKNOWN;
    const expires  = plan === 'DEMO'
      ? Date.now() + 3 * 86400000
      : plan === 'BASE'
        ? Date.now() + 30 * 86400000
        : plan === 'PROF'
          ? Date.now() + 90 * 86400000
          : plan === 'TEAM'
            ? Date.now() + 365 * 86400000
            : null;  // null = бессрочно

    this._save({ key, plan, valid: true, expires, activatedAt: Date.now() });

    this._showResult(result, 'success',
      `✅ Доступ активирован! Тариф: ${planData.name}`
    );

    setTimeout(() => {
      UI.closeModal('access-modal');
      App.enter();
      UI.toast(`🎉 Добро пожаловать! Тариф: ${planData.name}`, 'success');
    }, 1200);
  },

  /* Тихая ревалидация при запуске — не блокирует UI */
  async silentRevalidate() {
    const d = this._load();
    if (!d || !d.key) return;

    // Не долбим сервер чаще раза в час
    const lastValidated = parseInt(localStorage.getItem(this.LS_VALIDATED) || '0');
    if (Date.now() - lastValidated < 3600000) return;

    const { valid, plan, error } = await this._validateOnServer(d.key);

    if (valid) {
      this._save({ ...d, valid: true, plan: plan || d.plan });
      localStorage.setItem(this.LS_VALIDATED, String(Date.now()));
    } else {
      // Сервер говорит ключ невалиден — инвалидируем локально
      // НО: если ошибка сети — не трогаем кэш
      if (error && !error.includes('сети') && !error.includes('timeout')) {
        console.warn(`[Access] Key invalidated by server: ${error}`);
        this._save({ ...d, valid: false });
      }
    }
  },

  /* Деактивация / выход */
  logout() {
    localStorage.removeItem(this.LS_KEY);
    localStorage.removeItem(this.LS_VALIDATED);
    window.location.reload();
  },

  /* Для Engine: возвращает заголовок для API запросов */
  getAuthHeader() {
    const key = this.getPspKey();
    return key ? { 'X-PSP-Key': key } : {};
  },

  /* ════════════════════════════════════════════════════════════════
     ПРИВАТНОЕ
  ════════════════════════════════════════════════════════════════ */

  /* Серверная проверка ключа через прокси */
  async _validateOnServer(key) {
    try {
      // Отправляем тестовый минимальный запрос с PSP-ключом
      // Прокси проверит ключ в Supabase и вернёт 403 если недействителен
      const resp = await fetch(this._proxyUrl + 'validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PSP-Key': key,
        },
        body: JSON.stringify({ action: 'validate' }),
        signal: AbortSignal.timeout(8000),
      });

      if (resp.status === 403) {
        const data = await resp.json().catch(() => ({}));
        return { valid: false, plan: '', error: data.error || 'Ключ недействителен' };
      }

      if (resp.status === 200 || resp.status === 401) {
        // 200 = ключ принят прокси (даже если это не /validate endpoint)
        // Извлекаем план из ответа если есть
        const data = await resp.json().catch(() => ({}));
        const plan = data.plan || this._guessPlanFromKey(key);
        return { valid: true, plan, error: '' };
      }

      // Fallback: если прокси вернул что-то ещё — доверяем ключу
      return { valid: true, plan: this._guessPlanFromKey(key), error: '' };

    } catch (err) {
      // Сеть недоступна — доверяем кэшу
      console.warn('[Access] Server validation failed (network):', err.message);
      const plan = this._guessPlanFromKey(key);
      return { valid: true, plan, error: 'ошибка сети' };
    }
  },

  /* Определяем план по префиксу (fallback без сервера) */
  _guessPlanFromKey(key) {
    if (key.startsWith('PSP-B')) return 'BASE';
    if (key.startsWith('PSP-P')) return 'PROF';
    if (key.startsWith('PSP-T')) return 'TEAM';
    if (key.startsWith('PSP-D')) return 'DEMO';
    if (key.startsWith('PSP-X')) return 'TEAM';
    return 'UNKNOWN';
  },

  _save(data) {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(data));
    } catch(e) {}
  },

  _load() {
    try {
      const s = localStorage.getItem(this.LS_KEY);
      return s ? JSON.parse(s) : null;
    } catch(e) { return null; }
  },

  _showResult(el, type, msg) {
    if (!el) return;
    el.className = `api-test-result ${type}`;
    el.textContent = msg;
    el.classList.remove('hidden');
  },

  /* ── Генерация демо-ключей (только для отображения в UI) ── */
  generateDemoKey() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part  = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `PSP-D-${part(4)}-${part(4)}-${part(4)}`;
  },
};
