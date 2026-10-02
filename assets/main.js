document.documentElement.classList.add('js');

const button=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
button?.addEventListener('click',()=>{
  const open=button.getAttribute('aria-expanded')!=='true';
  button.setAttribute('aria-expanded',String(open));
  nav?.classList.toggle('open',open);
  button.textContent=open?'닫기':'Menu';
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true'){
    nav?.classList.remove('open');
    button.setAttribute('aria-expanded','false');
    button.textContent='Menu';
  }
});
document.querySelectorAll('.nav-group > button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));

// Keep the visible lab identity consistent across all pages.
document.querySelectorAll('.site-brand-text strong').forEach(el=>el.textContent='Food Processing and FoodTech Lab');
document.querySelectorAll('.site-brand-text em').forEach(el=>el.textContent='Chonnam National University');
document.querySelectorAll('.site-footer strong,.footer strong').forEach(el=>el.textContent='식품가공및푸드테크연구실');
const homeTitle=document.querySelector('.home-hero h1');
if(homeTitle)homeTitle.textContent='식품가공및푸드테크연구실';
document.querySelector('.home-keywords')?.remove();

async function getJSON(path){
  const r=await fetch(path,{cache:'no-store'});
  if(!r.ok)throw new Error(`${path} (${r.status})`);
  return r.json();
}
function asItems(v){return Array.isArray(v)?v:(v&&Array.isArray(v.items)?v.items:[]);}
function showError(el){if(el)el.innerHTML='<div class="data-error">데이터를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</div>';}
function escapeHTML(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function lines(v=''){return escapeHTML(v).replace(/\n/g,'<br>');}

// Legacy image fallback. Newly uploaded images should be ordinary PNG/JPG/WebP/AVIF
// files referenced from JSON. These base64 assets are kept only so the current
// research infographics and PI portrait continue to work until they are replaced.
const imageDataFiles={
  processing:[
    'assets/image-data/processing-hq-01.b64',
    'assets/image-data/processing-hq-02.b64',
    'assets/image-data/processing-hq-03.b64',
    'assets/image-data/processing-hq-04.b64',
    'assets/image-data/processing-hq-05.b64',
    'assets/image-data/processing-hq-06.b64'
  ],
  foodtech:[
    'assets/image-data/foodtech-hq-01.b64',
    'assets/image-data/foodtech-hq-02.b64',
    'assets/image-data/foodtech-hq-03.b64',
    'assets/image-data/foodtech-hq-04.b64',
    'assets/image-data/foodtech-hq-05.b64',
    'assets/image-data/foodtech-hq-06.b64',
    'assets/image-data/foodtech-hq-07.b64'
  ],
  pi:['assets/image-data/pi.b64']
};
const imageMime={processing:'image/avif',foodtech:'image/avif',pi:'image/webp'};
const imageDataCache={};
const transparentPixel='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

async function getImageData(key){
  const files=imageDataFiles[key];
  if(!files)throw new Error(`Unknown image key: ${key}`);
  if(!imageDataCache[key]){
    const list=Array.isArray(files)?files:[files];
    imageDataCache[key]=Promise.all(list.map(async path=>{
      const r=await fetch(path,{cache:'no-store'});
      if(!r.ok)throw new Error(`${path} (${r.status})`);
      return (await r.text()).replace(/\s+/g,'');
    })).then(parts=>{
      const data=parts.join('');
      if(!data)throw new Error(`Empty image data: ${key}`);
      return `data:${imageMime[key]||'image/webp'};base64,${data}`;
    });
  }
  return imageDataCache[key];
}

function isDirectImagePath(src=''){
  const value=String(src||'').trim();
  return Boolean(value)&&!value.startsWith('data:');
}

async function resolveManagedImage(src,fallbackKey=''){
  if(isDirectImagePath(src))return String(src).trim();
  if(fallbackKey){
    try{return await getImageData(fallbackKey);}
    catch(e){console.error('Fallback image load failed',fallbackKey,e);}
  }
  return src||transparentPixel;
}

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
    el.innerHTML=data.slice(0,3).map(item=>{
      const p=parsePublication(typeof item==='string'?item:(item.entry||''));
      return `<article class="pub-row"><div class="pub-year">${escapeHTML(p.year)}</div><div><h3 class="pub-title">${escapeHTML(p.title)}</h3><p class="pub-authors">${escapeHTML(p.authors)}</p></div><div class="pub-journal">${escapeHTML(p.journal)}</div></article>`;
    }).join('');
  }catch(e){showError(el);}
}

