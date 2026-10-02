// High-resolution Research infographic loader.
// Research image bytes are stored as text chunks to avoid binary corruption in the repository workflow.
const researchHiResFiles={
  processing:[
    'assets/image-data/processing-hi-1.b64',
    'assets/image-data/processing-hi-2.b64',
    'assets/image-data/processing-hi-3.b64'
  ],
  foodtech:[
    'assets/image-data/foodtech-hi-1.b64',
    'assets/image-data/foodtech-hi-2.b64',
    'assets/image-data/foodtech-hi-3.b64',
    'assets/image-data/foodtech-hi-4.b64'
  ]
};
const researchHiResCache={};
async function getResearchHiRes(key){
  const paths=researchHiResFiles[key];
  if(!paths)return '';
  if(!researchHiResCache[key]){
    researchHiResCache[key]=Promise.all(paths.map(async path=>{
      const r=await fetch(path,{cache:'no-store'});
      if(!r.ok)throw new Error(`${path} (${r.status})`);
      return (await r.text()).replace(/\s+/g,'');
    })).then(parts=>`data:image/webp;base64,${parts.join('')}`);
  }
  return researchHiResCache[key];
}
async function upgradeResearchImages(root=document){
  const images=[...root.querySelectorAll?.('img[data-image-key="processing"],img[data-image-key="foodtech"]')||[]];
  await Promise.all(images.map(async img=>{
    const key=img.dataset.imageKey;
    if(img.dataset.hiresLoaded==='true')return;
    try{
      const src=await getResearchHiRes(key);
      if(!src)return;
      img.src=src;
      img.dataset.hiresLoaded='true';
      img.decoding='async';
    }catch(e){console.error('High-resolution research image load failed',key,e);}
  }));
}
const researchHiResObserver=new MutationObserver(()=>upgradeResearchImages());
researchHiResObserver.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',()=>upgradeResearchImages());
upgradeResearchImages();
