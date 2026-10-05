(() => {
  'use strict';
  const target = document.querySelector('[data-home-research-canvas]');
  if (!target) return;

  const sources = [
    'assets/image-data/processing.b64',
    'assets/image-data/foodtech.b64'
  ];

  const readBase64 = async (path) => {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(path + ' (' + response.status + ')');
    return (await response.text()).replace(/\s+/g, '');
  };

  const loadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  Promise.all(sources.map(readBase64))
    .then(parts => Promise.all(parts.map(part => loadImage('data:image/webp;base64,' + part))))
    .then(([processing, foodtech]) => {
      const height = Math.max(processing.naturalHeight || processing.height, foodtech.naturalHeight || foodtech.height);
      const pw = Math.round((processing.naturalWidth || processing.width) * height / (processing.naturalHeight || processing.height));
      const fw = Math.round((foodtech.naturalWidth || foodtech.width) * height / (foodtech.naturalHeight || foodtech.height));

      const canvas = document.createElement('canvas');
      canvas.width = pw + fw;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(processing, 0, 0, pw, height);
      ctx.drawImage(foodtech, pw, 0, fw, height);

      target.src = canvas.toDataURL('image/jpeg', 0.9);
      target.classList.add('is-loaded');
    })
    .catch(error => {
      console.error('Homepage combined Research image failed:', error);
      target.classList.add('is-error');
    });
})();