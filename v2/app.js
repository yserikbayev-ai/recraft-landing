(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menu && nav) {
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Открыть меню'); nav.classList.remove('open'); };
    menu.addEventListener('click', () => {
      const isOpen = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      nav.classList.toggle('open', isOpen);
      if (isOpen) nav.querySelector('a')?.focus();
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
    matchMedia('(min-width: 641px)').addEventListener('change', closeMenu);
  }

  const cards = [...document.querySelectorAll('.catalog-card[data-category]')];
  const controls = document.querySelector('.catalog-controls');
  if (controls && cards.length) {
    controls.hidden = false;
    const search = document.querySelector('#project-search');
    const filters = [...document.querySelectorAll('[data-filter]')];
    let category = 'all';
    document.querySelector('.total-count').textContent = cards.length;
    function applyFilter() {
      const query = search.value.trim().toLocaleLowerCase('ru');
      let count = 0;
      cards.forEach(card => {
        const visible = (category === 'all' || card.dataset.category === category) && card.textContent.toLocaleLowerCase('ru').includes(query);
        card.hidden = !visible;
        if (visible) count++;
      });
      document.querySelector('#catalog-result').textContent = `Показано ${count} из ${cards.length}`;
      document.querySelector('#empty-state').hidden = count !== 0;
      filters.forEach(button => {
        const active = button.dataset.filter === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    filters.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; applyFilter(); }));
    search.addEventListener('input', applyFilter);
    document.querySelectorAll('[data-jump-filter]').forEach(link => link.addEventListener('click', () => { category = link.dataset.jumpFilter; search.value = ''; applyFilter(); }));
    applyFilter();
  }

  const brief = document.querySelector('#brief-app');
  if (!brief) return;
  brief.hidden = false;
  const form = document.querySelector('#brief-form');
  const question = document.querySelector('#brief-question');
  const back = document.querySelector('#brief-back');
  const next = document.querySelector('#brief-next');
  const result = document.querySelector('#brief-result');
  const state = { step: 0, answers: ['', '', ''], detail: '' };
  const steps = [
    { title: 'С чем разберёмся?', options: [
      ['Финансовый контроль', 'Бюджет, деньги, управленческая отчётность'],
      ['Операционные процессы', 'Закупки, склад, техника, согласования'],
      ['AI и автоматизация', 'Агенты, документы, интеграции с 1С'],
      ['Новый продукт', 'Система, портал или Mini App'],
      ['Пока не определился', 'Начнём с диагностики задачи']
    ] },
    { title: 'Как это работает сейчас?', options: [
      ['Excel и ручная работа', 'Таблицы, переписки, ручные сводки'],
      ['1С или CRM', 'Есть система, не хватает нужного процесса'],
      ['Несколько разных систем', 'Нужно связать данные и убрать дублирование'],
      ['Запускаем с нуля', 'Есть идея, систему ещё не выбирали']
    ] },
    { title: 'Что для вас сейчас важнее?', options: [
      ['Разобраться и выбрать первый шаг', 'Проверить идею и определить объём'],
      ['Запустить работающий инструмент', 'Есть задача, нужен результат'],
      ['Развивать существующую систему', 'Доработки, сопровождение, новые модули']
    ] }
  ];
  function renderStep(focus = false) {
    question.replaceChildren();
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = steps[state.step].title;
    fieldset.append(legend);
    steps[state.step].options.forEach(([value, description], index) => {
      const label = document.createElement('label');
      label.className = 'brief-option';
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'answer'; input.value = value; input.required = true;
      input.checked = state.answers[state.step] === value;
      const text = document.createElement('span'); text.textContent = value;
      const sub = document.createElement('span'); sub.textContent = description; text.append(sub);
      label.append(input, text); fieldset.append(label);
      input.addEventListener('change', () => { state.answers[state.step] = value; document.querySelector('#brief-error').textContent = ''; });
    });
    question.append(fieldset);
    if (state.step === 2) {
      const label = document.createElement('label'); label.htmlFor = 'brief-detail'; label.textContent = 'Пара слов о задаче — если хотите';
      const textarea = document.createElement('textarea'); textarea.id = 'brief-detail'; textarea.maxLength = 1200; textarea.placeholder = 'Например: сводим заявки из трёх филиалов вручную…'; textarea.value = state.detail;
      textarea.addEventListener('input', () => { state.detail = textarea.value; });
      question.append(label, textarea);
    }
    document.querySelector('#step-label').textContent = `ШАГ 0${state.step + 1} / 03`;
    document.querySelectorAll('.brief-progress i').forEach((bar, index) => bar.classList.toggle('filled', index <= state.step));
    back.hidden = state.step === 0;
    next.replaceChildren(document.createTextNode(state.step === 2 ? 'Подготовить описание ' : 'Дальше '));
    const arrow = document.createElement('span'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); next.append(arrow);
    if (focus) {
      const selected = fieldset.querySelector('input:checked') || fieldset.querySelector('input');
      selected.focus({ preventScroll: true });
      question.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
  function showResult() {
    const summary = ['Здравствуйте, Ержан! Хочу обсудить задачу с REFACTOR.', '', `Задача: ${state.answers[0]}`, `Сейчас: ${state.answers[1]}`, `Приоритет: ${state.answers[2]}`, ...(state.detail.trim() ? ['', `Контекст: ${state.detail.trim()}`] : [])].join('\n');
    document.querySelector('#brief-summary').textContent = summary;
    document.querySelector('#brief-send').href = `https://wa.me/77019149520?text=${encodeURIComponent(summary)}`;
    form.hidden = true; result.hidden = false;
    document.querySelector('#step-label').textContent = 'ОПИСАНИЕ ГОТОВО';
    const heading = result.querySelector('h3'); heading.tabIndex = -1; heading.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = form.querySelector('input[name=answer]:checked');
    if (!selected) { document.querySelector('#brief-error').textContent = 'Выберите подходящий вариант.'; return; }
    state.answers[state.step] = selected.value;
    if (state.step < 2) { state.step++; renderStep(true); } else showResult();
  });
  back.addEventListener('click', () => { if (state.step > 0) { state.step--; renderStep(true); } });
  document.querySelector('#brief-reset').addEventListener('click', () => {
    state.step = 0; state.answers = ['', '', '']; state.detail = '';
    form.hidden = false; result.hidden = true; document.querySelector('#copy-status').textContent = '';
    document.querySelector('#brief-summary').textContent = '';
    document.querySelector('#brief-send').href = 'https://wa.me/77019149520';
    renderStep(true);
  });
  document.querySelector('#brief-copy').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(document.querySelector('#brief-summary').textContent); status.textContent = 'Скопировано. Можно отправить в Telegram или по почте.'; }
    catch { status.textContent = 'Не удалось скопировать автоматически. Выделите описание выше или скачайте .txt.'; }
  });
  document.querySelector('#brief-download').addEventListener('click', () => {
    const blob = new Blob(['\uFEFF', document.querySelector('#brief-summary').textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'refactor-task.txt'; document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const art = document.querySelector('.hero-art');
  const sculpture = document.querySelector('.sculpture');
  if (art && sculpture && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { sculpture.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused'; });
    observer.observe(art);
    document.addEventListener('visibilitychange', () => { sculpture.style.animationPlayState = document.hidden ? 'paused' : 'running'; });
  }
  renderStep();
})();
