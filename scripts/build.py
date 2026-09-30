"""Build a dependency-free, static GitHub Pages draft: python3 scripts/build.py."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1]
PAGES = [('index', 'Home'), ('research', 'Research'), ('members', 'Members'), ('publications', 'Publications'), ('education', 'Education'), ('photos', 'Photos'), ('contact', 'Contact')]
AREAS = [
    ('Food Processing & Quality Design', '식품가공 및 품질 설계', '가공 조건과 식품 구조의 관계를 이해하고, 목표로 하는 품질을 설계합니다.', '가공은 식품의 구조와 품질을 어떻게 바꾸는가?'),
    ('Food Quality Data Generation & Sensing', '식품 품질 데이터 생산 및 센싱', '식품의 변화를 측정 가능한 신호로 전환하고, 품질을 설명하는 데이터를 만듭니다.', '식품의 품질 변화를 어떤 신호로 읽을 수 있는가?'),
    ('Data-driven Definition of Complex Food Quality', '복합·관능 품질의 데이터 기반 정의', '여러 측정값을 연결하여 복합적인 식품 품질과 감각적 특성을 이해합니다.', '다양한 품질 정보를 어떻게 하나의 해석으로 연결할 것인가?'),
    ('Laboratory-to-Field Food AI', '실험실 정밀정보의 현장형 AI 전환', '실험실에서 얻은 품질 정보를 바탕으로 현장에서 활용할 수 있는 AI를 연구합니다.', '정밀한 품질 정보를 어떻게 현장에서 활용할 것인가?'),
]
PROJECTS = [
    ('01 / STRUCTURE', 'Structured oleogels', '올레오겔의 구조와 가공 특성을 연결하는 식품 품질 설계.'),
    ('02 / SENSING', 'MOS gas sensing', '저비용 가스 센서 신호를 활용한 식품 품질 정보 탐색.'),
    ('03 / QUALITY', 'Pasta quality', '표면·구조·전분 용출·소스 흡수의 관계를 통한 파스타 품질 이해.'),
    ('04 / PROCESSING', 'Kimchi paste', '김치 페이스트의 가공과 품질에 관한 연구.'),
]

def framework():
    return '<div class="framework"><div class="framework-title">Our research framework</div><ol class="flow" aria-label="연구 흐름">' + ''.join(f'<li>{x}</li>' for x in ['Processing', 'Quality', 'Data', 'AI', 'Field']) + '</ol></div>'

def cards(detail=False):
    result = '<div class="grid">'
    for i, (name, korean, description, question) in enumerate(AREAS, 1):
        result += f'<article class="card" id="area-{i}"><div class="card-top"><span>0{i} / RESEARCH AREA</span><span aria-hidden="true">↗</span></div><h3>{escape(name)}</h3><p><strong>{korean}</strong><br>{description}</p>'
        if detail:
            result += f'<p class="question">{question}</p>'
        result += '</article>'
    return result + '</div>'

def projects(all_items=False):
    return '<div class="project-grid' + (' page-projects' if all_items else '') + '">' + ''.join(f'<article class="project"><small>{tag}</small><h3>{name}</h3><p>{desc}</p></article>' for tag, name, desc in (PROJECTS if all_items else PROJECTS[:3])) + '</div>'

ART = '''<div class="lab-art"><span class="art-label">FOOD SYSTEMS, CONNECTED.</span>
<svg viewBox="0 0 460 280" role="img" aria-labelledby="art-title art-desc"><title id="art-title">식품 구조에서 데이터로</title><desc id="art-desc">층으로 이루어진 식품 구조가 측정 신호를 거쳐 데이터 점으로 이어지는 연구 개념도</desc>
<defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#33515c" stroke-width=".5"/></pattern><linearGradient id="layer" x2="1" y2="1"><stop stop-color="#d8edb1"/><stop offset="1" stop-color="#77b59d"/></linearGradient></defs>
<rect width="460" height="280" fill="url(#grid)"/>
<g fill="url(#layer)" stroke="#afcdb6" stroke-width="1"><path d="M35 151 119 105 201 148 117 199Z" opacity=".45"/><path d="M35 131 119 85 201 128 117 179Z" opacity=".7"/><path d="M35 111 119 65 201 108 117 159Z"/></g>
<g fill="#18463f" opacity=".7"><circle cx="87" cy="112" r="3"/><circle cx="122" cy="94" r="4"/><circle cx="135" cy="127" r="3"/><circle cx="160" cy="110" r="4"/><circle cx="110" cy="135" r="2"/></g>
<path d="M205 134H231L239 116 249 157 263 102 275 148 288 132H310" fill="none" stroke="#d5eac1" stroke-width="2"/>
<g stroke="#7aab9d" stroke-width="1" fill="none"><path d="M312 132 337 94 375 119 412 70M337 94 345 164 389 183 413 140 375 119 345 164M389 183 422 205M375 119 389 183"/></g>
<g fill="#cae7b4"><circle cx="312" cy="132" r="4"/><circle cx="337" cy="94" r="6"/><circle cx="375" cy="119" r="8"/><circle cx="412" cy="70" r="4"/><circle cx="345" cy="164" r="5"/><circle cx="389" cy="183" r="6"/><circle cx="413" cy="140" r="4"/><circle cx="422" cy="205" r="3"/></g>
<g fill="#bdd4cc" font-family="Arial,sans-serif" font-size="10" letter-spacing="2"><text x="69" y="245">STRUCTURE</text><text x="224" y="245">SIGNAL</text><text x="356" y="245">DATA</text></g></svg>
<div class="art-bottom"><span>Processing to understanding.</span><span>FPFT LAB / CNU</span></div></div>'''

def layout(slug, title, content, description):
    nav = ''.join(f'<a href="{key}.html"' + (' aria-current="page"' if slug == key else '') + f'>{label}</a>' for key, label in PAGES)
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#102e3b"><title>{title} | CNU FPFT Lab</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css"><script src="assets/main.js" defer></script></head>
<body><a class="skip" href="#main">본문 바로가기</a><div class="draft">홈페이지 검토용 초안 · 기존 사이트 콘텐츠 이전 전</div><header class="header"><div class="wrap header-inner"><a class="brand" href="index.html" aria-label="FPFT Lab 홈"><span class="brand-mark" aria-hidden="true">fpft</span><span><strong>FPFT Lab</strong><small>CHONNAM NATIONAL UNIVERSITY</small></span></a><button class="menu-button" aria-expanded="false" aria-controls="navigation" type="button">메뉴</button><nav class="nav" id="navigation" aria-label="주 메뉴">{nav}</nav></div></header>
<main id="main">{content}</main><footer class="footer"><div class="wrap footer-inner"><div><strong>FPFT Lab</strong><p>Chonnam National University · 전남대학교</p></div><div><a href="https://github.com/CNU-FPFT-Lab">GitHub ↗</a><p>Food Processing · Quality · Data · AI</p></div></div></footer></body></html>'''

home = f'''<div class="wrap"><section class="hero"><div><p class="eyebrow">Chonnam National University</p><h1>Food Processing<br>and <span>FoodTech</span><br>Lab</h1><p class="intro">식품가공에서 품질을 이해하고, 데이터에서 현장으로 연결합니다.<br>가공과 구조, 측정과 해석의 관계를 연구합니다.<br>이를 바탕으로 식품 현장에 활용할 수 있는 AI를 탐구합니다.</p><div class="actions"><a class="button" href="research.html">Explore our research <span aria-hidden="true">↗</span></a><a class="text-link" href="https://github.com/CNU-FPFT-Lab">GitHub ↗</a></div></div>{ART}</section>{framework()}<section class="section"><div class="section-head"><div><p class="eyebrow">What we study</p><h2>Four connected research areas.</h2><p>식품의 변화를 이해하고, 측정하고, 활용하는 네 가지 연구축.</p></div><a class="text-link" href="research.html">View research ↗</a></div>{cards()}</section></div>
<section class="section projects"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Research highlights</p><h2>Questions that connect.</h2></div></div>{projects()}</div></section>
<section class="section wrap"><div class="join"><div><h2>Connect with FPFT Lab.</h2><p>식품가공, 품질 데이터, AI를 연결하는 연구에 관심이 있으신가요?</p></div><a class="button" href="contact.html">Contact <span aria-hidden="true">↗</span></a></div></section>'''

research = f'''<div class="wrap"><header class="page-head"><p class="eyebrow">Our research</p><h1>From processing<br>to the field.</h1><p class="lead">식품가공을 출발점으로 품질을 이해하고, 데이터를 생산하며, 그 정보를 현장에 적용하는 연구를 지향합니다.</p></header>{framework()}<section class="section research-section">{cards(True)}</section></div><section class="section projects"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Current projects · draft</p><h2>Research in focus.</h2></div></div>{projects(True)}<p class="research-note">연구 주제와 소개 문구는 이전 논의를 바탕으로 정리한 초안이며, 기존 공개 사이트 원문과 대조할 예정입니다.</p></div></section>'''

PENDING = {
 'members': ('People behind the research.', '구성원 소개', '교수 및 구성원 소개는 기존 홈페이지의 공개 프로필과 명단을 확인한 뒤 이전합니다. 사진, 소속, 경력은 원문을 기준으로 반영합니다.'),
 'publications': ('Research, shared.', '논문 및 연구 성과', '기존 홈페이지의 논문 목록을 기준으로 저자, 제목, 학술지, 연도와 DOI를 확인하여 이전합니다.'),
 'education': ('Learning through research.', '교육 및 강의', '기존 홈페이지에 공개된 강의명, 교육 자료와 관련 링크를 확인하여 이전합니다.'),
 'photos': ('Life at FPFT Lab.', '연구실 사진', '기존 홈페이지의 공개 사진과 설명을 확인한 뒤 연구실 활동 갤러리로 구성합니다.'),
 'contact': ('Let’s connect.', '연락처 및 오시는 길', '공개용 이메일, 연구실 위치와 모집 안내는 기존 홈페이지 원문을 확인한 뒤 이전합니다.'),
}

for slug, title in PAGES:
    if slug == 'index':
        body, desc = home, 'FPFT Lab 홈페이지 검토용 초안. 식품가공, 품질, 데이터, AI를 연결하는 연구.'
    elif slug == 'research':
        body, desc = research, 'FPFT Lab의 연구 철학과 네 가지 연구축 검토용 초안.'
    else:
        heading, korean, note = PENDING[slug]
        body = f'<div class="wrap"><header class="page-head"><p class="eyebrow">{title}</p><h1>{heading}</h1><p class="lead">{korean}</p></header><section class="pending"><span class="status">CONTENT MIGRATION PENDING</span><h2>공개 원문 확인 후 업데이트합니다.</h2><p>{note}</p>'
        if slug == 'contact':
            body += '<p>연구실 GitHub: <a href="https://github.com/CNU-FPFT-Lab">CNU-FPFT-Lab ↗</a></p>'
        body += '</section></div>'
        desc = f'FPFT Lab {title} 페이지. 기존 사이트 콘텐츠 이전 준비 중.'
    (ROOT / f'{slug}.html').write_text(layout(slug, title, body, desc), encoding='utf-8')
print(f'Built {len(PAGES)} pages.')
