document.documentElement.classList.add('js');
document.documentElement.lang='en';

const CNU_LOGO='https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_Chonnam_National_University.svg';
const button=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();

button?.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));
  nav?.classList.toggle('open',open);
  button.textContent=open?'Close':'Menu';
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true'){
    nav?.classList.remove('open');
    button.setAttribute('aria-expanded','false');
    button.textContent='Menu';
    button.focus();
  }
});
document.querySelectorAll('.nav-group > button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
document.querySelectorAll('.site-brand-logo').forEach(img=>img.src=CNU_LOGO);

function setText(selector,text){const el=document.querySelector(selector);if(el)el.textContent=text;}
function removeOne(selector){document.querySelector(selector)?.remove();}

function normalizeEnglishUI(){
  const titles={
    'index.html':'Food Processing and FoodTech Lab | Chonnam National University',
    'research.html':'Research | FPFT Lab',
    'members.html':'Members | FPFT Lab',
    'publications.html':'Research Outputs | FPFT Lab',
    'photos.html':'Activities | FPFT Lab',
    'activity.html':'Activity | FPFT Lab',
    'contact.html':'Contact | FPFT Lab'
  };
  if(titles[page])document.title=titles[page];
  if(button&&button.getAttribute('aria-expanded')!=='true')button.textContent='Menu';

  document.querySelectorAll('.site-brand-text strong').forEach(el=>el.textContent='Food Processing and FoodTech Lab');
  document.querySelectorAll('.site-brand-text em').forEach(el=>el.textContent='Chonnam National University');
  document.querySelectorAll('.site-brand-logo').forEach(img=>img.alt='Chonnam National University logo');

  document.querySelectorAll('.nav > a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('index.html'))a.textContent='Home';
    else if(href.endsWith('research.html'))a.textContent='Research';
    else if(href.endsWith('photos.html'))a.textContent='Activities';
    else if(href.endsWith('contact.html'))a.textContent='Contact';
  });
  const groups=document.querySelectorAll('.nav-group');
  if(groups[0])groups[0].querySelector(':scope > button').textContent='Members';
  if(groups[1])groups[1].querySelector(':scope > button').textContent='Research Outputs';
  document.querySelectorAll('.nav-sub a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('#pi'))a.textContent='Principal Investigator';
    else if(href.endsWith('#students'))a.textContent='Students';
    else if(href.endsWith('#papers'))a.textContent='Publications';
    else if(href.endsWith('#projects'))a.textContent='Research Projects';
    else if(href.endsWith('#patents'))a.textContent='Patents & Technology Transfer';
  });

  document.querySelectorAll('.site-footer strong').forEach(el=>el.textContent='Food Processing and FoodTech Lab');
  document.querySelectorAll('.site-footer .footer-cnu').forEach(el=>el.textContent='Department of Food Science and Technology · Chonnam National University');
  document.querySelectorAll('.site-footer .footer-cnu + p').forEach(el=>el.textContent='77 Yongbong-ro, Buk-gu, Gwangju 61186, Republic of Korea · Agricultural Building 3');
  document.querySelectorAll('.site-footer a[href="contact.html"]').forEach(el=>el.textContent='Contact →');

  if(page==='members.html'){
    removeOne('.page-hero .eyebrow');
    removeOne('.student-section .section-head .eyebrow');
    setText('.page-hero h1','Members');
    setText('.student-section .section-head h2','Students');
    const detailBlocks=document.querySelectorAll('.profile-details > div');
    if(detailBlocks[0])detailBlocks[0].innerHTML='<h2>Education</h2><ul><li>B.S. in Food Science and Biotechnology, Seoul National University</li><li>M.S. in Agricultural Biotechnology, Seoul National University</li><li>Ph.D. in Agricultural Biotechnology, Seoul National University</li></ul>';
    if(detailBlocks[1])detailBlocks[1].innerHTML='<h2>Experience</h2><ul><li><span>2025.03–Present</span> Assistant Professor, Department of Food Science and Technology, Chonnam National University</li><li><span>2023.08–2025.02</span> Postdoctoral Researcher, Smart Manufacturing Research Group, Korea Food Research Institute</li><li><span>2021.09–2023.07</span> Senior Researcher / Research Professor, Food Bio Convergence Institute, Seoul National University</li><li><span>2021.08–2022.08</span> Visiting Professor, Department of Food and Nutrition, Yonsei University</li><li><span>2019.03–2021.02</span> Lecturer, Department of Biofood Science and Technology, Sungshin Women\'s University</li></ul>';
  }else if(page==='photos.html'){
    removeOne('.activities-page-hero .eyebrow');
    setText('.activities-page-hero h1','Activities');
  }else if(page==='activity.html'){
    removeOne('.page-hero .eyebrow');
    setText('.page-hero h1','Activity');
  }else if(page==='contact.html'){
    removeOne('.page-hero .eyebrow');
    setText('.page-hero h1','Contact');
  }
}

