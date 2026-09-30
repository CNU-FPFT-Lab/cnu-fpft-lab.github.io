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
