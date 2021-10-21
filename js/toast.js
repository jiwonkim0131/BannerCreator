const $body = document.querySelector('body');
const toastQueue = [];

const toaster = {
  createToastAction(action) {
    const $toast = document.createElement('div');
    $toast.classList.add('toast', 'toast-' + action.type);
    toastQueue.unshift($toast);
    $body.appendChild($toast);

    $toast.innerHTML = `
      <h4 class="toast-heading">${action.title}</h4>
      <div class="toast-message">
        <p>${action.message}</p>
      </div>
      <a class="close">&times;</a>
    `;

    toastQueue.forEach((toast, idx) => {
      toast.style.bottom = `${idx * $toast.offsetHeight}px`;
    });

    setTimeout(() => toastQueue.pop().remove(), 3000);
  },
};

const TOAST_TYPE = {
  SUCCESS: {
    type: 'success',
    title: '즐겨찾기 추가 완료 🥳',
    message: '즐겨찾기에 선택한 색이 추가되었습니다!',
  },
  WARNING: {
    type: 'warning',
    title: '즐겨찾기 추가 실패 👀',
    message: '이미 즐겨찾기에 등록되어있는 색입니다.',
  },
  ERROR: {
    type: 'error',
    title: '즐겨찾기 추가 실패 😭',
    message: '등록 가능한 개수를 초과했습니다. 삭제 후 다시 시도해주세요.',
  },
};

$body.onclick = e => {
  if (!e.target.classList.contains('close')) return;
  e.target.parentNode.remove();
};

export { TOAST_TYPE, toaster };