async function getJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path} (${r.status})`);return r.json();}
function asItems(v){return Array.isArray(v)?v:(v&&Array.isArray(v.items)?v.items:[]);}
function showError(el){if(el)el.innerHTML='<div class="data-error">Unable to load data. Please try again shortly.</div>';}
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
    el.innerHTML=data.map(n=>`<article class="notice-row"><time>${escapeHTML(n.date||'')}</time><div class="notice-content"><h3>${escapeHTML(n.title||'')}</h3>${n.meta?`<p class="notice-meta">${escapeHTML(n.meta)}</p>`:''}${n.detail?`<p class="notice-detail">${lines(n.detail)}</p>`:''}${n.email?`<a class="notice-email" href="mailto:${escapeHTML(n.email)}">Apply / Contact · ${escapeHTML(n.email)}</a>`:''}</div></article>`).join('');
  }catch(e){showError(el);}
}

async function renderResearch(){
  const el=document.querySelector('[data-research-list]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/research.json'));
    el.innerHTML=data.map((r,i)=>{
      const summary=String(r.summary||'').trim();
      const flow=Array.isArray(r.flow)&&r.flow.length?`<div class="flow-line">${r.flow.map((x,j)=>`${j?'<i>→</i>':''}<span>${escapeHTML(typeof x==='string'?x:(x.step||''))}</span>`).join('')}</div>`:'';
      const overview=r.overview_figure?`<figure class="research-overview-figure"><img src="${escapeHTML(r.overview_figure)}" alt="${escapeHTML(r.title)} research overview" loading="lazy"></figure>`:'';
      const topics=(r.topics||[]).map(t=>`<article class="topic-card"><h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.detail)}</p></article>`).join('');
      const eng=String(r.title_en||'').trim()?`<p class="eng-title">${escapeHTML(r.title_en)}</p>`:'';
      return `<section class="research-block ${i===1?'theme-2':''}" id="${escapeHTML(r.id)}"><div class="research-block-grid"><div class="research-number">${escapeHTML(r.number)}</div><div><h2>${escapeHTML(r.title)}</h2>${eng}${summary?`<p class="research-summary">${escapeHTML(summary)}</p>`:''}${flow}${overview}<div class="topic-grid">${topics}</div></div></div></section>`;
    }).join('');
  }catch(e){showError(el);}
}

const courseEN={'M.S.':'M.S. Students','Ph.D.':'Ph.D. Students','B.S.–M.S. Integrated':'B.S.–M.S. Integrated Students','Undergraduate Researcher':'Undergraduate Researchers','Alumni':'Alumni','석사 과정':'M.S. Students','박사 과정':'Ph.D. Students','학·석사 연계과정':'B.S.–M.S. Integrated Students','학부연구생':'Undergraduate Researchers','졸업생':'Alumni'};
const courseLabelEN={'M.S.':'M.S. Student','Ph.D.':'Ph.D. Student','B.S.–M.S. Integrated':'B.S.–M.S. Integrated Student','Undergraduate Researcher':'Undergraduate Researcher','Alumni':'Alumni','석사 과정':'M.S. Student','박사 과정':'Ph.D. Student','학·석사 연계과정':'B.S.–M.S. Integrated Student','학부연구생':'Undergraduate Researcher','졸업생':'Alumni'};
function fallbackStudentPhoto(name){const node=[...document.querySelectorAll('[data-student-photo]')].find(img=>img.dataset.studentPhoto===name);return node?.getAttribute('src')||'';}
async function renderMembers(){
  const piEl=document.querySelector('[data-pi]'),studentsEl=document.querySelector('[data-students]');if(!piEl&&!studentsEl)return;
  try{
    const data=await getJSON('data/members.json');
    if(piEl){
      const p=data.pi,intro=String(p.intro||'').trim();
      const photo=p.photo||'assets/eunghee-kim.jpg';
      piEl.innerHTML=`<img src="${escapeHTML(photo)}" alt="${escapeHTML(p.name_en||p.name)}" onerror="this.onerror=null;this.src='assets/eunghee-kim.jpg';"><div><p class="eyebrow">Principal Investigator</p><h2>${escapeHTML(p.name_en||p.name)}${p.name?` <span>${escapeHTML(p.name)}</span>`:''}</h2><p class="prof-role">${escapeHTML(p.role)}</p>${intro?`<p>${escapeHTML(intro)}</p>`:''}<div class="profile-links"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)} ↗</a><a href="tel:+82625302147">${escapeHTML(p.phone)}</a><span>${escapeHTML(p.office)}</span></div></div>`;
    }
    if(studentsEl){
      const groups={};(data.students||[]).forEach(s=>(groups[s.course]||=[]).push(s));
      studentsEl.innerHTML=Object.entries(groups).map(([course,items])=>`<h2 class="member-group-title">${escapeHTML(courseEN[course]||course)}</h2><div class="student-list">${items.map(s=>{const photo=s.photo||fallbackStudentPhoto(s.name),courseLabel=courseLabelEN[course]||course;return `<article class="student-row">${photo?`<img class="student-portrait" src="${photo}" alt="${escapeHTML(s.name_en||s.name)}" loading="lazy">`:`<div class="student-portrait student-portrait-fallback">${escapeHTML((s.name_en||s.name).slice(0,1))}</div>`}<div class="student-info"><p class="eyebrow">${escapeHTML(courseLabel)}</p><h3>${escapeHTML(s.name_en||s.name)}${s.name?` <span>${escapeHTML(s.name)}</span>`:''}</h3><a href="mailto:${escapeHTML(s.email)}">${escapeHTML(s.email)}</a></div></article>`;}).join('')}</div>`).join('');
    }
  }catch(e){showError(piEl||studentsEl);}
}

async function renderProjects(){
  const el=document.querySelector('[data-projects]');if(!el)return;
  try{
    const rank={'Current':0,'Upcoming':1,'Completed':2,'수행 중':0,'예정':1,'완료':2};
    const data=asItems(await getJSON('data/projects.json')).sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9));
    el.innerHTML=data.map(p=>`<article class="project-row"><div class="project-status ${['Completed','완료'].includes(p.status)?'is-past':''}">${escapeHTML(p.status||'')}</div><div class="project-main"><p class="project-program">${escapeHTML(p.program||'Research Project')}</p><h3>${escapeHTML(p.title)}</h3>${p.detail?`<p class="project-detail">${escapeHTML(p.detail)}</p>`:''}</div><dl class="project-meta"><div><dt>Period</dt><dd>${escapeHTML(p.period||'—')}</dd></div><div><dt>Role</dt><dd>${escapeHTML(p.role||'—')}</dd></div></dl></article>`).join('');
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
    if(!item){el.innerHTML='<p class="data-error">Activity not found.</p>';return;}
    el.innerHTML=`<article class="activity-detail"><a class="activity-back" href="photos.html">← Back to Activities</a><img class="activity-detail-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"><div class="activity-detail-copy"><p class="eyebrow">${escapeHTML(item.type||'Activity')}</p><h2>${escapeHTML(item.title)}</h2><dl class="activity-detail-meta"><div><dt>Period</dt><dd>${escapeHTML(item.date||'—')}</dd></div>${item.location?`<div><dt>Location</dt><dd>${escapeHTML(item.location)}</dd></div>`:''}</dl>${item.detail?`<div class="activity-detail-body"><h3>Details</h3><p>${lines(item.detail)}</p></div>`:''}</div></article>`;
  }catch(e){showError(el);}
}

async function renderAllPublications(){
  const el=document.querySelector('[data-publications]');if(!el)return;
  const search=document.querySelector('#publication-search'),year=document.querySelector('#publication-year'),count=document.querySelector('#publication-count');
  try{
    const data=asItems(await getJSON('data/publications.json')).map(x=>parsePublication(typeof x==='string'?x:(x.entry||'')));
    const years=[...new Set(data.map(x=>x.year).filter(Boolean))];
    if(year)year.innerHTML='<option value="all">All years</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    const draw=()=>{
      const q=(search?.value||'').trim().toLowerCase(),y=year?.value||'all';
      const filtered=data.filter(p=>(y==='all'||p.year===y)&&(!q||p.raw.toLowerCase().includes(q))),groups={};
      filtered.forEach(p=>(groups[p.year||'Other']||=[]).push(p));
      el.innerHTML=Object.entries(groups).map(([yr,items])=>`<section class="publication-year"><h2>${escapeHTML(yr)}</h2><div>${items.map(p=>`<article class="publication"><span class="pub-number">${escapeHTML(p.num.padStart(2,'0'))}</span><div><h3>${escapeHTML(p.title)}</h3><p class="authors">${escapeHTML(p.authors)}</p><p class="journal">${escapeHTML(p.journal)}</p></div></article>`).join('')}</div></section>`).join('');
      if(count)count.textContent=`${filtered.length} papers`;
    };
    search?.addEventListener('input',draw);year?.addEventListener('change',draw);draw();
  }catch(e){showError(el);}
}

normalizeEnglishUI();
renderLatestPublications();
renderNotices();
renderResearch();
renderProjects();
renderActivities();
renderActivityDetail();
renderMembers();
renderAllPublications();
