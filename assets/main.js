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
