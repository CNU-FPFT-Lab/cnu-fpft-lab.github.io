document.documentElement.classList.add('js');

const CNU_LOGO='https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_Chonnam_National_University.svg';
const button=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

button?.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));
  nav?.classList.toggle('open',open);
  button.textContent=open?'닫기':'메뉴';
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true'){
    nav?.classList.remove('open');
    button.setAttribute('aria-expanded','false');
    button.textContent='메뉴';
    button.focus();
  }
});
document.querySelectorAll('.nav-group > button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
document.querySelectorAll('.site-brand-logo').forEach(img=>img.src=CNU_LOGO);

function setText(selector,text){const el=document.querySelector(selector);if(el)el.textContent=text;}
function normalizeKoreanUI(){
  if(button&&button.getAttribute('aria-expanded')!=='true')button.textContent='메뉴';
  document.querySelectorAll('.nav > a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('index.html'))a.textContent='홈';
    else if(href.endsWith('research.html'))a.textContent='연구';
    else if(href.endsWith('photos.html'))a.textContent='연구실 활동';
    else if(href.endsWith('contact.html'))a.textContent='문의·오시는 길';
  });
  const groups=document.querySelectorAll('.nav-group');
  if(groups[0])groups[0].querySelector(':scope > button').textContent='구성원';
  if(groups[1])groups[1].querySelector(':scope > button').textContent='연구성과';
  document.querySelectorAll('.nav-sub a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('#pi'))a.textContent='연구책임자';
    else if(href.endsWith('#students'))a.textContent='대학원생';
    else if(href.endsWith('#papers'))a.textContent='논문';
    else if(href.endsWith('#projects'))a.textContent='연구과제';
    else if(href.endsWith('#patents'))a.textContent='특허·기술이전';
  });
  document.querySelectorAll('.site-footer strong').forEach(el=>el.textContent='식품가공 및 푸드테크 연구실');
  document.querySelectorAll('.site-footer a[href="contact.html"]').forEach(el=>el.textContent='문의·오시는 길 →');

  if(page==='members.html'){
    setText('.page-hero h1','구성원');
    setText('.student-section .section-head h2','대학원생');
  }else if(page==='photos.html'){
    setText('.activities-page-hero h1','연구실 활동');
  }else if(page==='activity.html'){
    setText('.page-hero h1','연구실 활동');
  }else if(page==='contact.html'){
    setText('.page-hero h1','문의·오시는 길');
  }
}

