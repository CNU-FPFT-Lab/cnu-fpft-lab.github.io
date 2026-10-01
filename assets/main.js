document.documentElement.classList.add('js');
const button = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
button?.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  button.textContent = open ? '닫기' : '메뉴';
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') {
    nav.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '메뉴';
    button.focus();
  }
});

// 공통 메뉴를 한국어로 통일하고 교육 페이지는 메뉴에서 제외한다.
const navLabels = {
  'index.html': '홈',
  'research.html': '연구',
  'members.html': '구성원',
  'publications.html': '연구성과',
  'photos.html': '연구실 활동',
  'contact.html': '문의·오시는 길'
};
document.querySelectorAll('#navigation a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === 'education.html') {
    link.remove();
    return;
  }
  if (navLabels[href]) link.textContent = navLabels[href];
});

const path = location.pathname;

// 구성원
if (path.endsWith('/members.html') || path.endsWith('members.html')) {
  const pageEyebrow = document.querySelector('.page-head .eyebrow');
  const pageTitle = document.querySelector('.page-head h1');
  const pageLead = document.querySelector('.page-head .lead');
  if (pageEyebrow) pageEyebrow.textContent = '구성원';
  if (pageTitle) pageTitle.textContent = '구성원';
  if (pageLead) pageLead.textContent = 'FPFT Lab 연구진 및 학생 구성원';

  const piEyebrow = document.querySelector('.professor .eyebrow');
  if (piEyebrow) piEyebrow.textContent = '연구책임자';
  const profParas = document.querySelectorAll('.professor > div > p');
  if (profParas.length >= 3) {
    profParas[2].textContent = '식품가공과 품질공학을 기반으로 식품의 물성·유변학·향·분광·영상 데이터를 측정하고, 데이터 기반 품질 분석과 예측 연구를 수행합니다.';
  }
  const detailHeads = document.querySelectorAll('.profile-details h2');
  if (detailHeads[0]) detailHeads[0].textContent = '학력';
  if (detailHeads[1]) detailHeads[1].textContent = '경력';
  const studentEyebrow = document.querySelector('.student-section .section-head .eyebrow');
  const studentTitle = document.querySelector('.student-section .section-head h2');
  if (studentEyebrow) studentEyebrow.textContent = '구성원';
  if (studentTitle) studentTitle.textContent = '대학원생';
}

// 연구성과
if (path.endsWith('/publications.html') || path.endsWith('publications.html')) {
  document.title = '연구성과 | CNU FPFT Lab';
  const pageEyebrow = document.querySelector('.page-head .eyebrow');
  const pageTitle = document.querySelector('.page-head h1');
  const pageLead = document.querySelector('.page-head .compact-lead');
  if (pageEyebrow) pageEyebrow.textContent = '연구성과';
  if (pageTitle) pageTitle.textContent = '연구성과';
  if (pageLead) pageLead.textContent = '논문 · 연구과제 · 특허·기술이전';

  const outputNav = document.querySelectorAll('.output-nav a');
  if (outputNav[0]) outputNav[0].textContent = '논문';
  if (outputNav[1]) outputNav[1].textContent = '연구과제';
  if (outputNav[2]) outputNav[2].textContent = '특허·기술이전';

  const papers = document.querySelector('#papers');
  if (papers) {
    const eyebrow = papers.querySelector('.output-section-head .eyebrow');
    const h2 = papers.querySelector('.output-section-head h2');
    const desc = papers.querySelector('.output-section-head > p');
    if (eyebrow) eyebrow.textContent = '01 / 논문';
    if (h2) h2.textContent = '논문';
    if (desc) desc.remove();
    const yearLabel = papers.querySelector('label[for="publication-year"]');
    if (yearLabel) yearLabel.textContent = '연도';
    const allOption = papers.querySelector('#publication-year option[value="all"]');
    if (allOption) allOption.textContent = '전체';
  }

  const projects = document.querySelector('#projects');
  if (projects) {
    projects.innerHTML = `
      <div class="output-section-head"><div><p class="eyebrow">02 / 연구과제</p><h2>현재 수행 연구과제</h2></div></div>
      <div class="project-record-grid">
        <article class="project-record"><small>연구책임 · 수행 중</small><h3>재수화 식품 구조–텍스처 데이터 기반 분석</h3><p>재수화 과정의 구조·물성 변화를 측정하고 데이터 기반 품질 분석을 수행합니다.</p></article>
        <article class="project-record"><small>공동연구 · 수행 중</small><h3>김치 제조 지능화 연구</h3><p>김치 제조공정의 품질 데이터를 활용한 비파괴 측정·분석 및 공정 지능화 연구를 수행합니다.</p></article>
        <article class="project-record"><small>연구책임 · 2026.07–2027.01</small><h3>김치 스프레드 제품 개발 및 기술이전</h3><p>앵커사업 연구개발 과제 · 수요기업 빛고을김치</p></article>
      </div>`;
  }

  const patents = document.querySelector('#patents');
  if (patents) {
    patents.innerHTML = `
      <div class="output-section-head"><div><p class="eyebrow">03 / 특허·기술이전</p><h2>특허·기술이전</h2></div></div>
      <p class="output-note">현재 등록 특허 및 기술이전 실적 없음</p>`;
  }
}

