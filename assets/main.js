document.documentElement.classList.add('js');

const CNU_LOGO = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_Chonnam_National_University.svg';

const button = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
  button.textContent = open ? '닫기' : '메뉴';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
    nav?.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '메뉴';
    button.focus();
  }
});
document.querySelectorAll('.nav-group > button').forEach(btn => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});

document.querySelectorAll('.site-brand-logo').forEach(img => { img.src = CNU_LOGO; });
document.querySelectorAll('.brand').forEach(brand => {
  if (brand.querySelector('.site-brand-logo')) return;
  const mark = brand.querySelector('.brand-mark');
  if (mark) mark.remove();
  const img = document.createElement('img');
  img.className = 'site-brand-logo';
  img.src = CNU_LOGO;
  img.alt = '전남대학교';
  img.addEventListener('error', () => img.style.display = 'none');
  brand.prepend(img);
});

async function getJSON(path) {
  const response = await fetch(path, {cache:'no-store'});
  if (!response.ok) throw new Error(`${path} (${response.status})`);
  return response.json();
}
function asItems(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.items)) return value.items;
  return [];
}
function showError(el) {
  if (el) el.innerHTML = '<div class="data-error">데이터를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</div>';
}
function escapeHTML(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function parsePublication(text) {
  const num = (text.match(/^\[(\d+)\]/) || [,''])[1];
  const year = (text.match(/\((20\d{2})\)/) || [,''])[1];
  const clean = text.replace(/^\[\d+\]\s*/, '').trim();
  const yearToken = year ? `(${year}). ` : '';
  const split = yearToken ? clean.indexOf(yearToken) : -1;
  let authors = '', rest = clean;
  if (split >= 0) {
    authors = clean.slice(0, split).trim().replace(/\.$/, '');
    rest = clean.slice(split + yearToken.length).trim();
  }
  const parts = rest.split('. ');
  const title = parts.shift() || rest;
  const journal = parts.join('. ');
  return {num, year, authors, title, journal, raw:text};
}

async function renderLatestPublications() {
  const el = document.querySelector('[data-latest-publications]');
  if (!el) return;
  try {
    const data = asItems(await getJSON('data/publications.json'));
    el.innerHTML = data.slice(0,3).map(item => {
      const p = parsePublication(item);
      return `<article class="pub-row"><div class="pub-year">${escapeHTML(p.year)}</div><div><h3 class="pub-title">${escapeHTML(p.title)}</h3><p class="pub-authors">${escapeHTML(p.authors)}</p></div><div class="pub-journal">${escapeHTML(p.journal)}</div></article>`;
    }).join('');
  } catch (e) { showError(el); }
}

async function renderResearch() {
  const el = document.querySelector('[data-research-list]');
  if (!el) return;
  try {
    const data = asItems(await getJSON('data/research.json'));
    el.innerHTML = data.map((r,i) => {
      const summary = String(r.summary || '').trim();
      const flow = Array.isArray(r.flow) && r.flow.length ? `<div class="flow-line">${r.flow.map((x,j)=>`${j?'<i>→</i>':''}<span>${escapeHTML(x)}</span>`).join('')}</div>` : '';
      const topics = (r.topics||[]).map(t => {
        const figure = t.figure
          ? `<div class="topic-figure"><img src="${escapeHTML(t.figure)}" alt="${escapeHTML(t.title)} 연구 그림" loading="lazy"></div>`
          : `<div class="topic-figure topic-figure-empty"><span>Research figure</span></div>`;
        return `<article class="topic-card">${figure}<h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.detail)}</p></article>`;
      }).join('');
      return `<section class="research-block ${i===1?'theme-2':''}" id="${escapeHTML(r.id)}"><div class="research-block-grid"><div class="research-number">${escapeHTML(r.number)}</div><div><h2>${escapeHTML(r.title)}</h2><p class="eng-title">${escapeHTML(r.title_en)}</p>${summary?`<p class="research-summary">${escapeHTML(summary)}</p>`:''}${flow}<div class="topic-grid">${topics}</div></div></div></section>`;
    }).join('');
  } catch (e) { showError(el); }
}

async function renderProjects() {
  const el = document.querySelector('[data-projects]');
  if (!el) return;
  try {
    const data = asItems(await getJSON('data/projects.json'));
    el.innerHTML = data.map(p => `<article class="project-card"><span class="badge">${escapeHTML(p.role)}${p.period?` · ${escapeHTML(p.period)}`:''}</span><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.detail)}</p></article>`).join('');
  } catch (e) { showError(el); }
}

async function renderActivities() {
  const el = document.querySelector('[data-activities]');
  if (!el) return;
  try {
    const data = asItems(await getJSON('data/activities.json'));
    el.innerHTML = data.map(a => `<figure class="activity-card"><a href="${escapeHTML(a.image)}"><img src="${escapeHTML(a.image)}" alt="${escapeHTML(a.title)}" loading="lazy"></a><figcaption><time>${escapeHTML(a.date)}</time><h2>${escapeHTML(a.title)}</h2><p>${escapeHTML(a.type)}</p></figcaption></figure>`).join('');
  } catch (e) { showError(el); }
}

function fallbackStudentPhoto(name) {
  const node = [...document.querySelectorAll('[data-student-photo]')].find(img => img.dataset.studentPhoto === name);
  return node?.getAttribute('src') || '';
}

async function renderMembers() {
  const piEl = document.querySelector('[data-pi]');
  const studentsEl = document.querySelector('[data-students]');
  if (!piEl && !studentsEl) return;
  try {
    const data = await getJSON('data/members.json');
    if (piEl) {
      const p = data.pi;
      const intro = String(p.intro || '').trim();
      piEl.innerHTML = `<img src="${escapeHTML(p.photo)}" alt="${escapeHTML(p.name)} 교수"><div><p class="eyebrow">연구책임자</p><h2>${escapeHTML(p.name)} <span>${escapeHTML(p.name_en)}</span></h2><p class="prof-role">${escapeHTML(p.role)}</p>${intro?`<p>${escapeHTML(intro)}</p>`:''}<div class="profile-links"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)} ↗</a><a href="tel:+82625302147">${escapeHTML(p.phone)}</a><span>${escapeHTML(p.office)}</span></div></div>`;
    }
    if (studentsEl) {
      const groups = {};
      (data.students||[]).forEach(s => (groups[s.course] ||= []).push(s));
      studentsEl.innerHTML = Object.entries(groups).map(([course,items],idx)=>`${idx?`<h2 class="member-group-title">${escapeHTML(course)}</h2>`:''}<div class="student-list">${items.map(s=>{
        const photo = s.photo || fallbackStudentPhoto(s.name);
        return `<article class="student-row">${photo?`<img class="student-portrait" src="${photo}" alt="${escapeHTML(s.name)} 프로필 사진" loading="lazy">`:`<div class="student-portrait student-portrait-fallback">${escapeHTML(s.name.slice(0,1))}</div>`}<div class="student-info"><p class="eyebrow">${escapeHTML(course)}</p><h3>${escapeHTML(s.name)} <span>${escapeHTML(s.name_en)}</span></h3><a href="mailto:${escapeHTML(s.email)}">${escapeHTML(s.email)}</a></div></article>`;
      }).join('')}</div>`).join('');
    }
  } catch (e) { showError(piEl || studentsEl); }
}

async function renderAllPublications() {
  const el = document.querySelector('[data-publications]');
  if (!el) return;
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#publication-year');
  const count = document.querySelector('#publication-count');
  try {
    const data = asItems(await getJSON('data/publications.json')).map(parsePublication);
    const years = [...new Set(data.map(x=>x.year).filter(Boolean))];
    if (year) year.innerHTML = '<option value="all">전체 연도</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
    const draw = () => {
      const q = (search?.value || '').trim().toLowerCase();
      const y = year?.value || 'all';
      const filtered = data.filter(p => (y==='all'||p.year===y) && (!q||p.raw.toLowerCase().includes(q)));
      const groups = {};
      filtered.forEach(p => (groups[p.year||'기타'] ||= []).push(p));
      el.innerHTML = Object.entries(groups).map(([yr,items])=>`<section class="publication-year"><h2>${escapeHTML(yr)}</h2><div>${items.map(p=>`<article class="publication"><span class="pub-number">${escapeHTML(p.num.padStart(2,'0'))}</span><div><h3>${escapeHTML(p.title)}</h3><p class="authors">${escapeHTML(p.authors)}</p><p class="journal">${escapeHTML(p.journal)}</p></div></article>`).join('')}</div></section>`).join('');
      if (count) count.textContent = `${filtered.length}편`;
    };
    search?.addEventListener('input', draw);
    year?.addEventListener('change', draw);
    draw();
  } catch (e) { showError(el); }
}

renderLatestPublications();
renderResearch();
renderProjects();
renderActivities();
renderMembers();
renderAllPublications();