async function renderNotices(){
  const el=document.querySelector('[data-notices]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/notices.json'));
    if(!data.length){el.innerHTML='';return;}
    el.innerHTML=data.map(n=>`<article class="notice-row"><time>${escapeHTML(n.date||'')}</time><div class="notice-content"><h3>${escapeHTML(n.title||'')}</h3>${n.meta?`<p class="notice-meta">${escapeHTML(n.meta)}</p>`:''}${n.detail?`<p class="notice-detail">${lines(n.detail)}</p>`:''}${n.email?`<a class="notice-email" href="mailto:${escapeHTML(n.email)}">신청 / 문의 · ${escapeHTML(n.email)}</a>`:''}</div></article>`).join('');
  }catch(e){showError(el);}
}

async function renderResearch(){
  const el=document.querySelector('[data-research-list]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/research.json'));
    const prepared=await Promise.all(data.map(async r=>{
      const fallbackKey=r.id==='processing'?'processing':r.id==='foodtech'?'foodtech':'';
      const overviewSrc=await resolveManagedImage(r.overview_figure,fallbackKey);
      return {...r,overviewSrc};
    }));
    el.innerHTML=prepared.map((r,i)=>{
      const overview=r.overviewSrc?`<figure class="research-overview-figure"><img class="media-contain" src="${escapeHTML(r.overviewSrc)}" alt="${escapeHTML(r.title)} 연구 개요" loading="eager" decoding="async"></figure>`:'';
      const topics=(r.topics||[]).map(t=>{
        const figure=t.figure?`<figure class="topic-figure"><img class="media-contain" src="${escapeHTML(t.figure)}" alt="${escapeHTML(t.title)}" loading="lazy" decoding="async"></figure>`:'';
        return `<article class="topic-card">${figure}<h3>${escapeHTML(t.title)}</h3><p>${escapeHTML(t.detail)}</p></article>`;
      }).join('');
      return `<section class="research-block ${i===1?'theme-2':''}" id="${escapeHTML(r.id)}"><div class="research-block-grid"><div class="research-number">${escapeHTML(r.number)}</div><div><h2>${escapeHTML(r.title)}</h2>${overview}<div class="topic-grid">${topics}</div></div></div></section>`;
    }).join('');
  }catch(e){showError(el);}
}

const courseEN={
  'M.S.':'M.S. Students','석사 과정':'M.S. Students',
  'Ph.D.':'Ph.D. Students','박사 과정':'Ph.D. Students',
  'B.S.–M.S. Integrated':'B.S.–M.S. Integrated Students','학·석사 연계과정':'B.S.–M.S. Integrated Students',
  'Undergraduate Researcher':'Undergraduate Researchers','학부연구생':'Undergraduate Researchers',
  'Alumni':'Alumni','졸업생':'Alumni'
};
const courseLabelEN={
  'M.S.':'M.S. Student','석사 과정':'M.S. Student',
  'Ph.D.':'Ph.D. Student','박사 과정':'Ph.D. Student',
  'B.S.–M.S. Integrated':'B.S.–M.S. Integrated Student','학·석사 연계과정':'B.S.–M.S. Integrated Student',
  'Undergraduate Researcher':'Undergraduate Researcher','학부연구생':'Undergraduate Researcher',
  'Alumni':'Alumni','졸업생':'Alumni'
};
function fallbackStudentPhoto(name){
  const node=[...document.querySelectorAll('[data-student-photo]')].find(img=>img.dataset.studentPhoto===name);
  return node?.getAttribute('src')||'';
}

async function renderMembers(){
  const piEl=document.querySelector('[data-pi]'),studentsEl=document.querySelector('[data-students]');if(!piEl&&!studentsEl)return;
  try{
    const data=await getJSON('data/members.json');
    if(piEl){
      const p=data.pi;
      const piPhoto=await resolveManagedImage(p.photo,'pi');
      piEl.innerHTML=`<img class="media-cover profile-photo" src="${escapeHTML(piPhoto)}" alt="${escapeHTML(p.name_en||p.name)}" loading="eager" decoding="async"><div><p class="eyebrow">Principal Investigator</p><h2>${escapeHTML(p.name_en||p.name)}${p.name?` <span>${escapeHTML(p.name)}</span>`:''}</h2><p class="prof-role">${escapeHTML(p.role)}</p><div class="profile-links"><a href="mailto:${escapeHTML(p.email)}">${escapeHTML(p.email)} ↗</a><a href="tel:+82625302147">${escapeHTML(p.phone)}</a><span>${escapeHTML(p.office)}</span></div></div>`;
    }
    if(studentsEl){
      const groups={};(data.students||[]).forEach(s=>(groups[s.course]||=[]).push(s));
      studentsEl.innerHTML=Object.entries(groups).map(([course,items])=>`<h2 class="member-group-title">${escapeHTML(courseEN[course]||course)}</h2><div class="student-list">${items.map(s=>{
        const photo=s.photo||fallbackStudentPhoto(s.name);
        return `<article class="student-row">${photo?`<img class="student-portrait media-cover" src="${escapeHTML(photo)}" alt="${escapeHTML(s.name_en||s.name)}" loading="lazy" decoding="async">`:`<div class="student-portrait student-portrait-fallback">${escapeHTML((s.name_en||s.name).slice(0,1))}</div>`}<div class="student-info"><p class="eyebrow">${escapeHTML(courseLabelEN[course]||course)}</p><h3>${escapeHTML(s.name_en||s.name)}${s.name?` <span>${escapeHTML(s.name)}</span>`:''}</h3><a href="mailto:${escapeHTML(s.email)}">${escapeHTML(s.email)}</a></div></article>`;
      }).join('')}</div>`).join('');
    }
  }catch(e){showError(piEl||studentsEl);}
}

