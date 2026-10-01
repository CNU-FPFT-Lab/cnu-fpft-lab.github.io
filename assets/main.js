document.documentElement.classList.add('js');

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
document.querySelectorAll('a[href$="#patents"]').forEach(a=>a.remove());
document.querySelectorAll('.site-brand-logo').forEach(img=>img.src=CNU_LOGO);

function setText(selector,text){const el=document.querySelector(selector);if(el)el.textContent=text;}
function translateInterface(){
  if(button&&button.getAttribute('aria-expanded')!=='true') button.textContent='Menu';
  document.querySelectorAll('.nav > a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('index.html')) a.textContent='Home';
    else if(href.endsWith('research.html')) a.textContent='Research';
    else if(href.endsWith('photos.html')) a.textContent='Photos';
    else if(href.endsWith('contact.html')) a.textContent='Contact';
  });
  const groups=document.querySelectorAll('.nav-group');
  if(groups[0]) groups[0].querySelector(':scope > button').textContent='Members';
  if(groups[1]) groups[1].querySelector(':scope > button').textContent='Publications';
  document.querySelectorAll('.nav-sub a').forEach(a=>{
    const href=a.getAttribute('href')||'';
    if(href.endsWith('#pi')) a.textContent='Principal Investigator';
    else if(href.endsWith('#students')) a.textContent='Graduate Students';
    else if(href.endsWith('#papers')) a.textContent='Papers';
    else if(href.endsWith('#projects')) a.textContent='Projects';
  });

  if(page==='index.html'){
    setText('.home-notice-section .section-head .eyebrow','Updates');
    setText('.home-notice-section .section-head h2','Notice');
    setText('.home-research-section .section-head .eyebrow','Research Areas');
    const previews=document.querySelectorAll('.research-preview h3');
    if(previews[0]) previews[0].textContent='Food Processing';
    if(previews[1]) previews[1].textContent='FoodTech';
    const researchMore=document.querySelector('.home-research-section .more-link');
    if(researchMore) researchMore.textContent='View Research →';
    const lastSection=document.querySelector('main > section.soft');
    if(lastSection){
      const eyebrow=lastSection.querySelector('.eyebrow'); if(eyebrow) eyebrow.textContent='Research Outputs';
      const h2=lastSection.querySelector('h2'); if(h2) h2.textContent='Recent Publications';
      const more=lastSection.querySelector('.more-link'); if(more) more.textContent='View all publications →';
    }
  }else if(page==='research.html'){
    setText('.research-page-hero .eyebrow','Research');
    setText('.research-page-hero h1','Research');
  }else if(page==='members.html'){
    setText('.page-hero .eyebrow','People');
    setText('.page-hero h1','Members');
    const detailHeads=document.querySelectorAll('.profile-details h2');
    if(detailHeads[0]) detailHeads[0].textContent='Education';
    if(detailHeads[1]) detailHeads[1].textContent='Experience';
    setText('.student-section .section-head .eyebrow','Students');
    setText('.student-section .section-head h2','Graduate Students');
  }else if(page==='publications.html'){
    setText('.page-hero .eyebrow','Research Outputs');
    setText('.page-hero h1','Publications');
    const tabs=document.querySelectorAll('.output-tabs a');
    if(tabs[0]) tabs[0].textContent='Papers';
    if(tabs[1]) tabs[1].textContent='Projects';
    setText('#papers .section-head .eyebrow','01 / Papers');
    setText('#papers .section-head h2','Papers');
    setText('#projects .section-head .eyebrow','02 / Projects');
    setText('#projects .section-head h2','Research Projects');
    const search=document.querySelector('#publication-search'); if(search) search.placeholder='Search title · author · journal';
  }else if(page==='photos.html'){
    setText('.activities-page-hero .eyebrow','Activities');
    setText('.activities-page-hero h1','Photos');
  }else if(page==='contact.html'){
    setText('.page-hero .eyebrow','Contact');
    setText('.page-hero h1','Contact');
    const cards=document.querySelectorAll('.contact-card .eyebrow');
    if(cards[0]) cards[0].textContent='Contact';
    if(cards[1]) cards[1].textContent='Location';
    const loc=document.querySelector('.section .section-head .eyebrow'); if(loc) loc.textContent='Location';
    const locH=document.querySelector('.section .section-head h2'); if(locH) locH.textContent='College of Agriculture & Life Sciences · Building 3';
    const mapLink=document.querySelector('.section .more-link'); if(mapLink) mapLink.textContent='Open in Google Maps →';
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
    el.innerHTML=data.slice(0,3).map(item=>{const p=parsePublication(item);return `<article class="pub-row"><div class="pub-year">${escapeHTML(p.year)}</div><div><h3 class="pub-title">${escapeHTML(p.title)}</h3><p class="pub-authors">${escapeHTML(p.authors)}</p></div><div class="pub-journal">${escapeHTML(p.journal)}</div></article>`;}).join('');
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
      const topics=(r.topics||[]).map(t=>{
        const figure=t.figure?`<div class="topic-figure"><img src="${escapeHTML(t.figure)}" alt="${escapeHTML(t.title)} research figure" loading="lazy"></div>`:'';
        return `<article class="topic-card">${figure}<h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.detail)}</p></article>`;
      }).join('');
      return `<section class="research-block ${i===1?'theme-2':''}" id="${escapeHTML(r.id)}"><div class="research-block-grid"><div class="research-number">${escapeHTML(r.number)}</div><div><h2>${escapeHTML(r.title)}</h2><p class="eng-title">${escapeHTML(r.title_en)}</p>${summary?`<p class="research-summary">${escapeHTML(summary)}</p>`:''}${flow}${overview}<div class="topic-grid">${topics}</div></div></div></section>`;
    }).join('');
  }catch(e){showError(el);}
}

