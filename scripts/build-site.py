#!/usr/bin/env python3
"""Render static, indexable portfolio pages from the public, sanitized dataset."""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT
projects = json.loads((SITE / 'projects.json').read_text())
assert len(projects) >= 10, 'Portfolio dataset missing'
assert len({p['slug'] for p in projects}) == len(projects), 'Duplicate project slugs'
CATEGORIES = {'operations': 'Операции', 'finance': 'Финансы', 'ai': 'AI и прошивки', 'products': 'Продукты'}
FALLBACKS = {'operations': 'procurement', 'finance': 'telecom', 'ai': 'ai', 'products': 'construction'}
SYMBOLS = {'operations': '⌘', 'finance': '↗', 'ai': '✳', 'products': '▦'}

def e(value):
    return escape(str(value), quote=True)

def preview(p):
    return '/assets/preview-' + p.get('preview', FALLBACKS[p['category']]) + '.svg'

def status(p):
    return '<span class="status" data-state="' + e(p['status']) + '">' + e(p['status']) + '</span>'

def card(p, catalogue=False, index=0):
    url = '/projects/' + p['slug'] + '/'
    if catalogue:
        return f'''<a class="catalog-card" data-category="{e(p['category'])}" href="{url}"><div class="catalog-card-top"><span class="catalog-symbol" aria-hidden="true">{SYMBOLS[p['category']]}</span>{status(p)}</div><h3>{e(p['title'])}</h3><p>{e(p['summary'])}</p><div class="catalog-card-foot"><span class="mono">{e(p['industry'])} · {CATEGORIES[p['category']]}</span><b aria-hidden="true">↗</b></div></a>'''
    return f'''<a class="case-feature" href="{url}"><div class="case-preview"><img src="{preview(p)}" width="1200" height="800" loading="lazy" decoding="async" alt="Демонстрационный интерфейс: {e(p['title'])}"></div><div class="case-copy"><div class="case-meta mono"><span>{index:02d} / {e(p['industry'])}</span>{status(p)}</div><h3>{e(p.get('headline', p['title']))}</h3><p>{e(p['summary'])}</p><span class="text-link">Разобрать кейс <span aria-hidden="true">↗</span></span></div></a>'''

for p in projects:
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', p['slug']), p['slug']
    assert p['category'] in CATEGORIES
    assert all(p.get(k) for k in ['title','industry','status','summary','problem','solution','result','features','stack'])
    assert not any(k in p for k in ['sourcePaths', 'client', 'sources']), 'Private research fields must not enter public output'
    assert (ROOT / preview(p).lstrip('/')).exists(), preview(p)

main = (SITE / 'index.html').read_text()
featured = sorted([p for p in projects if p.get('featured')], key=lambda p: p['featured'])
assert len(featured) == 6, 'Exactly six highlighted cases required'
for key, content in [('FEATURED', '\n'.join(card(p, index=i + 1) for i, p in enumerate(featured))), ('CATALOG', '\n'.join(card(p, catalogue=True) for p in projects))]:
    main = re.sub(fr'<!-- {key}_START -->.*?<!-- {key}_END -->', f'<!-- {key}_START -->\n{content}\n<!-- {key}_END -->', main, flags=re.S)
(SITE / 'index.html').write_text(main)
header = re.search(r'<header class="header">.*?</header>', main, re.S).group()
header = header.replace('href="./"', 'href="/"').replace('href="#', 'href="/#')
footer = re.search(r'<footer class="footer wrap">.*?</footer>', main, re.S).group()
footer = footer.replace('href="./"', 'href="/"')
urls = ['https://refactor.kz/']
for p in projects:
    url = 'https://refactor.kz/projects/' + p['slug'] + '/'
    urls.append(url)
    siblings = [q for q in projects if q['category'] == p['category'] and q['slug'] != p['slug']][:3]
    related = ''.join(card(q, catalogue=True) for q in siblings)
    stack = ' · '.join(p['stack'])
    stories = ''.join(f'<section class="case-story"><h2>{label}</h2><p>{e(p[key])}</p></section>' for label, key in [('Задача', 'problem'), ('Что собрано', 'solution'), ('Что это даёт', 'result')])
    features = ''.join('<li>' + e(feature) + '</li>' for feature in p['features'])
    page = f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(p['title'])} — REFACTOR</title><meta name="description" content="{e(p['summary'])}"><meta name="theme-color" content="#f4f3ee"><link rel="canonical" href="{url}"><meta property="og:type" content="article"><meta property="og:title" content="{e(p['title'])} — REFACTOR"><meta property="og:description" content="{e(p['summary'])}"><meta property="og:url" content="{url}"><meta property="og:locale" content="ru_RU"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body><a class="skip-link" href="#main">Перейти к содержимому</a>{header}<main id="main" class="case-page wrap"><a class="case-breadcrumb" href="/#systems">← Весь каталог практики</a><div class="case-page-top"><div><span class="eyebrow">{e(p['industry'])} / {CATEGORIES[p['category']]}</span><h1>{e(p.get('headline', p['title']))}</h1><p class="case-page-lead">{e(p['summary'])}</p></div><dl class="case-facts"><div><dt>СОСТОЯНИЕ ПРОЕКТА</dt><dd>{status(p)}</dd></div><div><dt>НАПРАВЛЕНИЕ</dt><dd>{e(p['industry'])}</dd></div><div><dt>ТЕХНОЛОГИИ И МЕТОДЫ</dt><dd>{e(stack)}</dd></div></dl></div><div class="case-page-visual"><img src="{preview(p)}" width="1200" height="800" alt="Иллюстрация принципа работы на демонстрационных данных"></div><p class="disclosure">Схема иллюстрирует тип решения. Это демонстрационные данные, не снимок рабочей системы заказчика. Описание обезличено.</p>{stories}<ul class="feature-list">{features}</ul><div class="case-page-cta"><h2>Знакомая задача?</h2><a class="button button-dark" href="/#brief">Обсудить ваш проект <span aria-hidden="true">↗</span></a></div><section class="related-projects"><h2>Ещё из практики</h2><div class="catalog-grid">{related}</div></section></main>{footer}</body></html>'''
    dest = SITE / 'projects' / p['slug'] / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page)
(SITE / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + u + '</loc></url>' for u in urls) + '</urlset>\n')
print(f'Rendered homepage + {len(projects)} case pages; featured: {len(featured)}; no runtime build dependencies.')
