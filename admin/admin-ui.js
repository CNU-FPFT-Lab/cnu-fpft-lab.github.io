(() => {
  'use strict';

  const root = document.getElementById('nc-root');
  const help = document.getElementById('fpft-adminhelp');
  const helpToggle = document.getElementById('fpft-help-toggle');

  if (help && helpToggle) {
    helpToggle.addEventListener('click', () => {
      const collapsed = help.classList.toggle('is-collapsed');
      helpToggle.textContent = collapsed ? '사용 안내 보기' : '사용 안내 닫기';
      helpToggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  // Do not replace or manipulate Decap's native file inputs.
  // Decap owns the media-library state; altering input.files externally can make
  // an uploaded asset appear selected without actually updating the field.
  function decorateCMS() {
    if (!root) return;
    root.querySelectorAll('input, textarea, select').forEach(control => {
      if (!control.getAttribute('autocomplete') && control.type !== 'file') {
        control.setAttribute('autocomplete', 'off');
      }
    });
  }

  const observer = new MutationObserver(decorateCMS);
  observer.observe(document.body, { childList: true, subtree: true });
  decorateCMS();
})();
