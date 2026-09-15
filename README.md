# REFACTOR — лендинг

Одностраничный сайт консалтингового бренда **REFACTOR** (ИП «Серикбаев Е.О.», Астана):
финансовый контроль и цифровой порядок для строительных, горнодобывающих, телеком-
и транспортных компаний Казахстана.

**Живой адрес:** https://refactor.kz

## О проекте

- Чистый HTML/CSS/JS, без фреймворков и сборщиков — всё в одном `index.html`
- Дизайн-язык «Midnight Executive» (navy / gold / terracotta), светлая и тёмная темы
- Системные шрифты, без внешних CDN; анимированная Cash Curve в герое
- Полная мобильная адаптивность, scroll-reveal, `prefers-reduced-motion`
- OG-превью `og.png` (1200×630) и JSON-LD `ProfessionalService` для поиска и шеринга

## Структура страницы

Герой с Cash Curve → полоса фактов → «Четыре фразы» (боли собственников) →
5 анонимных кейсов → готовые решения → **«Почему один человек делает то, на что
интегратор ставит команду»** (метод, граница ответственности, анти-позиционирование) →
«Три этапа» + принципы → «Кто делает» → входной оффер и CTA.

## Деплой

GitHub Pages, ветка `main` / root, кастомный домен из `CNAME` (refactor.kz).

## Контакты

- Telegram: [@yerzhan_serikbayev](https://t.me/yerzhan_serikbayev)
- Email: yserikbayev@gmail.com
- LinkedIn: [yerzhan-serikbayev](https://www.linkedin.com/in/yerzhan-serikbayev/)
- Instagram: [@yerzhanserikbayev](https://www.instagram.com/yerzhanserikbayev/)

## Альтернативная версия /v2/ (15.09.2026)

Новый портфолио-сайт: [refactor.kz/v2/](https://refactor.kz/v2/). Основная версия сохранена.

- `v2/index.html`, `v2/styles.css`, `v2/app.js` — страница и интерактивность.
- `v2/projects.json` — обезличенные кейсы, статусы и описания; `v2/projects/` — статические страницы.
- `v2/assets/` — локальные шрифты Onest (OFL), иллюстрация и демонстрационные интерфейсы.
- `scripts/build-v2.py` — генератор каталога и страниц; запуск: `python3 scripts/build-v2.py`.
- `scripts/browser-smoke.js` — браузерная проверка фильтров, навигации, брифа, мобильного режима и доступности без JavaScript; функция принимает Playwright Page, открытый на проверяемом сайте.
- `ASSUMPTIONS.md` — решения по дизайну, публикации и обезличиванию.
