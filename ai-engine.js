/* ============================================
   PsychoSupervisor Pro — AI Supervisor Engine
   Real-time hints, session analysis, transcript analysis
   ============================================ */

const Supervisor = {

  // ===== REAL-TIME HINT ENGINE =====
  getHint(client, sessionState, studentMessage, messageCount) {
    const msg = (studentMessage || '').toLowerCase();
    const trust = sessionState.trust || client.trust;
    const anxiety = sessionState.anxiety || client.anxiety;
    const phase = sessionState.phase || 'contact';

    // Check for critical patterns first
    const critical = this._checkCritical(msg, client, sessionState);
    if (critical) return { type: 'critical', text: critical };

    // Technique recommendations
    const techHint = this._recommendTechnique(client, phase, msg, messageCount, trust, anxiety);
    if (techHint) return { type: 'tip', text: techHint };

    return null;
  },

  _checkCritical(msg, client, sessionState) {
    // Too short responses
    if (msg.length < 10 && msg.length > 0) {
      return '⚠️ Слишком короткий ответ. Клиент может почувствовать отсутствие интереса. Попробуйте развернуть мысль.';
    }
    // Direct advice giving
    if (/(вам нужно|вам следует|попробуйте просто|надо просто|вы должны)/.test(msg)) {
      return '🚨 Вы даёте прямой совет. Убедитесь, что клиент сначала почувствовал себя услышанным. Иначе совет = нападение.';
    }
    // Arguing with resistance
    if (/(нет, но|это неправда|вы ошибаетесь|на самом деле вы)/.test(msg)) {
      return '⚠️ Вы спорите с клиентом. Это усиливает сопротивление. Попробуйте: "Интересно, расскажите больше об этом."';
    }
    // Premature interpretation
    if (/(вы на самом деле|в глубине|я думаю вы чувствуете)/.test(msg)) {
      return '⚠️ Интерпретация без запроса клиента может восприниматься как вторжение. Превратите её в вопрос.';
    }
    return null;
  },

  _recommendTechnique(client, phase, msg, messageCount, trust, anxiety) {
    const cat = client.category;

    // Early sessions — contact focus
    if (messageCount <= 2) {
      return '💡 Начало: приоритет — безопасность и контакт. Используйте открытые вопросы и отражение. Не спешите к проблеме.';
    }

    // High anxiety client
    if (anxiety > 75) {
      if (!msg.includes('дыхан') && !msg.includes('здесь') && !msg.includes('сейчас')) {
        return '💡 Тревога клиента высокая. Рассмотрите технику заземления или замедленного дыхания прежде чем продолжать.';
      }
    }

    // Low trust
    if (trust < 30) {
      return '💡 Уровень доверия низкий. Фокус на валидации: "То что вы рассказываете — это важно. Спасибо что доверяете."';
    }

    // Category-specific hints
    const catHints = {
      addiction: [
        '💡 Зависимость: исследуйте функцию вещества — что оно даёт клиенту? Замените вопрос "почему пьёте?" на "что это вам даёт?"',
        '💡 Техника МИ: спросите по шкале 1-10 насколько клиент хочет измениться. Потом: "Почему не ноль?"',
        '💡 Амбивалентность — нормальна. Не давите. Двустороннее отражение: "С одной стороны... с другой стороны..."'
      ],
      anxiety: [
        '💡 При тревоге: помогите клиенту отличить мысль от факта. "Вы думаете или знаете наверняка?"',
        '💡 Психоедукация: объясните цикл тревоги — авоиданс усиливает её. Без лекции, через вопросы.',
        '💡 Сократический вопрос: "Что самое худшее может случиться? А насколько это вероятно?"'
      ],
      depression: [
        '💡 При депрессии: поведенческая активация важнее инсайтов. Спросите: "Что вы делали, когда было лучше?"',
        '💡 Берегитесь преждевременного оптимизма — он обесценивает боль. Сначала присутствие в боли.',
        '💡 Исследуйте смысл: "Что сейчас даёт вам хоть какую-то опору?"'
      ],
      trauma: [
        '💡 При травме: не форсируйте нарратив. Спросите: "Готовы ли вы говорить об этом сейчас?"',
        '💡 Заземление важнее рассказа. Если видите признаки диссоциации — остановитесь.',
        '💡 Нормализация: "То, что вы чувствуете — это нормальная реакция на ненормальные события."'
      ],
      personality: [
        '💡 ПРЛ: валидация в первую очередь. Не оспаривайте чувства — даже если поведение проблематично.',
        '💡 Предсказуемость и ясные границы снижают страх оставления. Будьте консистентны.',
        '💡 Нарциссизм: ищите уязвимость за грандиозностью. "Как это на самом деле для вас?"'
      ],
      spiritual: [
        '💡 Духовный кризис: не спешите "исправлять" богословие. Дайте место гневу и вопросам.',
        '💡 Иов — полезный образ: "Бог выдержал гнев Иова. Ваш гнев — не грех."',
        '💡 Различайте духовность и религиозность клиента. Где его личный опыт Бога?'
      ],
      relationship: [
        '💡 Созависимость: не работайте с "проблемным партнёром" — работайте с клиентом. "Что вы хотите для себя?"',
        '💡 Спросите о границах: "Как вы узнаёте когда вам некомфортно? Что вы делаете с этим?"'
      ]
    };

    const hints = catHints[cat] || [];
    if (hints.length) {
      return hints[Math.floor(Math.random() * hints.length)];
    }

    // General tips
    const general = [
      '💡 Хорошее открытое завершение: "Расскажите мне больше об этом..."',
      '💡 Проверьте понимание: "Правильно ли я понял что..."',
      '💡 Отражение эмоции: назовите то что слышите между строк.',
      '💡 Пауза — это инструмент. Иногда молчание говорит больше слов.',
      '💡 Где тело? "Когда вы говорите об этом, что вы ощущаете физически?"'
    ];
    return general[Math.floor(Math.random() * general.length)];
  },

  // ===== SUPERVISOR DIRECT RESPONSE =====
  getSupervisorResponse(client, sessionState, question) {
    const q = (question || '').toLowerCase();
    const phase = sessionState.phase || 'contact';
    const trust = sessionState.trust || client.trust;
    const anxiety = sessionState.anxiety || client.anxiety;

    // Contextualized advice
    if (q.includes('как') && q.includes('начать')) {
      return this._advice_start(client);
    }
    if (q.includes('молчит') || q.includes('пауза') || q.includes('ничего не говорит')) {
      return `Пауза — это тоже коммуникация. Скажите: "Я замечаю, что вам сейчас трудно говорить. Это нормально. Мы можем молчать." Не торопитесь заполнить тишину — это ваша тревога, не его проблема.`;
    }
    if (q.includes('злит') || q.includes('агресси')) {
      return `${client.name} проявляет агрессию — это защита. Не защищайтесь в ответ. Попробуйте: "Я вижу, что это вас задевает. Это важно — расскажите что происходит." Валидируйте злость как законную реакцию.`;
    }
    if (q.includes('плач') || q.includes('слёзы')) {
      return `Слёзы — это хорошо. Клиент доверяет. Не торопитесь с "успокойтесь". Просто будьте рядом: "Я здесь. Можете плакать." Тишина и присутствие сейчас важнее слов.`;
    }
    if (q.includes('суицид') || q.includes('хочет умереть') || q.includes('нет смысла жить')) {
      return `⚠️ ВАЖНО: Спросите прямо и спокойно: "Когда вы говорите что нет смысла — у вас бывают мысли о том, чтобы не жить?" Прямой вопрос снижает риск. Оцените: есть ли план, намерение, средства. Если риск высокий — создайте план безопасности.`;
    }
    if (q.includes('сопротивля') || q.includes('не хочет')) {
      return `Сопротивление = сигнал. Не боритесь с ним. Скажите: "Я слышу что сейчас говорить об этом тяжело. Что было бы важнее обсудить?" Откатитесь назад, снизьте давление, восстановите контакт.`;
    }
    if (q.includes('что делать') || q.includes('как помочь') || q.includes('застряли')) {
      return this._advice_phase(client, phase, trust, anxiety);
    }

    // Default contextual advice
    return this._advice_phase(client, phase, trust, anxiety);
  },

  _advice_start(client) {
    const cat = client.category;
    const starters = {
      addiction: `Начните с нейтрального, неосуждающего вопроса: "Расскажите, что привело вас сюда сегодня?" Не упоминайте зависимость первым. Пусть клиент сам назовёт проблему — это повышает его автономию.`,
      anxiety: `Начните с валидации прихода: "Я знаю, что прийти сюда не легко. Расскажите, что происходит." Дайте пространство — тревожные клиенты иногда говорят много сразу. Слушайте активно.`,
      depression: `Начните мягко: "Что привело вас сюда? Расскажите что происходит в последнее время." Не торопитесь — депрессивные клиенты думают медленнее. Пауза — не тревога.`,
      trauma: `Начните с установления безопасности: "Прежде чем мы начнём, я хочу вам сказать: здесь вы можете говорить всё что хотите, и в том темпе, который вам подходит." Контроль клиента — приоритет.`,
      default: `Начните с открытого вопроса: "Что привело вас ко мне?" Дайте пространство. Первые минуты — наблюдение и контакт, не диагностика.`
    };
    return starters[cat] || starters.default;
  },

  _advice_phase(client, phase, trust, anxiety) {
    if (trust < 25) {
      return `Уровень доверия низкий — это главный приоритет. Фокус: присутствие, тепло, валидация. Не двигайтесь вглубь пока контакт не установлен. Попробуйте: "Мне важно понять вас правильно. Расскажите больше о..."`;
    }
    if (anxiety > 80) {
      return `Тревога ${client.name} очень высокая. Рассмотрите сначала заземление: "Давайте остановимся. Назовите мне 5 вещей которые вы видите прямо сейчас." Работать с материалом при такой тревоге неэффективно.`;
    }
    const phaseAdvice = {
      contact: `Фаза контакта: задача — не решить проблему, а установить безопасные отношения. Слушайте больше чем говорите. Отражайте. Не анализируйте.`,
      exploration: `Фаза исследования: углубляйтесь в понимание. "Как это началось?", "Как вы с этим справляетесь?", "Как это влияет на вашу жизнь?" Избегайте "почему" — оно вызывает защиту.`,
      insight: `Фаза инсайта: помогайте клиенту самому делать связи. "Что вы замечаете?", "Что это напоминает?". Не давайте инсайт — создайте условия для него.`,
      change: `Фаза изменений: маленькие конкретные шаги лучше больших планов. "Что ONE вещь вы могли бы попробовать до следующей встречи?"`,
      default: `Сейчас важно просто быть рядом с клиентом в том, что он переживает. Ваше присутствие — уже терапия.`
    };
    return phaseAdvice[phase] || phaseAdvice.default;
  },

  // ===== SESSION PHASE DETECTION =====
  detectPhase(messageCount, trust, openness) {
    if (messageCount <= 3) return { phase: 'contact', label: 'Установление контакта' };
    if (trust < 40) return { phase: 'contact', label: 'Установление контакта' };
    if (messageCount <= 8 && trust < 60) return { phase: 'exploration', label: 'Исследование' };
    if (openness > 60 && trust > 50) return { phase: 'insight', label: 'Инсайт' };
    if (messageCount > 10 && trust > 60) return { phase: 'change', label: 'Работа с изменением' };
    return { phase: 'exploration', label: 'Исследование' };
  },

  // ===== DETECT RED FLAGS =====
  detectRedFlags(client, messages) {
    const flags = [];
    const allClientText = messages
      .filter(m => m.role === 'client')
      .map(m => m.text).join(' ').toLowerCase();

    const suicideKeywords = ['умереть', 'не жить', 'конец', 'смысла нет', 'исчезнуть', 'покончить', 'хочу умереть'];
    if (suicideKeywords.some(k => allClientText.includes(k))) {
      flags.push('⚠️ Суицидальные темы — оцените риск');
    }
    if (client.risk === 'high' || client.risk === 'moderate') {
      flags.push(`🔴 Клиент группы риска (${client.risk})`);
    }
    if (allClientText.includes('ударил') || allClientText.includes('бьёт') || allClientText.includes('насилие')) {
      flags.push('🚨 Упоминание насилия — протокол безопасности');
    }

    return flags;
  },

  // ===== SESSION SCORING =====
  scoreSession(messages, client, sessionState) {
    let score = 50; // baseline
    const studentMessages = messages.filter(m => m.role === 'student');

    studentMessages.forEach(msg => {
      const text = msg.text.toLowerCase();

      // Positive indicators
      if (/расскажите|расскажи/.test(text)) score += 3;
      if (/как вы себя|как вы чувствуете|что вы чувствуете/.test(text)) score += 5;
      if (/слышу вас|понимаю|спасибо что|важно/.test(text)) score += 4;
      if (/\?/.test(text) && text.length > 20) score += 2; // good question
      if (/правильно ли я понял|если я правильно/.test(text)) score += 6; // reflection
      if (/это звучит|кажется вы|я слышу/.test(text)) score += 4; // empathic reflection

      // Negative indicators
      if (/вам нужно|вы должны|надо просто|попробуйте просто/.test(text)) score -= 10;
      if (/другие же|все справляются|это ерунда/.test(text)) score -= 15;
      if (text.length < 10) score -= 5; // too short
      if (text.length > 300) score -= 3; // lecturing

      // Danger: ignoring risk
      if (client.risk && messages.filter(m => m.role === 'student').length > 5) {
        const mentioned_risk = studentMessages.some(m =>
          /расскажите об этом|мысли о том чтобы не жить|безопасность/.test(m.text.toLowerCase())
        );
        if (!mentioned_risk) score -= 15;
      }
    });

    // Bonus for trust growth
    const trustGrowth = (sessionState.trust || client.trust) - client.trust;
    score += Math.min(trustGrowth, 15);

    return Math.max(0, Math.min(100, Math.round(score)));
  },

  // ===== FULL SESSION ANALYSIS =====
  analyzeSession(messages, client, sessionState, finalScore) {
    const studentMessages = messages.filter(m => m.role === 'student');
    const allStudentText = studentMessages.map(m => m.text).join(' ').toLowerCase();

    const errors = this._findErrors(allStudentText, client, messages, sessionState);
    const strengths = this._findStrengths(allStudentText, client, messages);
    const recommendations = this._makeRecommendations(errors, client, finalScore);
    const xpGained = this._calcXP(finalScore, messages.length, client.difficulty);

    return {
      score: finalScore,
      errors,
      strengths,
      recommendations,
      xpGained,
      sessionSummary: this._sessionSummary(client, messages.length, finalScore, sessionState)
    };
  },

  _findErrors(allText, client, messages, sessionState) {
    const errors = [];

    if (/вам нужно|вы должны/.test(allText)) {
      errors.push({
        type: 'Директивность',
        title: '🚫 Директивные советы без запроса',
        text: 'Вы давали советы в форме "вам нужно" или "вы должны". Это создаёт сопротивление.',
        suggestion: 'Лучше: "Что, как вам кажется, могло бы помочь?" Вопрос вместо директивы.'
      });
    }

    if (messages.filter(m => m.role === 'student').some(m => m.text.length < 12)) {
      errors.push({
        type: 'Слишком короткие ответы',
        title: '⚠️ Слишком короткие реакции',
        text: 'Некоторые ваши ответы были очень краткими, что могло создать у клиента ощущение невнимания.',
        suggestion: 'Даже если нет готового ответа, скажите: "Расскажите мне больше об этом."'
      });
    }

    if (!/расскажите|как вы|что вы чувствуете|расскажи/.test(allText)) {
      errors.push({
        type: 'Мало открытых вопросов',
        title: '⚠️ Недостаточно открытых вопросов',
        text: 'Открытые вопросы приглашают клиента развернуть свой опыт. В этой сессии их было мало.',
        suggestion: 'Замените закрытые вопросы ("Вы злитесь?") на открытые ("Что вы чувствуете?").'
      });
    }

    if (client.risk && !/безопасност|мысли о|не жить/.test(allText)) {
      errors.push({
        type: 'Оценка риска',
        title: '🚨 Не оценён суицидальный риск',
        text: `У клиента ${client.name} есть маркеры риска, но вы не спросили напрямую о безопасности.`,
        suggestion: 'Всегда при депрессии и безнадёжности: "Бывают ли у вас мысли о том, чтобы не жить?"'
      });
    }

    if (sessionState.trust < 40) {
      errors.push({
        type: 'Слабый терапевтический альянс',
        title: '⚠️ Низкий уровень доверия',
        text: 'К концу сессии клиент не набрал достаточного уровня доверия. Это может указывать на недостаток тепла и валидации.',
        suggestion: 'Больше валидируйте: "То что вы говорите — это важно. Спасибо что доверяете."'
      });
    }

    return errors;
  },

  _findStrengths(allText, client, messages) {
    const strengths = [];

    if (/расскажите|расскажи/.test(allText)) {
      strengths.push('✅ Вы использовали открытые вопросы для углубления диалога');
    }
    if (/слышу|понимаю|спасибо что/.test(allText)) {
      strengths.push('✅ Вы проявляли эмпатию и валидировали клиента');
    }
    if (/правильно ли я|если я правильно|вы говорите/.test(allText)) {
      strengths.push('✅ Отличное перефразирование и проверка понимания');
    }
    if (messages.filter(m => m.role === 'student').length >= 6) {
      strengths.push('✅ Сессия была полноценной по длине');
    }
    if (/тело|физически|ощущаете/.test(allText)) {
      strengths.push('✅ Вы обращали внимание на телесный аспект — важный навык');
    }
    if (!/вам нужно|вы должны/.test(allText)) {
      strengths.push('✅ Вы не давали директивных советов — отличная работа!');
    }

    if (!strengths.length) {
      strengths.push('✅ Вы провели сессию до конца — это уже хорошая практика');
    }
    return strengths;
  },

  _makeRecommendations(errors, client, score) {
    const recs = [];

    if (score < 50) {
      recs.push('📚 Повторите технику активного слушания (база знаний → Активное слушание)');
    }
    if (errors.some(e => e.type === 'Директивность')) {
      recs.push('📚 Изучите Мотивационное интервью — особенно работу с амбивалентностью');
    }
    if (errors.some(e => e.type === 'Мало открытых вопросов')) {
      recs.push('📝 Практика: в следующей сессии считайте количество открытых вопросов. Цель: минимум 5.');
    }
    if (client.category === 'trauma' && !errors.some(e => e.type === 'Оценка риска')) {
      recs.push('📚 При работе с травмой — изучите технику заземления и принцип "окна толерантности"');
    }

    recs.push(`🎯 Следующий шаг: проведите сессию с тем же психотипом ещё раз — фокус на улучшении: ${errors.length > 0 ? errors[0].type : 'глубина контакта'}`);

    return recs;
  },

  _calcXP(score, messageCount, difficulty) {
    const base = Math.round(score * 0.5);
    const lengthBonus = Math.min(messageCount * 2, 20);
    const diffBonus = difficulty * 10;
    return base + lengthBonus + diffBonus;
  },

  _sessionSummary(client, messageCount, score, sessionState) {
    const level = score >= 80 ? 'отличная' : score >= 60 ? 'хорошая' : score >= 40 ? 'средняя' : 'требует доработки';
    return `Сессия с ${client.name} (${client.type}): ${messageCount} обменов сообщениями. Оценка: ${score}/100 — ${level}. Доверие клиента: ${sessionState.trust || client.trust}%.`;
  },

  // ===== TRANSCRIPT ANALYSIS =====
  analyzeTranscript(text, context) {
    if (!text || text.trim().length < 50) {
      return { error: 'Транскрипт слишком короткий. Добавьте больше диалога.' };
    }

    const lines = text.split('\n').filter(l => l.trim());
    const clientLines = lines.filter(l => /^клиент:/i.test(l)).map(l => l.replace(/^клиент:/i, '').trim());
    const psychLines = lines.filter(l => /^психолог:|^терапевт:|^консультант:/i.test(l)).map(l => l.replace(/^(психолог|терапевт|консультант):/i, '').trim());

    if (!psychLines.length) {
      return { error: 'Формат не распознан. Используйте формат:\nКлиент: текст\nПсихолог: текст' };
    }

    const allPsychText = psychLines.join(' ').toLowerCase();
    const allClientText = clientLines.join(' ').toLowerCase();

    // Analysis
    const errors = this._analyzeTranscriptErrors(allPsychText, allClientText, psychLines, clientLines);
    const strengths = this._analyzeTranscriptStrengths(allPsychText, psychLines);
    const dynamics = this._analyzeTranscriptDynamics(clientLines, psychLines);
    const recommendations = this._transcriptRecommendations(errors, dynamics);
    const overallScore = this._transcriptScore(allPsychText, errors.length, psychLines.length);

    return {
      context: context || 'Не указан',
      linesAnalyzed: lines.length,
      clientTurns: clientLines.length,
      psychTurns: psychLines.length,
      overallScore,
      errors,
      strengths,
      dynamics,
      recommendations,
      standoutMoments: this._findStandoutMoments(psychLines, clientLines)
    };
  },

  _analyzeTranscriptErrors(allPsychText, allClientText, psychLines, clientLines) {
    const errors = [];

    if (/вам нужно|вы должны|надо просто/.test(allPsychText)) {
      errors.push({
        title: '🚫 Директивные формулировки',
        text: 'Используются фразы "вам нужно", "вы должны". Это создаёт сопротивление.',
        alternative: 'Замените на вопросы: "Что вы думаете могло бы помочь?"',
        severity: 'high'
      });
    }
    if (psychLines.some(l => l.length < 10)) {
      errors.push({
        title: '⚠️ Слишком краткие ответы',
        text: 'Некоторые реплики психолога очень короткие. Это может восприниматься как безразличие.',
        alternative: 'Даже простое отражение лучше краткого "да": "Расскажите об этом больше."',
        severity: 'medium'
      });
    }
    if (!/расскажите|как вы|что вы чувствуете/.test(allPsychText)) {
      errors.push({
        title: '⚠️ Мало открытых вопросов',
        text: 'В транскрипте мало открытых исследующих вопросов.',
        alternative: 'Добавляйте вопросы типа: "Расскажите мне больше о...", "Как это для вас?"',
        severity: 'medium'
      });
    }
    if (/я думаю вы|на самом деле вы/.test(allPsychText)) {
      errors.push({
        title: '⚠️ Интерпретации без запроса',
        text: 'Психолог интерпретирует клиента без его согласия.',
        alternative: 'Превратите в вопрос: "Мне интересно — может за этим стоять...? Как вам это?"',
        severity: 'medium'
      });
    }
    if (/умереть|не хочу жить|смысла нет/.test(allClientText)) {
      const riskAddressed = /безопасност|мысли о том чтобы/.test(allPsychText);
      if (!riskAddressed) {
        errors.push({
          title: '🚨 КРИТИЧНО: Пропущен суицидальный риск',
          text: 'Клиент говорит о смерти/отсутствии смысла, но психолог не оценил риск.',
          alternative: 'Обязательно: "Когда вы говорите это — у вас есть мысли о том, чтобы не жить?"',
          severity: 'critical'
        });
      }
    }

    return errors;
  },

  _analyzeTranscriptStrengths(allPsychText, psychLines) {
    const strengths = [];
    if (/расскажите/.test(allPsychText)) strengths.push('✅ Хорошее использование приглашающих вопросов');
    if (/слышу|понимаю|важно/.test(allPsychText)) strengths.push('✅ Присутствует эмпатическое отражение');
    if (/правильно ли я|вы говорите/.test(allPsychText)) strengths.push('✅ Перефразирование и проверка понимания');
    if (psychLines.some(l => l.includes('?') && l.length > 25)) strengths.push('✅ Развёрнутые открытые вопросы');
    if (psychLines.some(l => /чувствуете|ощущаете|переживаете/.test(l.toLowerCase()))) strengths.push('✅ Обращение к эмоциональному опыту клиента');
    if (!strengths.length) strengths.push('✅ Диалог состоялся — клиент продолжал говорить');
    return strengths;
  },

  _analyzeTranscriptDynamics(clientLines, psychLines) {
    const dynamics = [];
    const ratio = psychLines.reduce((sum, l) => sum + l.length, 0) /
                  Math.max(1, clientLines.reduce((sum, l) => sum + l.length, 0));
    if (ratio > 1.5) {
      dynamics.push('⚠️ Психолог говорит больше клиента (соотношение ' + ratio.toFixed(1) + ':1). Норма — клиент говорит 70% времени.');
    } else {
      dynamics.push('✅ Соотношение речи клиент/психолог сбалансировано');
    }
    return dynamics;
  },

  _transcriptRecommendations(errors, dynamics) {
    const recs = [];
    if (errors.some(e => e.severity === 'critical')) {
      recs.push('🚨 ПЕРВООЧЕРЁДНО: Изучите протокол оценки суицидального риска. Это базовая компетенция.');
    }
    if (errors.some(e => e.title.includes('Директивные'))) {
      recs.push('📚 Изучите Мотивационное интервью — фокус на автономии клиента.');
    }
    recs.push('📝 Попробуйте технику: на каждую реплику клиента — сначала отражение, потом вопрос.');
    recs.push('🎯 Запишите следующую сессию и проанализируйте соотношение вопросов и утверждений.');
    return recs;
  },

  _transcriptScore(allPsychText, errorCount, psychTurns) {
    let score = 65;
    score -= errorCount * 8;
    if (/расскажите/.test(allPsychText)) score += 8;
    if (/слышу|понимаю/.test(allPsychText)) score += 7;
    if (/правильно ли я/.test(allPsychText)) score += 10;
    return Math.max(0, Math.min(100, Math.round(score)));
  },

  _findStandoutMoments(psychLines, clientLines) {
    const moments = [];
    psychLines.forEach((line, i) => {
      if (line.includes('?') && line.length > 40) {
        moments.push({ type: 'good', label: 'Сильный вопрос', text: `"${line.substring(0, 80)}..."` });
      }
    });
    clientLines.forEach((line, i) => {
      if (line.length > 80) {
        moments.push({ type: 'client_open', label: 'Клиент открылся', text: `Клиент: "${line.substring(0, 80)}..."` });
      }
    });
    return moments.slice(0, 4);
  },

  // ===== TECHNIQUE SUGGESTIONS =====
  suggestTechniques(client, phase, sessionState) {
    const cat = client.category;
    const trust = sessionState.trust || client.trust;
    const techs = [];

    if (trust < 40) {
      techs.push('Активное слушание', 'Валидация', 'Отражение эмоций');
    } else if (cat === 'addiction') {
      techs.push('Мотивационное интервью', 'Шкала важности', 'Двустороннее отражение');
    } else if (cat === 'anxiety') {
      techs.push('Сократический диалог', 'Когнитивное переструктурирование', 'Поведенческий эксперимент');
    } else if (cat === 'depression') {
      techs.push('Поведенческая активация', 'Работа со смыслом', 'Шкала настроения');
    } else if (cat === 'trauma') {
      techs.push('Заземление', 'Стабилизация', 'Психоедукация ПТСР');
    } else if (cat === 'personality') {
      techs.push('Валидация (DBT)', 'TIPP', 'Техника "наблюдающее я"');
    } else if (cat === 'spiritual') {
      techs.push('Работа со смыслом', 'Нарратив веры', 'Образ Иова');
    } else {
      techs.push('Активное слушание', 'Открытые вопросы', 'Отражение');
    }

    return techs;
  }
};
