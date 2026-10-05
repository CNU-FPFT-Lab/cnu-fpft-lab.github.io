(() => {
  'use strict';

  const imageFiles = {
    processing: [
      'assets/image-data/processing-hq-01.b64',
      'assets/image-data/processing-hq-02.b64',
      'assets/image-data/processing-hq-03.b64',
      'assets/image-data/processing-hq-04.b64',
      'assets/image-data/processing-hq-05.b64',
      'assets/image-data/processing-hq-06.b64'
    ],
    foodtech: [
      'assets/image-data/foodtech-hq-01.b64',
      'assets/image-data/foodtech-hq-02.b64',
      'assets/image-data/foodtech-hq-03.b64',
      'assets/image-data/foodtech-hq-04.b64',
      'assets/image-data/foodtech-hq-05.b64',
      'assets/image-data/foodtech-hq-06.b64',
      'assets/image-data/foodtech-hq-07.b64'
    ]
  };

  const cache = {};
  async function loadImage(key) {
    if (!cache[key]) {
      cache[key] = Promise.all((imageFiles[key] || []).map(async path => {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) throw new Error(`${path} (${response.status})`);
        return (await response.text()).replace(/\s+/g, '');
      })).then(parts => `data:image/avif;base64,${parts.join('')}`);
    }
    return cache[key];
  }

  document.querySelectorAll('[data-home-research-key]').forEach(async img => {
    const key = img.dataset.homeResearchKey;
    try {
      img.src = await loadImage(key);
      img.classList.add('is-loaded');
    } catch (error) {
      console.error('Homepage research image load failed:', key, error);
      img.closest('.home-research-panel')?.classList.add('is-error');
    }
  });
})();
