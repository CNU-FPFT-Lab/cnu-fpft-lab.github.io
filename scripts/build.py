"""Build the static FPFT Lab website: python3 scripts/build.py."""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PAGES = [('index', 'Home'), ('research', 'Research'), ('members', 'Members'), ('publications', 'Publications'), ('education', 'Education'), ('photos', 'Photos'), ('contact', 'Contact')]
AREAS = [
    ('Food Processing & Quality Design', '식품가공 및 품질 설계', '가공 조건과 식품 구조의 관계를 이해하고, 목표로 하는 품질을 설계합니다.', '가공은 식품의 구조와 품질을 어떻게 바꾸는가?'),
    ('Food Quality Data Generation & Sensing', '식품 품질 데이터 생산 및 센싱', '식품의 변화를 측정 가능한 신호로 전환하고, 품질을 설명하는 데이터를 만듭니다.', '식품의 품질 변화를 어떤 신호로 읽을 수 있는가?'),
    ('Data-driven Definition of Complex Food Quality', '복합·관능 품질의 데이터 기반 정의', '여러 측정값을 연결하여 복합적인 식품 품질과 감각적 특성을 이해합니다.', '다양한 품질 정보를 어떻게 하나의 해석으로 연결할 것인가?'),
    ('Laboratory-to-Field Food AI', '실험실 정밀정보의 현장형 AI 전환', '실험실에서 얻은 품질 정보를 바탕으로 현장에서 활용할 수 있는 AI를 연구합니다.', '정밀한 품질 정보를 어떻게 현장에서 활용할 것인가?'),
]
PROJECTS = [
    ('01 / STRUCTURE', 'Structured oils & oleogels', '상온 안정형 구조화 오일의 구조적 특성과 유화 형성·안정성의 관계를 연구합니다.'),
    ('02 / SENSING', 'MOS gas sensing', '가변온도 구동에 따른 MOS 센서의 시계열 반응을 분석하여 식품 품질 모니터링에 활용합니다.'),
    ('03 / QUALITY', 'Pasta & sauce interactions', '파스타 표면 거칠기, 전분 용출과 소스 점도가 오일 기반 소스 흡착에 미치는 영향을 연구합니다.'),
    ('04 / APPLICATION', 'Kimchi pesto', '김치의 맛과 향을 새로운 소스 형태로 확장하고, 배합에 따른 발림성·기호도·저장 안정성을 평가합니다.'),
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
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#102e3b"><meta property="og:title" content="{title} | CNU FPFT Lab"><meta property="og:description" content="{escape(description)}"><meta property="og:type" content="website"><meta property="og:image" content="https://cnu-fpft-lab.github.io/assets/lab-spring-2026.jpg"><link rel="canonical" href="https://cnu-fpft-lab.github.io/{'' if slug == 'index' else slug + '.html'}"><title>{title} | CNU FPFT Lab</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css"><link rel="stylesheet" href="assets/pages.css"><script src="assets/main.js" defer></script></head>
<body><a class="skip" href="#main">본문 바로가기</a><header class="header"><div class="wrap header-inner"><a class="brand" href="index.html" aria-label="FPFT Lab 홈"><span class="brand-mark" aria-hidden="true">fpft</span><span><strong>FPFT Lab</strong><small>CHONNAM NATIONAL UNIVERSITY</small></span></a><button class="menu-button" aria-expanded="false" aria-controls="navigation" type="button">메뉴</button><nav class="nav" id="navigation" aria-label="주 메뉴">{nav}</nav></div></header>
<main id="main">{content}</main><footer class="footer"><div class="wrap footer-inner"><div><strong>Food Processing and FoodTech Lab</strong><p>전남대학교 식품공학과 · Department of Food Science and Technology</p><p>© 2026 FPFT Lab, Chonnam National University</p></div><div><a href="mailto:ehkim88@jnu.ac.kr">ehkim88@jnu.ac.kr</a><br><a href="https://github.com/CNU-FPFT-Lab">GitHub ↗</a></div></div></footer></body></html>'''

home = f'''<div class="wrap"><section class="hero"><div><p class="eyebrow">Chonnam National University</p><h1>Food Processing<br>and <span>FoodTech</span><br>Lab</h1><p class="intro">식품가공에서 품질을 이해하고, 데이터에서 현장으로 연결합니다.<br>가공과 구조, 측정과 해석의 관계를 연구합니다.<br>이를 바탕으로 식품 현장에 활용할 수 있는 AI를 탐구합니다.</p><div class="actions"><a class="button" href="research.html">Explore our research <span aria-hidden="true">↗</span></a><a class="text-link" href="https://github.com/CNU-FPFT-Lab">GitHub ↗</a></div></div>{ART}</section>{framework()}<section class="section"><div class="section-head"><div><p class="eyebrow">What we study</p><h2>Four connected research areas.</h2><p>식품의 변화를 이해하고, 측정하고, 활용하는 네 가지 연구축.</p></div><a class="text-link" href="research.html">View research ↗</a></div>{cards()}</section></div>
<section class="section projects"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Research highlights</p><h2>Questions that connect.</h2></div></div>{projects()}</div></section>
<section class="section wrap"><div class="lab-life"><img src="assets/lab-spring-2026.jpg" width="1280" height="960" alt="벚꽃 아래 모인 FPFT Lab 구성원들" loading="lazy"><div><p class="eyebrow">Life at FPFT Lab</p><h2>Learning together.<br>Growing together.</h2><p>함께 연구하고, 결과를 나누며, 일상을 쌓아갑니다.</p><a class="text-link" href="photos.html">View lab moments ↗</a></div></div></section>
<section class="section wrap join-section"><div class="join"><div><h2>Join us.</h2><p>식품가공, 품질 데이터, AI를 연결하는 연구에 관심이 있으신가요?</p></div><a class="button" href="contact.html">Get in touch <span aria-hidden="true">↗</span></a></div></section>'''

research = f'''<div class="wrap"><header class="page-head"><p class="eyebrow">Our research</p><h1>From processing<br>to the field.</h1><p class="lead">식품가공을 출발점으로 품질을 이해하고, 데이터를 생산하며, 그 정보를 현장에 적용하는 연구를 지향합니다.</p></header>{framework()}<section class="section research-section">{cards(True)}</section></div><section class="section projects"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Current projects</p><h2>Research in focus.</h2></div></div>{projects(True)}</div></section><section class="section wrap"><div class="section-head"><div><p class="eyebrow">Methods & tools</p><h2>Measure. Understand. Apply.</h2><p>연구 질문에 맞는 측정과 분석을 연결합니다.</p></div></div><div class="method-list"><span>식품가공·물성 분석</span><span>초분광 영상 · HSI</span><span>MOS 가스 센싱</span><span>RGB 영상 분석</span><span>머신러닝·딥러닝</span></div><p class="intro">정밀 분석으로 얻은 품질 정보를 활용해 식품의 특성을 해석하고, 실용적인 품질 예측과 가공 기술로 연결합니다.</p><a class="text-link" href="publications.html">Explore publications ↗</a></section>'''

def page_head(label, heading, lead):
    return f'<header class="page-head"><p class="eyebrow">{label}</p><h1>{heading}</h1><p class="lead">{lead}</p></header>'

students = [('이지민', 'Jimin Lee', '석사 과정'), ('이승학', 'Seunghak Lee', '석사 과정'), ('주세령', 'Saeryeong Ju', '석사 과정'), ('이수현', 'Suhyeon Lee', '석사 과정'), ('김성무', 'Sungmoo Kim', '학·석사 연계과정'), ('김민서', 'Minseo Kim', '학·석사 연계과정')]
members = '<div class="wrap">' + page_head('Members', 'People behind the research.', '함께 질문하고, 실험하며, 식품의 변화를 이해합니다.') + '''<section class="professor"><img src="assets/eunghee-kim.jpg" width="1104" height="1336" alt="김웅희 교수"><div><p class="eyebrow">Principal investigator</p><h2>김웅희 <span>Eunghee Kim</span></h2><p class="prof-role">조교수 · 전남대학교 식품공학과</p><p>식품가공 공정과 물성·품질을 기반으로, 초분광 영상·가스 센서·RGB 영상과 머신러닝·딥러닝을 연결하는 연구를 수행합니다.</p><div class="profile-links"><a href="mailto:ehkim88@jnu.ac.kr">ehkim88@jnu.ac.kr ↗</a><a href="tel:+82625302147">062-530-2147</a><span>농업생명과학대학 3호관 110호</span></div></div></section><section class="section profile-details"><div><h2>Education</h2><ul><li>서울대학교 식품생명공학 전공 · 학사</li><li>서울대학교 농생명공학 전공 · 석사</li><li>서울대학교 농생명공학 전공 · 박사</li></ul></div><div><h2>Experience</h2><ul><li><span>2025.03–현재</span> 전남대학교 식품공학과 · 조교수</li><li><span>2023.08–2025.02</span> 한국식품연구원 스마트제조사업단 · 박사후연구원</li><li><span>2021.09–2023.07</span> 서울대학교 식품바이오 융합연구소 · 선임연구원·연구교수</li><li><span>2021.08–2022.08</span> 연세대학교 식품영양학과 · 객원교수</li><li><span>2019.03–2021.02</span> 성신여자대학교 바이오식품공학과 · 강사</li></ul></div></section><section class="section student-section"><div class="section-head"><div><p class="eyebrow">Current members</p><h2>Our team.</h2></div></div><div class="student-grid">'''
for korean, english, course in students:
    members += f'<article class="student"><p class="eyebrow">{course}</p><h3>{korean}</h3><p>{english}</p></article>'
members += '</div></section></div>'

papers = json.loads((ROOT / 'data/publications.json').read_text(encoding='utf-8'))
years = sorted({re.search(r'\((20\d\d)\)', p).group(1) for p in papers}, reverse=True)
publications = '<div class="wrap">' + page_head('Publications', 'Research, shared.', '식품가공, 품질 분석, 센싱과 데이터 기반 연구의 성과를 소개합니다.')
publications += '<div class="publication-tools"><label for="publication-year">연도</label><select id="publication-year"><option value="all">전체 연도</option>' + ''.join(f'<option value="{y}">{y}</option>' for y in years) + '</select><p id="publication-count" aria-live="polite">19 publications</p></div><div class="publication-list">'
for year in years:
    publications += f'<section class="publication-year" data-year="{year}" aria-labelledby="year-{year}"><h2 id="year-{year}">{year}</h2><div>'
    for paper in papers:
        if f'({year})' not in paper:
            continue
        number, citation = re.match(r'\[(\d+)\]\s*(.*)', paper.strip()).groups()
        authors, rest = citation.split(f'({year}). ', 1)
        title, journal = rest.rsplit('. ', 1) if '. ' in rest else (rest, '')
        if number == '19':
            title = 'Fresh Potato Pellet Preparation for Puffed Snacks: A Preliminary Evaluation of Particle Size and Sulfite Pretreatment'
            journal = 'Journal of Food Processing and Preservation. (In press)'
        publications += f'<article class="publication"><span class="pub-number">{number.zfill(2)}</span><div><h3>{escape(title.rstrip("."))}</h3><p class="authors">{escape(authors.strip())}</p><p class="journal">{escape(journal)}</p></div></article>'
    publications += '</div></section>'
publications += '</div><p class="source-note">기존 연구실 공개 목록을 바탕으로 정리했습니다. 논문의 서지·게재 상태는 해당 목록 기준입니다.</p></div>'

education = '<div class="wrap">' + page_head('Education', 'Learning through research.', '식품가공의 원리에서 실험 설계와 데이터 해석까지, 연구를 통해 연결합니다.') + '''<section class="section research-section"><div class="grid"><article class="card"><p class="eyebrow">01 / Principles</p><h3>Food processing fundamentals</h3><p>가공 공정이 식품의 구조·물성·품질에 미치는 영향을 이해하는 것을 교육의 출발점으로 삼습니다.</p></article><article class="card"><p class="eyebrow">02 / Experiments</p><h3>From questions to experiments</h3><p>명확한 연구 질문을 바탕으로 변수를 설정하고, 측정 가능한 지표로 실험을 설계하는 역량을 지향합니다.</p></article><article class="card"><p class="eyebrow">03 / Data</p><h3>Data-informed interpretation</h3><p>실험과 센싱으로 얻은 데이터를 해석하고, 품질의 차이를 근거를 가지고 설명하는 역량을 지향합니다.</p></article><article class="card"><p class="eyebrow">04 / Communication</p><h3>Share and discuss</h3><p>캡스톤디자인과 학술 발표를 통해 연구 과정과 결과를 정리하고 공유합니다.</p></article></div></section><section class="section projects education-highlights"><div class="section-head"><div><p class="eyebrow">Student activities</p><h2>Learning in practice.</h2></div></div><div class="project-grid"><article class="project"><small>2026.07 / 경주</small><h3>캡스톤 경진대회</h3><p>한국식품저장유통학회 기간 중 캡스톤 경진대회 대상 수상.</p></article><article class="project"><small>2026.07 / 대전</small><h3>학술 포스터 발표</h3><p>한국식품과학회 포스터 발표 및 우수 포스터상 수상.</p></article><article class="project"><small>2025.12</small><h3>캡스톤디자인 성과공유회</h3><p>캡스톤디자인 성과공유회 우수상 수상.</p></article></div><p><a class="text-link" href="photos.html">View lab activities ↗</a></p></section></div>'''

GALLERY = [('conference-gyeongju-2026.jpg', '2026.07.22–24', '한국식품저장유통학회 · 경주', '학회 참가 및 캡스톤 경진대회 대상 수상.'), ('conference-daejeon-2026.jpg', '2026.07.01–03', '한국식품과학회 · 대전', '포스터 발표 및 우수 포스터상 수상.'), ('lab-spring-2026.jpg', '2026.04.01', 'Spring at FPFT Lab', '벚꽃 아래에서 함께한 연구실 단체 사진.'), ('lab-hiking-2026.jpg', '2026.02.23', 'Lab hiking day', '연구실 구성원들과 함께한 단체 등산.')]
photos = '<div class="wrap">' + page_head('Photos', 'Life at FPFT Lab.', '학술대회에서 일상까지, 함께한 순간을 기록합니다.') + '<section class="gallery">'
for filename, date, title, desc in GALLERY:
    photos += f'<figure class="photo-card"><a href="assets/{filename}" aria-label="{title} 사진 크게 보기"><img src="assets/{filename}" alt="{title} 연구실 활동 사진" loading="lazy"></a><figcaption><time>{date}</time><h2>{title}</h2><p>{desc}</p></figcaption></figure>'
photos += '</section></div>'

contact = '<div class="wrap">' + page_head('Contact', 'Let’s connect.', '연구실 참여와 공동연구에 관심이 있으시면 이메일로 연락해 주세요.') + '''<section class="contact-grid"><article class="contact-primary"><p class="eyebrow">Research & collaboration</p><h2>김웅희 · Eunghee Kim</h2><a class="email" href="mailto:ehkim88@jnu.ac.kr">ehkim88@jnu.ac.kr ↗</a><p>관심 있는 연구 주제와 간단한 소개를 함께 보내주시면 연구에 관한 대화를 시작하는 데 도움이 됩니다.</p><a href="tel:+82625302147">T. 062-530-2147</a></article><article class="contact-location"><p class="eyebrow">Visit us</p><h2>Chonnam National University</h2><dl><dt>교수 연구실</dt><dd>농업생명과학대학 3호관 110호</dd><dt>연구실</dt><dd>농업생명과학대학 3호관 112호</dd><dt>주소</dt><dd>북구 용봉로 77 전남대학교<br>77, Yongbong-ro, Buk-gu, Gwangju,<br>Republic of Korea, 61186</dd></dl></article></section><section class="section"><div class="join"><div><p class="eyebrow">Research resources</p><h2>FPFT Lab on GitHub.</h2><p>연구실 GitHub 조직에서 공개 저장소를 확인할 수 있습니다.</p></div><a class="button" href="https://github.com/CNU-FPFT-Lab">Visit GitHub <span aria-hidden="true">↗</span></a></div></section></div>'''

CONTENT = {'index': home, 'research': research, 'members': members, 'publications': publications, 'education': education, 'photos': photos, 'contact': contact}
DESCRIPTIONS = {'index': '전남대학교 식품가공 및 푸드테크연구실. 식품가공, 품질, 데이터, AI를 현장으로 연결합니다.', 'research': '식품가공·품질 설계, 센싱, 복합 품질의 데이터 기반 정의, 현장형 Food AI를 연구합니다.', 'members': '전남대학교 FPFT Lab 김웅희 교수와 연구실 구성원 소개.', 'publications': 'FPFT Lab의 식품가공, 품질 분석, 센싱 및 데이터 기반 연구 논문.', 'education': '식품가공 원리, 실험 설계, 데이터 해석을 연결하는 FPFT Lab의 연구 교육 방향.', 'photos': 'FPFT Lab의 학회, 연구 활동과 일상 기록.', 'contact': 'FPFT Lab 연구 참여 및 공동연구 문의. ehkim88@jnu.ac.kr'}

for slug, title in PAGES:
    (ROOT / f'{slug}.html').write_text(layout(slug, title, CONTENT[slug], DESCRIPTIONS[slug]), encoding='utf-8')
print(f'Built {len(PAGES)} pages.')
