(() => {
  'use strict';

  const root = document.getElementById('nc-root');
  const overlay = document.createElement('div');
  overlay.className = 'fpft-drag-overlay';
  overlay.innerHTML = '<div>이미지를 놓아 업로드하세요<span>현재 열린 업로드 영역으로 파일이 전달됩니다.</span></div>';
  document.body.appendChild(overlay);

  const help = document.getElementById('fpft-adminhelp');
  const helpToggle = document.getElementById('fpft-help-toggle');
  if (help && helpToggle) {
    helpToggle.addEventListener('click', () => {
      const collapsed = help.classList.toggle('is-collapsed');
      helpToggle.textContent = collapsed ? '사용 안내 보기' : '사용 안내 닫기';
      helpToggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  function filesFromEvent(event) {
    return event.dataTransfer && event.dataTransfer.files ? [...event.dataTransfer.files] : [];
  }

  function isFileDrag(event) {
    const types = event.dataTransfer && event.dataTransfer.types;
    return !!types && [...types].includes('Files');
  }

  function setInputFiles(input, files) {
    if (!files.length) return false;
    try {
      const transfer = new DataTransfer();
      files.forEach(file => transfer.items.add(file));
      input.files = transfer.files;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (error) {
      console.warn('FPFT admin: drag/drop file assignment failed', error);
      return false;
    }
  }

  function formatFileSummary(files) {
    if (!files.length) return '';
    if (files.length === 1) {
      const mb = files[0].size / 1024 / 1024;
      return `${files[0].name} · ${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
    }
    return `${files.length}개 파일 선택됨`;
  }

  function enhanceFileInput(input) {
    if (!input || input.dataset.fpftEnhanced === '1') return;
    input.dataset.fpftEnhanced = '1';
    input.classList.add('fpft-native-file-input');

    const zone = document.createElement('div');
    zone.className = 'fpft-dropzone';
    zone.tabIndex = 0;
    zone.setAttribute('role', 'button');
    zone.setAttribute('aria-label', '파일 드래그 앤 드롭 또는 파일 선택');
    zone.innerHTML = [
      '<span class="fpft-dropzone-icon">＋</span>',
      '<span class="fpft-dropzone-title">파일을 여기로 끌어다 놓으세요</span>',
      '<span class="fpft-dropzone-copy">또는 컴퓨터에서 파일을 직접 선택할 수 있습니다.</span>',
      '<button class="fpft-dropzone-button" type="button">파일 선택</button>',
      '<span class="fpft-dropzone-status" aria-live="polite"></span>'
    ].join('');

    const status = zone.querySelector('.fpft-dropzone-status');
    const choose = zone.querySelector('.fpft-dropzone-button');
    const openPicker = event => {
      if (event) event.preventDefault();
      input.click();
    };

    choose.addEventListener('click', openPicker);
    zone.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') openPicker(event);
    });

    ['dragenter', 'dragover'].forEach(type => zone.addEventListener(type, event => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
      zone.classList.add('is-dragging');
      overlay.classList.remove('is-visible');
    }));

    ['dragleave', 'dragend'].forEach(type => zone.addEventListener(type, () => {
      zone.classList.remove('is-dragging');
    }));

    zone.addEventListener('drop', event => {
      if (!isFileDrag(event)) return;
      event.preventDefault();
      event.stopPropagation();
      zone.classList.remove('is-dragging');
      overlay.classList.remove('is-visible');
      const files = filesFromEvent(event);
      const accepted = setInputFiles(input, files);
      if (accepted) {
        zone.classList.remove('is-error');
        status.textContent = formatFileSummary(files);
      } else {
        zone.classList.add('is-error');
        status.textContent = '브라우저에서 자동 전달되지 않았습니다. 파일 선택 버튼을 이용해 주세요.';
      }
    });

    input.addEventListener('change', () => {
      const files = input.files ? [...input.files] : [];
      if (files.length) {
        zone.classList.remove('is-error');
        status.textContent = formatFileSummary(files);
      }
    });

    input.parentNode.insertBefore(zone, input);
  }

  function enhanceFileInputs(scope = document) {
    scope.querySelectorAll('input[type="file"]').forEach(enhanceFileInput);
  }

  function decorateCMS() {
    enhanceFileInputs(document);

    if (root) {
      root.querySelectorAll('input, textarea, select').forEach(control => {
        if (!control.getAttribute('autocomplete') && control.type !== 'file') {
          control.setAttribute('autocomplete', 'off');
        }
      });
    }
  }

  let dragDepth = 0;
  document.addEventListener('dragenter', event => {
    if (!isFileDrag(event)) return;
    dragDepth += 1;
    if (document.querySelector('input[type="file"]')) overlay.classList.add('is-visible');
  });
  document.addEventListener('dragover', event => {
    if (!isFileDrag(event)) return;
    if (document.querySelector('input[type="file"]')) event.preventDefault();
  });
  document.addEventListener('dragleave', event => {
    if (!isFileDrag(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) overlay.classList.remove('is-visible');
  });
  document.addEventListener('drop', () => {
    dragDepth = 0;
    overlay.classList.remove('is-visible');
  });

  const observer = new MutationObserver(() => decorateCMS());
  observer.observe(document.body, { childList: true, subtree: true });
  decorateCMS();
})();
