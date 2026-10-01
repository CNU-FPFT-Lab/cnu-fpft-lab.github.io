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

// 공통 메뉴를 한국어로 통일하고 eClass에서 제공하는 교육 페이지는 메뉴에서 제외한다.
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

// 구성원 페이지의 기존 사진/연락처 구조는 유지하면서 화면 문구만 한국어로 정리한다.
if (location.pathname.endsWith('/members.html') || location.pathname.endsWith('members.html')) {
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