// 연구실 활동
if (path.endsWith('/photos.html') || path.endsWith('photos.html')) {
  document.title = '연구실 활동 | CNU FPFT Lab';
  const eyebrow = document.querySelector('.page-head .eyebrow');
  const title = document.querySelector('.page-head h1');
  const lead = document.querySelector('.page-head .compact-lead');
  if (eyebrow) eyebrow.textContent = '연구실 활동';
  if (title) title.textContent = '연구실 활동';
  if (lead) lead.textContent = '학회 · 수상 · 연구실 일상';
  document.querySelectorAll('.photo-card figcaption p').forEach(p => {
    p.textContent = p.textContent
      .replace('Conference', '학회')
      .replace('Capstone Grand Prize', '캡스톤디자인 대상')
      .replace('Poster Presentation', '포스터 발표')
      .replace('Best Poster Award', '우수포스터상')
      .replace('Lab Group Photo', '연구실 단체사진')
      .replace('Lab Activity', '연구실 활동');
  });
}

// 문의·오시는 길
if (path.endsWith('/contact.html') || path.endsWith('contact.html')) {
  document.title = '문의·오시는 길 | CNU FPFT Lab';
  const eyebrow = document.querySelector('.page-head .eyebrow');
  const title = document.querySelector('.page-head h1');
  const lead = document.querySelector('.page-head .compact-lead');
  if (eyebrow) eyebrow.textContent = '문의';
  if (title) title.textContent = '문의·오시는 길';
  if (lead) lead.textContent = '대학원 진학 · 학부연구생 · 공동연구';

  const primaryEyebrow = document.querySelector('.contact-primary .eyebrow');
  if (primaryEyebrow) primaryEyebrow.textContent = '연락처';
  const inquiry = document.querySelector('.contact-primary .join-terms');
  if (inquiry) inquiry.textContent = '연구문의 · 대학원 진학 · 산학협력';
  const locEyebrow = document.querySelector('.contact-location .eyebrow');
  if (locEyebrow) locEyebrow.textContent = '위치';
  const locTitle = document.querySelector('.contact-location h2');
  if (locTitle) locTitle.textContent = '전남대학교';
  const dts = document.querySelectorAll('.contact-location dt');
  if (dts[0]) dts[0].textContent = '교수실';
  if (dts[1]) dts[1].textContent = '연구실';
  if (dts[2]) dts[2].textContent = '주소';
  const mapLink = document.querySelector('.contact-location .map-link');
  if (mapLink) mapLink.textContent = 'Google 지도 ↗';
  const dirEyebrow = document.querySelector('.map-section .eyebrow');
  const dirTitle = document.querySelector('.map-section h2');
  if (dirEyebrow) dirEyebrow.textContent = '오시는 길';
  if (dirTitle) dirTitle.textContent = '농업생명과학대학 3호관';
  const openMap = document.querySelector('.map-section > p .text-link');
  if (openMap) openMap.textContent = 'Google 지도에서 보기 ↗';
}

const yearFilter = document.querySelector('#publication-year');
function updatePublicationCount() {
  if (!yearFilter) return;
  let count = 0;
  document.querySelectorAll('.publication-year').forEach(section => {
    const visible = yearFilter.value === 'all' || section.dataset.year === yearFilter.value;
    section.hidden = !visible;
    if (visible) count += section.querySelectorAll('.publication').length;
  });
  const target = document.querySelector('#publication-count');
  if (target) target.textContent = `${count}편`;
}
yearFilter?.addEventListener('change', updatePublicationCount);
if (yearFilter) updatePublicationCount();