async function renderProjects(){
  const el=document.querySelector('[data-projects]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/projects.json'));
    el.innerHTML=data.map(p=>`<article class="project-entry"><h3>${escapeHTML(p.title)}</h3><dl class="project-facts"><div><dt>지원기관</dt><dd>${escapeHTML(p.agency||'—')}</dd></div><div><dt>지원사업</dt><dd>${escapeHTML(p.program||'—')}</dd></div><div><dt>지원기간</dt><dd>${escapeHTML(p.period||'—')}</dd></div><div><dt>참여형태</dt><dd>${escapeHTML(p.role||p.participation||'—')}</dd></div></dl></article>`).join('');
  }catch(e){showError(el);}
}

async function renderActivities(){
  const el=document.querySelector('[data-activities]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/activities.json'));
    el.innerHTML=data.map((a,i)=>{
      const id=a.id||String(i);
      return `<article class="activity-card"><a class="activity-card-link" href="activity.html?id=${encodeURIComponent(id)}"><img class="media-cover" src="${escapeHTML(a.image)}" alt="${escapeHTML(a.title)}" loading="lazy" decoding="async"><div class="activity-card-title"><h2>${escapeHTML(a.title)}</h2></div></a></article>`;
    }).join('');
  }catch(e){showError(el);}
}

async function renderActivityDetail(){
  const el=document.querySelector('[data-activity-detail]');if(!el)return;
  try{
    const data=asItems(await getJSON('data/activities.json'));
    const id=new URLSearchParams(location.search).get('id')||'';
    let item=data.find(a=>String(a.id)===id);if(!item&&/^\d+$/.test(id))item=data[Number(id)];
    if(!item){el.innerHTML='<p class="data-error">해당 활동을 찾을 수 없습니다.</p>';return;}
    el.innerHTML=`<article class="activity-detail"><a class="activity-back" href="photos.html">← Activities</a><img class="activity-detail-image media-contain" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="eager" decoding="async"><div class="activity-detail-copy"><p class="eyebrow">${escapeHTML(item.type||'연구실 활동')}</p><h2>${escapeHTML(item.title)}</h2><dl class="activity-detail-meta"><div><dt>기간</dt><dd>${escapeHTML(item.date||'—')}</dd></div>${item.location?`<div><dt>장소</dt><dd>${escapeHTML(item.location)}</dd></div>`:''}</dl>${item.detail?`<div class="activity-detail-body"><h3>내용</h3><p>${lines(item.detail)}</p></div>`:''}</div></article>`;
  }catch(e){showError(el);}
}

async function renderAllPublications(){
  const el=document.querySelector('[data-publications]');if(!el)return;
  const search=document.querySelector('#publication-search'),year=document.querySelector('#publication-year');
  try{
    const data=asItems(await getJSON('data/publications.json')).map(x=>parsePublication(typeof x==='string'?x:(x.entry||'')));
    const years=[...new Set(data.map(x=>x.year).filter(Boolean))];
    if(year)year.innerHTML='<option value="all">All years</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    const draw=()=>{
      const q=(search?.value||'').trim().toLowerCase(),y=year?.value||'all';
      const filtered=data.filter(p=>(y==='all'||p.year===y)&&(!q||p.raw.toLowerCase().includes(q))),groups={};
      filtered.forEach(p=>(groups[p.year||'Other']||=[]).push(p));
      el.innerHTML=Object.entries(groups).map(([yr,items])=>`<section class="publication-year"><h2>${escapeHTML(yr)}</h2><div>${items.map(p=>`<article class="publication"><span class="pub-number">${escapeHTML(p.num.padStart(2,'0'))}</span><div><h3>${escapeHTML(p.title)}</h3><p class="authors">${escapeHTML(p.authors)}</p><p class="journal">${escapeHTML(p.journal)}</p></div></article>`).join('')}</div></section>`).join('');
    };
    search?.addEventListener('input',draw);year?.addEventListener('change',draw);draw();
  }catch(e){showError(el);}
}

document.addEventListener('error',e=>{
  if(e.target instanceof HTMLImageElement)e.target.classList.add('image-load-error');
},true);

renderLatestPublications();
renderNotices();
renderResearch();
renderProjects();
renderActivities();
renderActivityDetail();
renderMembers();
renderAllPublications();