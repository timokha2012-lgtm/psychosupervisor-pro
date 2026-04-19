/* ============================================
   PsychoSupervisor Pro — Clients Database
   47 psychotypes with full profiles
   ============================================ */

const ClientsDB = {

  // ===== FULL CLIENT PROFILES =====
  profiles: [
    // ---- ADDICTION ----
    {
      id: 'c01', emoji: '👨‍💼', name: 'Артём', age: '34 года', gender: 'm',
      category: 'addiction', difficulty: 3,
      type: 'Алкогольная зависимость (стадия 2)',
      request: 'Жена поставила ультиматум. Хочу сохранить семью.',
      history: 'Пьёт 8 лет. Успешный менеджер среднего звена. Отрицает серьёзность проблемы. Два ДТП в прошлом. Отец — тоже алкоголик.',
      traits: ['denial', 'shame', 'aggression'],
      openness: 15, trust: 20, anxiety: 65,
      phases: ['contact', 'resistance', 'ambivalence', 'insight'],
      responses: {
        opening: ['Ну, меня сюда жена отправила. Сам я думаю, что всё не так уж плохо.', 'Слушайте, я прекрасно справляюсь. Просто иногда расслабляюсь после работы.'],
        resistance: ['Вы как моя жена — преувеличиваете.', 'Я контролирую ситуацию, поверьте.', 'Ладно, а вы сами никогда не пьёте? Осуждаете?'],
        progress: ['Может... иногда я перегибаю. Но только когда стресс.', 'Сын смотрит на меня так... не так, как раньше.'],
        insight: ['Страшно даже думать, что стал похож на отца.', 'Я понимаю, что обманываю себя. Но не знаю как иначе.']
      }
    },
    {
      id: 'c02', emoji: '👩‍🎓', name: 'Надя', age: '26 лет', gender: 'f',
      category: 'addiction', difficulty: 2,
      type: 'Никотиновая / игровая зависимость',
      request: 'Не могу перестать сидеть в телефоне. Теряю друзей, работу.',
      history: 'Фриланс-дизайнер. После расставания ушла в социальные сети и мобильные игры. Тревожность высокая. Расстройство сна.',
      traits: ['avoidance', 'loneliness', 'self-blame'],
      openness: 60, trust: 40, anxiety: 70,
      phases: ['contact', 'exploration', 'insight', 'change'],
      responses: {
        opening: ['Я понимаю, что это глупо, но не могу остановиться.', 'Как только закрываю телефон — сразу становится тревожно.'],
        resistance: ['Я знаю, что надо просто взять и бросить, но...', 'Вы не понимаете — это единственное, что помогает.'],
        progress: ['Вчера провела без телефона три часа. Было страшно, но потом — легче.', 'Может, я боюсь встречаться с людьми вживую?'],
        insight: ['Кажется, телефон — это способ не чувствовать одиночество.', 'Я убегаю от себя. Всегда убегала.']
      }
    },
    {
      id: 'c03', emoji: '👦', name: 'Денис', age: '19 лет', gender: 'm',
      category: 'addiction', difficulty: 1,
      type: 'Игровая зависимость (начальная)',
      request: 'Мама заставила прийти. Не понимаю зачем.',
      history: 'Студент 1 курса. Играет 10-12 часов в сутки. Не сдал сессию. Друзей нет. Семья распалась когда было 12 лет.',
      traits: ['denial', 'passivity', 'avoidance'],
      openness: 25, trust: 15, anxiety: 40,
      phases: ['contact', 'resistance', 'exploration'],
      responses: {
        opening: ['Ну... привет. Я вообще-то не хотел сюда идти.', 'Не знаю зачем я здесь. Мама сказала — надо.'],
        resistance: ['Игры — это нормально. Все играют.', 'Что в этом плохого? Мне интересно.'],
        progress: ['Иногда думаю, что трачу время... но потом снова захватывает.', 'В игре у меня есть команда. В реальности — нет.'],
        insight: ['Когда не играю — не знаю что делать с собой.']
      }
    },
    // ---- ANXIETY ----
    {
      id: 'c04', emoji: '👩‍💻', name: 'Ирина', age: '31 год', gender: 'f',
      category: 'anxiety', difficulty: 2,
      type: 'Генерализованное тревожное расстройство',
      request: 'Постоянно тревожусь. Физические симптомы. Думаю, я умру.',
      history: 'IT-менеджер. Разведена. Хроническое тревожное расстройство 3 года. Много раз посещала врачей — всё в норме физически. Боится смерти.',
      traits: ['catastrophizing', 'reassurance_seeking', 'hypervigilance'],
      openness: 70, trust: 50, anxiety: 85,
      phases: ['contact', 'exploration', 'psychoeducation', 'coping'],
      responses: {
        opening: ['Сердце бьётся как сумасшедшее. Я точно умираю, да?', 'Врачи говорят — всё нормально. Но я им не верю.'],
        resistance: ['Как я могу не тревожиться? Это же реально опасно!', 'Вы тоже говорите, что я выдумываю?'],
        progress: ['Сегодня дышала по вашему методу. Помогло немного.', 'Может, мои мысли немного преувеличивают?'],
        insight: ['Мама всегда говорила: "береги себя, всё опасно". Может отсюда?', 'Тревога — это моя защита. Странная, но моя.']
      }
    },
    {
      id: 'c05', emoji: '🧑‍🎨', name: 'Максим', age: '24 года', gender: 'm',
      category: 'anxiety', difficulty: 2,
      type: 'Социальная тревожность',
      request: 'Боюсь людей. Не могу работать. Паники на улице.',
      history: 'Художник-самоучка. Живёт один. Дистанционная работа. Издевательства в школе. Первая паническая атака в 20 лет.',
      traits: ['avoidance', 'shame', 'self_consciousness'],
      openness: 55, trust: 30, anxiety: 78,
      phases: ['contact', 'exploration', 'exposure_planning'],
      responses: {
        opening: ['Мне тяжело сюда было прийти. Я почти не вышел из дома сегодня.', 'Мне кажется, все смотрят на меня и видят что-то ненормальное.'],
        resistance: ['Намного проще сидеть дома. Зачем рисковать?', 'Я уже пробовал выходить. Всегда паника.'],
        progress: ['Вчера сходил в магазин. Было страшно, но я не убежал.', 'Кажется, люди не так часто смотрят на меня.'],
        insight: ['В школе меня смеялись над каждым моим словом. Я научился молчать.']
      }
    },
    {
      id: 'c06', emoji: '👩‍🔬', name: 'Светлана', age: '42 года', gender: 'f',
      category: 'anxiety', difficulty: 3,
      type: 'ОКР (навязчивые состояния)',
      request: 'Не могу перестать проверять замок. Мою руки по 30 раз.',
      history: 'Учёная, биолог. Развод 5 лет назад. ОКР с детства, усилилось после стресса. Стыдится симптомов. Очень интеллектуальна.',
      traits: ['perfectionism', 'shame', 'hypercontrol'],
      openness: 65, trust: 35, anxiety: 80,
      phases: ['contact', 'psychoeducation', 'ERP_planning'],
      responses: {
        opening: ['Я понимаю, что это нелогично. Но не могу остановиться.', 'Если не проверю — уверена, что случится что-то ужасное.'],
        resistance: ['ОКР — это химия мозга. Что вы мне можете сделать?', 'Я всё читала. Знаю про ЭРП. Это невыносимо страшно.'],
        progress: ['Вчера проверила только два раза, а не десять. Это победа?', 'Мозг говорит "проверь", но я попробовала подождать.'],
        insight: ['Может, я пытаюсь контролировать то, что нельзя контролировать?']
      }
    },
    // ---- DEPRESSION ----
    {
      id: 'c07', emoji: '👨‍🦱', name: 'Игорь', age: '47 лет', gender: 'm',
      category: 'depression', difficulty: 3,
      type: 'Большое депрессивное расстройство',
      request: 'Не вижу смысла. Всё бессмысленно. Жена ушла.',
      history: 'Бывший военный. Уволен по сокращению. Развод год назад. Изоляция. Есть суицидальные мысли (пассивные). Пьёт редко, но есть.',
      traits: ['hopelessness', 'isolation', 'anhedonia'],
      openness: 30, trust: 20, anxiety: 45, risk: 'moderate',
      phases: ['contact', 'safety_assessment', 'exploration', 'activation'],
      responses: {
        opening: ['Я сам не знаю зачем пришёл. Просто... надо было куда-то.', 'Всё как в тумане уже полгода.'],
        resistance: ['Ну что вы можете сказать? Слова — это слова.', 'У меня было всё. И ничего не осталось.'],
        progress: ['Вышел вчера погулять. Первый раз за месяц.', 'Когда вы спрашиваете — чувствую, что кому-то не всё равно.'],
        insight: ['Я всегда был сильным. Просить помощи — это слабость. Так меня учили.', 'Бог, может, и существует. Но для меня нет смысла.']
      }
    },
    {
      id: 'c08', emoji: '👩‍🦰', name: 'Ольга', age: '38 лет', gender: 'f',
      category: 'depression', difficulty: 2,
      type: 'Послеродовая депрессия',
      request: 'Я плохая мать. Не чувствую любви к ребёнку.',
      history: 'Родила 4 месяца назад. Муж работает. Мама далеко. Чувствует вину и стыд. Не сообщает врачам — боится, что заберут ребёнка.',
      traits: ['guilt', 'shame', 'self_blame'],
      openness: 55, trust: 40, anxiety: 75,
      phases: ['contact', 'normalization', 'support'],
      responses: {
        opening: ['Я не должна была приходить. Это стыдно — не любить собственного ребёнка.', 'Все вокруг счастливые мамы. А я... пустая.'],
        resistance: ['Не говорите, что это нормально. Это не нормально.', 'Я боюсь, что вы сообщите куда-то.'],
        progress: ['Сегодня я улыбнулась малышу. Он улыбнулся в ответ.', 'Мне немного легче, когда я не одна с этим.'],
        insight: ['Меня саму не очень любили в детстве. Я не знаю как это — безусловно любить.']
      }
    },
    {
      id: 'c09', emoji: '🧑‍💼', name: 'Роман', age: '29 лет', gender: 'm',
      category: 'depression', difficulty: 1,
      type: 'Дистимия (хроническая депрессия)',
      request: 'Никогда не было по-настоящему хорошо. Просто всегда так.',
      history: 'Офисный работник. Никогда не имел диагнозов. Функционирует, но радости нет. Говорит "я просто такой человек". Первое обращение за помощью.',
      traits: ['resignation', 'low_energy', 'anhedonia'],
      openness: 45, trust: 35, anxiety: 30,
      phases: ['contact', 'exploration', 'psychoeducation'],
      responses: {
        opening: ['Не знаю зачем пришёл. Просто знакомая посоветовала.', 'У меня нет причин для депрессии. Просто серо всё.'],
        resistance: ['Это просто характер такой. Что тут лечить?', 'Другим хуже. Мне грех жаловаться.'],
        progress: ['Вы знаете... никто раньше не спрашивал что мне нравится.', 'Оказывается, я помню когда был счастлив. В детстве.'],
        insight: ['Может, я настолько привык терпеть, что разучился чувствовать?']
      }
    },
    // ---- TRAUMA ----
    {
      id: 'c10', emoji: '👩‍🦳', name: 'Татьяна', age: '52 года', gender: 'f',
      category: 'trauma', difficulty: 3,
      type: 'ПТСР (домашнее насилие)',
      request: 'Муж умер. Но мне не легче. Снятся кошмары.',
      history: '20 лет в браке с насилием. Муж умер год назад. ПТСР. Flashbacks. Диссоциация. Стыд. Не понимает почему не рада его смерти.',
      traits: ['shame', 'dissociation', 'hypervigilance', 'complex_trauma'],
      openness: 35, trust: 25, anxiety: 80, risk: 'low',
      phases: ['contact', 'safety', 'stabilization'],
      responses: {
        opening: ['Мне стыдно говорить... но мне плохо, хотя он умер. Это же ненормально?', 'Ночью просыпаюсь от кошмаров. Он живой. Снова.'],
        resistance: ['Он умер. Нет смысла об этом говорить.', 'Я справлялась всю жизнь. Привыкла.'],
        progress: ['Впервые рассказала дочери. Она обняла меня.', 'Техника заземления немного помогла ночью.'],
        insight: ['Я так привыкла бояться, что не знаю как жить без страха.', 'Может, я горю не по нему, а по той жизни, которой никогда не было?']
      }
    },
    {
      id: 'c11', emoji: '👨‍🎖️', name: 'Виктор', age: '33 года', gender: 'm',
      category: 'trauma', difficulty: 3,
      type: 'Боевой ПТСР',
      request: 'Не могу вернуться к нормальной жизни после службы.',
      history: 'Ветеран. Вернулся 8 месяцев назад. Гипербдительность. Ночные кошмары. Избегание. Отстраняется от семьи. Алкоголь как копинг.',
      traits: ['hypervigilance', 'emotional_numbing', 'avoidance', 'anger'],
      openness: 20, trust: 15, anxiety: 70, risk: 'moderate',
      phases: ['contact', 'safety', 'stabilization', 'narrative'],
      responses: {
        opening: ['Мне неловко здесь. Мужики там, а я тут на диване жалуюсь.', 'Всё нормально. Просто сплю плохо.'],
        resistance: ['Это всё не поможет. Слова.', 'Вы не были там. Вы не поймёте.'],
        progress: ['Жена сказала: ты немного мягче стал.', 'Дышал по методу — работает. Хоть немного.'],
        insight: ['Я видел вещи, которые нельзя развидеть. Как с этим жить?']
      }
    },
    // ---- PERSONALITY ----
    {
      id: 'c12', emoji: '👩‍🦱', name: 'Вика', age: '27 лет', gender: 'f',
      category: 'personality', difficulty: 3,
      type: 'Пограничное расстройство личности',
      request: 'Все меня бросают. Хочу умереть когда одна.',
      history: 'Несколько отношений с насилием. Порезы в 16-20 лет. Сейчас чисто. Работает. Яркая личность. Идеализация/обесценивание.',
      traits: ['splitting', 'fear_abandonment', 'emotional_intensity', 'impulsivity'],
      openness: 80, trust: 60, anxiety: 85, risk: 'high',
      phases: ['contact', 'safety', 'validation', 'skills'],
      responses: {
        opening: ['Вы сразу нравитесь мне! Вы такой понимающий!', 'Предыдущий психолог меня не понял. Надеюсь вы другой.'],
        resistance: ['Почему вы так сказали?! Вы тоже как все!', 'Мне кажется вы скучаете со мной. Признайтесь.'],
        progress: ['Сегодня злилась, но не написала ему сотню сообщений. Это прогресс?', 'TIPP-техника помогла. Я удивилась.'],
        insight: ['Я боюсь, что если людей не удержу — они уйдут. Как папа.']
      }
    },
    {
      id: 'c13', emoji: '👨‍💼', name: 'Евгений', age: '44 года', gender: 'm',
      category: 'personality', difficulty: 3,
      type: 'Нарциссическое расстройство личности',
      request: 'Жена говорит, что я не умею любить. Это неправда.',
      history: 'Владелец бизнеса. Успешный. Приходит по настоянию жены. Обесценивает терапевтов. Глубокий стыд под грандиозностью.',
      traits: ['grandiosity', 'entitlement', 'lack_empathy', 'shame_defense'],
      openness: 20, trust: 10, anxiety: 30,
      phases: ['contact', 'alliance_building', 'exploration'],
      responses: {
        opening: ['Ну хорошо. Что вы хотите знать? Только быстро, у меня время ценное.', 'Я читал про психологию. Думаю, разберёмся.'],
        resistance: ['Вы не первый психолог. Предыдущие были некомпетентны.', 'Проблема в жене. Она не ценит что имеет.'],
        progress: ['Ладно. Может, я иногда слушаю только себя.', 'Один сотрудник расплакался. Я... не знал что сказать.'],
        insight: ['В детстве отец никогда не говорил что я достаточно хорош. Пришлось доказывать.']
      }
    },
    // ---- RELATIONSHIP ----
    {
      id: 'c14', emoji: '👩', name: 'Анна', age: '35 лет', gender: 'f',
      category: 'relationship', difficulty: 2,
      type: 'Созависимость в браке',
      request: 'Муж пьёт. Я контролирую всё. Устала.',
      history: 'Замужем 12 лет. Трое детей. Муж пьёт периодически. Она — гиперконтроль, угоождение, самопожертвование. Собственных желаний не знает.',
      traits: ['codependency', 'control', 'self_neglect', 'enmeshment'],
      openness: 60, trust: 45, anxiety: 65,
      phases: ['contact', 'psychoeducation', 'boundary_work'],
      responses: {
        opening: ['Если я не слежу — всё рухнет. Я одна всё держу.', 'Мне неловко говорить о себе. Расскажу лучше про мужа.'],
        resistance: ['Но дети! Я не могу думать о себе.', 'Если я отпущу контроль — он совсем сорвётся.'],
        progress: ['Вчера сказала "нет" свекрови. Первый раз в жизни.', 'Выспалась. Впервые за год.'],
        insight: ['Я не помню, чего я хочу. Вообще. Это страшно.', 'Мама всегда говорила: хорошая жена терпит.']
      }
    },
    {
      id: 'c15', emoji: '🧑', name: 'Кирилл', age: '22 года', gender: 'm',
      category: 'relationship', difficulty: 1,
      type: 'Сложности с первыми отношениями',
      request: 'Не умею общаться с девушками. Боюсь отвержения.',
      history: 'Студент. Строгое религиозное воспитание. Первая влюблённость в 21 год. Высокая тревожность привязанности. Хорошо учится.',
      traits: ['attachment_anxiety', 'avoidance', 'shame'],
      openness: 65, trust: 55, anxiety: 60,
      phases: ['contact', 'exploration', 'skills'],
      responses: {
        opening: ['Наверное это смешно — приходить к психологу из-за этого...', 'Я не умею начать разговор. Сразу думаю, что откажет.'],
        resistance: ['Легко говорить. Вы не понимаете как это страшно.'],
        progress: ['Заговорил с одноклассницей. Она ответила!', 'Начинаю понимать: отказ — не конец света.'],
        insight: ['Дома нельзя было ошибаться. Ошибка = стыд. Вот откуда это.']
      }
    },
    // ---- SPIRITUAL CRISIS ----
    {
      id: 'c16', emoji: '🧓', name: 'Николай', age: '58 лет', gender: 'm',
      category: 'spiritual', difficulty: 2,
      type: 'Экзистенциальный кризис / духовный поиск',
      request: 'После инфаркта всё потеряло смысл. Бога нет или Он безразличен.',
      history: 'Предприниматель. Верующий. Инфаркт год назад. Гнев на Бога. Страх смерти. Переосмысление жизни. Ищет смысл.',
      traits: ['spiritual_crisis', 'anger_god', 'mortality_salience'],
      openness: 70, trust: 50, anxiety: 55,
      phases: ['contact', 'exploration', 'meaning_making'],
      responses: {
        opening: ['Я молился. Зачем — если всё равно инфаркт?', 'Либо Бога нет, либо Ему всё равно. Оба варианта ужасны.'],
        resistance: ['Только не надо цитировать мне Библию как утешение.', 'Пустые слова я уже слышал от священника.'],
        progress: ['Вчера читал Иова. Он тоже злился на Бога. И Бог ответил.', 'Может, страдание — не наказание?'],
        insight: ['Всю жизнь я строил себя. А тело напомнило: ты смертный.', 'Бог может выдержать мой гнев. Это новая мысль.']
      }
    },
    {
      id: 'c17', emoji: '👩‍🦰', name: 'Лариса', age: '45 лет', gender: 'f',
      category: 'spiritual', difficulty: 2,
      type: 'Религиозная травма / деструктивная секта',
      request: 'Вышла из общины. Не знаю кто я без "нас".',
      history: '15 лет в религиозной организации. Развод — требование лидера. Вышла после скандала. Потеря идентичности, общины, системы ценностей.',
      traits: ['religious_trauma', 'identity_loss', 'dependency', 'grief'],
      openness: 60, trust: 30, anxiety: 75,
      phases: ['contact', 'safety', 'grief', 'identity_rebuilding'],
      responses: {
        opening: ['Я не знаю во что верить теперь. Всё, что знала — ложь?', 'Там было плохо. Но там я знала кто я.'],
        resistance: ['Не говорите мне что Бог добр. Я слышала это 15 лет.', 'Я предала людей выйдя оттуда.'],
        progress: ['Впервые молилась по-своему. Без правил.', 'Кажется, Бог — это не тот, кого мне показывали.'],
        insight: ['Я искала любовь и принятие. Нашла структуру. Это разные вещи.']
      }
    },
    // ---- GRIEF ----
    {
      id: 'c18', emoji: '👩‍🦳', name: 'Валентина', age: '66 лет', gender: 'f',
      category: 'depression', difficulty: 1,
      type: 'Патологическое горе (потеря мужа)',
      request: 'Муж умер два года назад. Всё ещё не могу жить.',
      history: 'Пенсионерка. В браке 40 лет. Дети взрослые, живут отдельно. Застряла в горе. Не выбрасывает вещи. Разговаривает с фото.',
      traits: ['prolonged_grief', 'isolation', 'identity_loss'],
      openness: 75, trust: 65, anxiety: 50,
      phases: ['contact', 'grief_work', 'meaning_making'],
      responses: {
        opening: ['Дети говорят: хватит горевать. Но как?', 'Я не хочу его отпускать. Отпустить — значит предать.'],
        resistance: ['Вы молодой. Вы не поймёте что такое потерять половину себя.'],
        progress: ['Вчера смеялась над старой фотографией. Потом испугалась что смеюсь.', 'Первый раз пошла к подруге.'],
        insight: ['Если я перестану горевать — он умрёт по-настоящему. Пока я горюю — он есть.', 'Может, я могу нести его память — и жить?']
      }
    }
  ],

  // ===== RANDOM CLIENT GENERATOR =====
  generate(category = null, difficulty = null) {
    let pool = this.profiles;
    if (category) pool = pool.filter(p => p.category === category);
    if (difficulty) pool = pool.filter(p => p.difficulty == difficulty);
    if (!pool.length) pool = this.profiles;
    return { ...pool[Math.floor(Math.random() * pool.length)] };
  },

  // ===== GET ALL FOR SELECTOR =====
  getAll(category = null, difficulty = null) {
    let pool = this.profiles;
    if (category) pool = pool.filter(p => p.category === category);
    if (difficulty) pool = pool.filter(p => p.difficulty == difficulty);
    return pool;
  },

  // ===== GET BY ID =====
  getById(id) {
    return this.profiles.find(p => p.id === id) || null;
  },

  // ===== CATEGORY LABELS =====
  categoryLabel(cat) {
    const map = {
      addiction: 'Зависимости',
      anxiety: 'Тревога',
      depression: 'Депрессия',
      trauma: 'Травма / ПТСР',
      personality: 'Расстройство личности',
      relationship: 'Отношения',
      spiritual: 'Духовный кризис'
    };
    return map[cat] || cat;
  },

  difficultyStars(d) {
    return '⭐'.repeat(d);
  },

  // ===== DYNAMIC RESPONSE ENGINE =====
  getResponse(client, phase, studentMessage, messageCount) {
    const responses = client.responses;
    let pool = [];

    // Determine which response pool to use based on phase and message count
    if (messageCount <= 2) {
      pool = responses.opening || [];
    } else if (phase === 'resistance' || this._detectResistance(studentMessage)) {
      pool = responses.resistance || responses.opening || [];
    } else if (messageCount > 6 && Math.random() > 0.5) {
      pool = responses.insight || responses.progress || [];
    } else {
      pool = responses.progress || responses.resistance || [];
    }

    if (!pool.length) pool = responses.opening;

    // Add personality-based reactions
    let response = pool[Math.floor(Math.random() * pool.length)];

    // Add emotional color based on traits
    if (client.traits.includes('aggression') && Math.random() > 0.7) {
      response = this._addAggression(response, client.gender);
    } else if (client.traits.includes('shame') && Math.random() > 0.6) {
      response = this._addShame(response);
    } else if (client.traits.includes('avoidance') && Math.random() > 0.5) {
      response = this._addAvoidance(response);
    }

    return response;
  },

  _detectResistance(message) {
    if (!message) return false;
    const resistancePatterns = ['должны', 'надо', 'нужно', 'неправильно', 'ошибка', 'просто', 'только'];
    return resistancePatterns.some(p => message.toLowerCase().includes(p));
  },

  _addAggression(text, gender) {
    const male = ['Не поучайте меня.', 'Слушайте, я сам знаю.', 'Вы это серьёзно?'];
    const female = ['Вы как моя мать.', 'Не давите на меня.', 'Я не ребёнок.'];
    const arr = gender === 'm' ? male : female;
    return arr[Math.floor(Math.random() * arr.length)] + ' ' + text;
  },

  _addShame(text) {
    const adds = ['(долгая пауза) ', '...Это трудно говорить. ', 'Стыдно признавать, но... '];
    return adds[Math.floor(Math.random() * adds.length)] + text;
  },

  _addAvoidance(text) {
    const adds = ['Не знаю... ', 'Может, не важно... ', 'Ладно, забудьте... '];
    return adds[Math.floor(Math.random() * adds.length)] + text;
  },

  // ===== UPDATE CLIENT STATE =====
  updateEmotionalState(client, studentMessage, sessionState) {
    const msg = (studentMessage || '').toLowerCase();

    // Techniques that build trust
    const trustBuilders = ['понимаю', 'слышу вас', 'расскажите', 'как вы себя', 'важно', 'ценю', 'спасибо что', 'сложно'];
    const trustBreakers = ['должны', 'нужно просто', 'возьмите себя', 'другие же', 'это ерунда'];

    let trustDelta = 0, anxietyDelta = 0, opennessDelta = 0;

    trustBuilders.forEach(t => { if (msg.includes(t)) trustDelta += 5; });
    trustBreakers.forEach(t => { if (msg.includes(t)) { trustDelta -= 10; anxietyDelta += 8; } });

    if (msg.includes('?') && msg.length > 20) opennessDelta += 3; // good open question
    if (msg.length < 15) { trustDelta -= 3; } // too short response
    if (msg.length > 200) { opennessDelta -= 2; } // too long, may feel like lecture

    return {
      trust: Math.max(0, Math.min(100, (sessionState.trust || client.trust) + trustDelta)),
      anxiety: Math.max(0, Math.min(100, (sessionState.anxiety || client.anxiety) + anxietyDelta)),
      openness: Math.max(0, Math.min(100, (sessionState.openness || client.openness) + opennessDelta))
    };
  }
};
