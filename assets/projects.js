document.addEventListener('DOMContentLoaded',async()=>{
  const el=document.querySelector('#project-list-conventional');
  if(!el)return;
  const escapeHTML=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    const r=await fetch('data/projects.json',{cache:'no-store'});
    if(!r.ok)throw new Error(`projects.json (${r.status})`);
    const json=await r.json();
    const data=Array.isArray(json)?json:(Array.isArray(json.items)?json.items:[]);
    const rank={'수행 중':0,'예정':1,'완료':2};
    data.sort((a,b)=>(rank[a.status]??9)-(rank[b.status]??9));
    el.innerHTML=data.map(p=>`
      <article class="project-entry">
        <div class="project-entry-head">
          <span class="project-status ${p.status==='완료'?'is-past':''}">${escapeHTML(p.status||'')}</span>
          <h3>${escapeHTML(p.title||'')}</h3>
        </div>
        <dl class="project-facts">
          <div><dt>지원기관</dt><dd>${escapeHTML(p.agency||'—')}</dd></div>
          <div><dt>지원사업</dt><dd>${escapeHTML(p.program||'—')}</dd></div>
          <div><dt>지원기간</dt><dd>${escapeHTML(p.period||'—')}</dd></div>
          <div><dt>참여구분</dt><dd>${escapeHTML(p.participation||'—')}</dd></div>
          <div><dt>수행역할</dt><dd>${escapeHTML(p.role||'—')}</dd></div>
        </dl>
      </article>`).join('');
  }catch(e){
    el.innerHTML='<p class="data-error">연구과제 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</p>';
  }
});
