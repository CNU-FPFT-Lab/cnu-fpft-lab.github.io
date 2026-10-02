document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('[data-research-list]');
  if(!root)return;
  const fix=()=>{
    root.querySelectorAll('img[data-embedded-svg]').forEach(img=>{
      const src=img.dataset.embeddedSvg||'';
      if(/\.(?:jpg|jpeg|png|webp)(?:$|\?)/i.test(src)){
        img.src=src;
        img.removeAttribute('data-embedded-svg');
      }
    });
  };
  fix();
  const observer=new MutationObserver(fix);
  observer.observe(root,{childList:true,subtree:true});
});