const courseEN={'석사 과정':'Master’s Program','박사 과정':'Ph.D. Program','학·석사 연계과정':'Combined B.S.–M.S. Program','학부연구생':'Undergraduate Researcher','졸업생':'Alumni'};
function fallbackStudentPhoto(name){const node=[...document.querySelectorAll('[data-student-photo]')].find(img=>img.dataset.studentPhoto===name);return node?.getAttribute('src')||'';}
async function renderMembers(){
  const piEl=document.querySelector('[data-pi]'),studentsEl=document.querySelector('[data-students]');if(!piEl&&!studentsEl)return;
  try{
    const data=await getJSON('data/members.json');
    if(piEl){
      const p=data.pi,intro=String(p.intro||'').trim();
      piEl.innerHTML=`<img src="${escapeHTML(p.photo||'assets/eunghee-kim-new.svg')}" alt="${escapeHTML(p.name_en||p.name)}"><div><p class="eyebrow">Principal Investigator</p><h2>${escapeHTML(p.name)} <span>${escapeHTML(p.name_en)}</span></h2><p class="prof-role">${escapeHTML(p.role)}</p>${intro?`<p>${escapeHTML(intro)}</p>`:''}<div class="profile-links"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)} ↗</a><a href="tel:+82625302147">${escapeHTML(p.phone)}</a><span>${escapeHTML(p.office)}</span></div></div>`;
    }
    if(studentsEl){
      const groups={};(data.students||[]).forEach(s=>(groups[s.course]||=[]).push(s));
      studentsEl.innerHTML=Object.entries(groups).map(([course,items])=>`<h2 class="member-group-title">${escapeHTML(courseEN[course]||course)}</h2><div class="student-list">${items.map(s=>{const photo=s.photo||fallbackStudentPhoto(s.name),courseLabel=courseEN[course]||course;return `<article class="student-row">${photo?`<img class="student-portrait" src="${photo}" alt="${escapeHTML(s.name_en||s.name)}" loading="lazy">`:`<div class="student-portrait student-portrait-fallback">${escapeHTML(s.name.slice(0,1))}</div>`}<div class="student-info"><p class="eyebrow">${escapeHTML(courseLabel)}</p><h3>${escapeHTML(s.name)} <span>${escapeHTML(s.name_en)}</span></h3><a href="mailto:${escapeHTML(s.email)}">${escapeHTML(s.email)}</a></div></article>`;}).join('')}</div>`).join('');
    }
  }catch(e){showError(piEl||studentsEl);}
}

const statusEN={'수행 중':'Current','예정':'Upcoming','완료':'Completed'};
async function renderProjects(){
  const el=document.querySelector('[data-projects]');if(!el)return;
  try{
    const rank={'수행 중':0,'예정':1,'완료':2};
    const data=asItems(await getJSON('data/projects.json')).sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9));
    el.innerHTML=data.map(p=>`<article class="project-row"><div class="project-status ${p.status==='완료'?'is-past':''}">${escapeHTML(statusEN[p.status]||p.status||'')}</div><div class="project-main"><p class="project-program">${escapeHTML(p.program||'Research Project')}</p><h3>${escapeHTML(p.title)}</h3>${p.detail?`<p class="project-detail">${escapeHTML(p.detail)}</p>`:''}</div><dl class="project-meta"><div><dt>Period</dt><dd>${escapeHTML(p.period||'—')}</dd></div><div><dt>Role</dt><dd>${escapeHTML(p.role||'—')}</dd></div></dl></article>`).join('');
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
    if(!item&&/^\d+$/.test(id)) item=data[Number(id)];
    if(!item){el.innerHTML='<p class="data-error">Activity not found.</p>';return;}
    el.innerHTML=`<article class="activity-detail"><a class="activity-back" href="photos.html">← Back to Photos</a><img class="activity-detail-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"><div class="activity-detail-copy"><p class="eyebrow">${escapeHTML(item.type||'Activity')}</p><h2>${escapeHTML(item.title)}</h2><dl class="activity-detail-meta"><div><dt>Period</dt><dd>${escapeHTML(item.date||'—')}</dd></div>${item.location?`<div><dt>Location</dt><dd>${escapeHTML(item.location)}</dd></div>`:''}</dl>${item.detail?`<div class="activity-detail-body"><h3>Details</h3><p>${lines(item.detail)}</p></div>`:''}</div></article>`;
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

translateInterface();
renderLatestPublications();
renderNotices();
renderResearch();
renderProjects();
renderActivities();
renderActivityDetail();
renderMembers();
renderAllPublications();