async function getJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path} (${r.status})`);return r.json();}
function asItems(v){return Array.isArray(v)?v:(v&&Array.isArray(v.items)?v.items:[]);}
function showError(el){if(el)el.innerHTML='<div class="data-error">데이터를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.</div>';}
function escapeHTML(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function lines(v=''){return escapeHTML(v).replace(/\n/g,'<br>');}

function parsePublication(text){
  const num=(text.match(/^\[(\d+)\]/)||[,''])[1];
  const year=(text.match(/\((20\d{2})\)/)||[,''])[1];
  const clean=text.replace(/^\[\d+\]\s*/,'').trim();
  const yt=year?`(${year}). `:'';
  const split=yt?clean.indexOf(yt):-1;
  let authors='',rest=clean;
  if(split>=0){authors=clean.slice(0,split).trim().replace(/\.$/,'');rest=clean.slice(split+yt.length).trim();}
  const parts=rest.split('. '),title=parts.shift()||rest,journal=parts.join('. ');
  return{num,year,authors,title,journal,raw:text};
}

async function renderLatestPublications(){
  const el=document.querySelector('[data-latest-publications]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/publications.json'));
    el.innerHTML=data.slice(0,3).map(item=>{const p=parsePublication(typeof item==='string'?item:(item.entry||''));return `<article class="pub-row"><div class="pub-year">${escapeHTML(p.year)}</div><div><h3 class="pub-title">${escapeHTML(p.title)}</h3><p class="pub-authors">${escapeHTML(p.authors)}</p></div><div class="pub-journal">${escapeHTML(p.journal)}</div></article>`;}).join('');
  }catch(e){showError(el);}
}

async function renderNotices(){
  const el=document.querySelector('[data-notices]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/notices.json'));
    if(!data.length)return;
    el.innerHTML=data.map(n=>`<article class="notice-row"><time>${escapeHTML(n.date||'')}</time><div class="notice-content"><h3>${escapeHTML(n.title||'')}</h3>${n.meta?`<p class="notice-meta">${escapeHTML(n.meta)}</p>`:''}${n.detail?`<p class="notice-detail">${lines(n.detail)}</p>`:''}${n.email?`<a class="notice-email" href="mailto:${escapeHTML(n.email)}">문의 · ${escapeHTML(n.email)}</a>`:''}</div></article>`).join('');
  }catch(e){showError(el);}
}

async function renderResearch(){
  const el=document.querySelector('[data-research-list]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/research.json'));
    el.innerHTML=data.map((r,i)=>{
      const summary=String(r.summary||'').trim();
      const flow=Array.isArray(r.flow)&&r.flow.length?`<div class="flow-line">${r.flow.map((x,j)=>`${j?'<i>→</i>':''}<span>${escapeHTML(typeof x==='string'?x:(x.step||''))}</span>`).join('')}</div>`:'';
      const overview=r.overview_figure?`<figure class="research-overview-figure"><img src="${escapeHTML(r.overview_figure)}" alt="${escapeHTML(r.title)} 연구 개요" loading="lazy"></figure>`:'';
      const topics=(r.topics||[]).map(t=>`<article class="topic-card"><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.detail)}</p></article>`).join('');
      const eng=String(r.title_en||'').trim()?`<p class="eng-title">${escapeHTML(r.title_en)}</p>`:'';
      return `<section class="research-block ${i===1?'theme-2':''}" id="${escapeHTML(r.id)}"><div class="research-block-grid"><div class="research-number">${escapeHTML(r.number)}</div><div><h2>${escapeHTML(r.title)}</h2>${eng}${summary?`<p class="research-summary">${escapeHTML(summary)}</p>`:''}${flow}${overview}<div class="topic-grid">${topics}</div></div></div></section>`;
    }).join('');
  }catch(e){showError(el);}
}

const courseKO={'석사 과정':'석사과정','박사 과정':'박사과정','학·석사 연계과정':'학·석사 연계과정','학부연구생':'학부연구생','졸업생':'졸업생'};
function fallbackStudentPhoto(name){const node=[...document.querySelectorAll('[data-student-photo]')].find(img=>img.dataset.studentPhoto===name);return node?.getAttribute('src')||'';}
async function renderMembers(){
  const piEl=document.querySelector('[data-pi]'),studentsEl=document.querySelector('[data-students]');if(!piEl&&!studentsEl)return;
  try{
    const data=await getJSON('data/members.json');
    if(piEl){
      const p=data.pi,intro=String(p.intro||'').trim();
      piEl.innerHTML=`<img src="${escapeHTML(p.photo||'assets/eunghee-kim-new.svg')}" alt="김웅희 교수"><div><p class="eyebrow">연구책임자</p><h2>${escapeHTML(p.name)} <span>${escapeHTML(p.name_en)}</span></h2><p class="prof-role">${escapeHTML(p.role)}</p>${intro?`<p>${escapeHTML(intro)}</p>`:''}<div class="profile-links"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)} ↗</a><a href="tel:+82625302147">${escapeHTML(p.phone)}</a><span>${escapeHTML(p.office)}</span></div></div>`;
    }
    if(studentsEl){
      const groups={};(data.students||[]).forEach(s=>(groups[s.course]||=[]).push(s));
      studentsEl.innerHTML=Object.entries(groups).map(([course,items])=>`<h2 class="member-group-title">${escapeHTML(courseKO[course]||course)}</h2><div class="student-list">${items.map(s=>{const photo=s.photo||fallbackStudentPhoto(s.name),courseLabel=courseKO[course]||course;return `<article class="student-row">${photo?`<img class="student-portrait" src="${photo}" alt="${escapeHTML(s.name)}" loading="lazy">`:`<div class="student-portrait student-portrait-fallback">${escapeHTML(s.name.slice(0,1))}</div>`}<div class="student-info"><p class="eyebrow">${escapeHTML(courseLabel)}</p><h3>${escapeHTML(s.name)} <span>${escapeHTML(s.name_en)}</span></h3><a href="mailto:${escapeHTML(s.email)}">${escapeHTML(s.email)}</a></div></article>`;}).join('')}</div>`).join('');
    }
  }catch(e){showError(piEl||studentsEl);}
}

async function renderProjects(){
  const el=document.querySelector('[data-projects]');if(!el)return;
  try{
    const rank={'수행 중':0,'예정':1,'완료':2};
    const data=asItems(await getJSON('data/projects.json')).sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9));
    el.innerHTML=data.map(p=>`<article class="project-row"><div class="project-status ${p.status==='완료'?'is-past':''}">${escapeHTML(p.status||'')}</div><div class="project-main"><p class="project-program">${escapeHTML(p.program||'연구과제')}</p><h3>${escapeHTML(p.title)}</h3>${p.detail?`<p class="project-detail">${escapeHTML(p.detail)}</p>`:''}</div><dl class="project-meta"><div><dt>기간</dt><dd>${escapeHTML(p.period||'—')}</dd></div><div><dt>역할</dt><dd>${escapeHTML(p.role||'—')}</dd></div></dl></article>`).join('');
  }catch(e){showError(el);}
}

async function renderActivities(){
  const el=document.querySelector('[data-activities]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/activities.json'));
    el.innerHTML=data.map((a,i)=>{const id=a.id||String(i);return `<article class="activity-card"><a class="activity-card-link" href="activity.html?id=${encodeURIComponent(id)}"><img src="${escapeHTML(a.image)}" alt="${escapeHTML(a.title)}" loading="lazy"><div class="activity-card-title"><h2>${escapeHTML(a.title)}</h2></div></a></article>`;}).join('');
  }catch(e){showError(el);}
}

async function renderActivityDetail(){
  const el=document.querySelector('[data-activity-detail]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/activities.json'));
    const id=new URLSearchParams(location.search).get('id')||'';
    let item=data.find(a=>String(a.id)===id);
    if(!item&&/^\d+$/.test(id))item=data[Number(id)];
    if(!item){el.innerHTML='<p class="data-error">해당 활동을 찾을 수 없습니다.</p>';return;}
    el.innerHTML=`<article class="activity-detail"><a class="activity-back" href="photos.html">← 연구실 활동</a><img class="activity-detail-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"><div class="activity-detail-copy"><p class="eyebrow">${escapeHTML(item.type||'연구실 활동')}</p><h2>${escapeHTML(item.title)}</h2><dl class="activity-detail-meta"><div><dt>기간</dt><dd>${escapeHTML(item.date||'—')}</dd></div>${item.location?`<div><dt>장소</dt><dd>${escapeHTML(item.location)}</dd></div>`:''}</dl>${item.detail?`<div class="activity-detail-body"><h3>내용</h3><p>${lines(item.detail)}</p></div>`:''}</div></article>`;
  }catch(e){showError(el);}
}

async function renderAllPublications(){
  const el=document.querySelector('[data-publications]');if(!el)return;
  const search=document.querySelector('#publication-search'),year=document.querySelector('#publication-year'),count=document.querySelector('#publication-count');
  try{
    const data=asItems(await getJSON('data/publications.json')).map(x=>parsePublication(typeof x==='string'?x:(x.entry||'')));
    const years=[...new Set(data.map(x=>x.year).filter(Boolean))];
    if(year)year.innerHTML='<option value="all">전체 연도</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    const draw=()=>{
      const q=(search?.value||'').trim().toLowerCase(),y=year?.value||'all';
      const filtered=data.filter(p=>(y==='all'||p.year===y)&&(!q||p.raw.toLowerCase().includes(q))),groups={};
      filtered.forEach(p=>(groups[p.year||'기타']||=[]).push(p));
      el.innerHTML=Object.entries(groups).map(([yr,items])=>`<section class="publication-year"><h2>${escapeHTML(yr)}</h2><div>${items.map(p=>`<article class="publication"><span class="pub-number">${escapeHTML(p.num.padStart(2,'0'))}</span><div><h3>${escapeHTML(p.title)}</h3><p class="authors">${escapeHTML(p.authors)}</p><p class="journal">${escapeHTML(p.journal)}</p></div></article>`).join('')}</div></section>`).join('');
      if(count)count.textContent=`총 ${filtered.length}편`;
    };
    search?.addEventListener('input',draw);year?.addEventListener('change',draw);draw();
  }catch(e){showError(el);}
}

normalizeKoreanUI();
renderLatestPublications();
renderNotices();
renderResearch();
renderProjects();
renderActivities();
renderActivityDetail();
renderMembers();
renderAllPublications();
