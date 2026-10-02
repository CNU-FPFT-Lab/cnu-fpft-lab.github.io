document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('[data-research-list]');
  if(!root)return;
  const decode=async img=>{
    if(img.dataset.imageFixing==='1')return;
    const src=img.dataset.embeddedSvg||img.getAttribute('src')||'';
    if(!/\.svg(?:$|\?)/i.test(src))return;
    img.dataset.imageFixing='1';
    try{
      const r=await fetch(src,{cache:'no-store'});
      if(!r.ok)throw new Error(src);
      const text=await r.text();
      const doc=new DOMParser().parseFromString(text,'image/svg+xml');
      const node=doc.querySelector('image');
      const data=node?.getAttribute('href')||node?.getAttributeNS('http://www.w3.org/1999/xlink','href')||node?.getAttribute('xlink:href');
      if(!data||!data.startsWith('data:image/'))throw new Error('image data not found');
      img.src=data;
      img.removeAttribute('data-embedded-svg');
    }catch(e){
      img.src=src;
    }finally{
      delete img.dataset.imageFixing;
    }
  };
  const fix=()=>root.querySelectorAll('img[data-embedded-svg],img[src$=".svg"]').forEach(decode);
  fix();
  new MutationObserver(fix).observe(root,{childList:true,subtree:true});
});
