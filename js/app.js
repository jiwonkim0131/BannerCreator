import { TOAST_TYPE, TEMPLATE_TOAST_TYPE, toaster } from './toast.js';
import {
  getRandomColor,
  getRandomNum,
  getFontSizeRemovedPerPixel,
  getId
} from './utils.js';
import canvas from './store.mjs';

const $widthSetting = document.querySelector('.canvas-width');
const $heightSetting = document.querySelector('.canvas-height');
const $settingCheckbox = document.querySelector('.canvas-ratio');
const $scaleSetting = document.querySelector('.canvas-scale');
const $scaleValue = document.querySelector('.canvas-scale-value');
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
const $source = document.querySelector('.canvas-img > img');
const $textInput = document.querySelector('.canvas-textarea');
const $fontFamily = document.querySelector('select[name="fontFamily"]');
const $fontSize = document.querySelector('select[name="fontSize"]');
const $textAlign = document.querySelector('select[name="textAlign"]');
const $fontSelectContainer = document.querySelector('.font-select-container');
const $favBgList = document.querySelector('.bookmark-bg-store-list');
const $favFontList = document.querySelector('.bookmark-font-store-list');
const $templateContainer = document.querySelector(
  '.bookmark-template-store-list'
);
const $bgColorPicker = document.querySelector('.bg-color-picker');
const $fontColorPicker = document.querySelector('.font-color-picker');
const $upload = document.querySelector('.upload');

// 로컬스토리지에 저장된배경, 폰트 색 즐겨찾기 데이터
const favoriteBackgroundColor = JSON.parse(
  localStorage.getItem('favoriteBackgroundColor')
)
  ? JSON.parse(localStorage.getItem('favoriteBackgroundColor'))
  : [];

const favoriteFontColor = JSON.parse(localStorage.getItem('favoriteFontColor'))
  ? JSON.parse(localStorage.getItem('favoriteFontColor'))
  : [];

let templateLists = JSON.parse(localStorage.getItem('template'))
  ? JSON.parse(localStorage.getItem('template'))
  : [];

function renderText() {
  const textArrayByLinefeed = $textInput.value.match(/[^\r\n|\r|\n]+/g) || [];
  const LINE_HEIGHT = 1.2;
  const PADDING = 10;
  const currentX =
    canvas.getTextAlign() === 'center'
      ? canvas.getWidth() / 2
      : canvas.getTextAlign() === 'left'
      ? PADDING
      : canvas.getWidth() - PADDING;

  textArrayByLinefeed.forEach((text, index) => {
    const currentY =
      (canvas.getHeight() -
        textArrayByLinefeed.length *
          getFontSizeRemovedPerPixel(canvas.getFontSize()) *
          LINE_HEIGHT) /
        2 +
      getFontSizeRemovedPerPixel(canvas.getFontSize()) * LINE_HEIGHT * index;

    ctx.fillText(text, currentX, currentY);
  });
}

const render = () => {
  ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());

  if (canvas.getIsImage()) {
    ctx.drawImage($source, 0, 0, canvas.getWidth(), canvas.getHeight());
  } else {
    ctx.fillStyle = canvas.getBackgroundColor();
    ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());
  }

  ctx.font = canvas.getFontSize() + ' ' + canvas.getFontFamily();
  ctx.textAlign = canvas.getTextAlign();
  ctx.textBaseline = 'top';
  ctx.fillStyle = canvas.getColor();
  renderText();
};

const renderFavoriteColor = () => {
  const favoriteBgcolor = `${[...favoriteBackgroundColor]
    .map(
      (cur, idx) =>
        `<div class="bookmark-bg-item-container" id="${idx}"><div class="bookmark-item-delete">&times</div>
    <div class="bookmark-bg-circle" style="background-color:${cur}"></div></div>`
    )
    .join('')}`;

  $favBgList.innerHTML = favoriteBgcolor;

  const favoriteFontcolor = `${[...favoriteFontColor]
    .map(
      (cur, idx) =>
        `<div class="bookmark-font-item-container" id="${idx}"><div class="bookmark-item-delete">&times</div>
    <div class="bookmark-font-circle" style="background-color:${cur}"></div></div>`
    )
    .join('')}`;

  $favFontList.innerHTML = favoriteFontcolor;
};

const templateRender = () => {
  const $container = document.querySelector('.bookmark-template-store-list');
  $container.innerHTML = `${templateLists
    .map(
      template =>
        `<div><img class="bookmark-template-thumbnail" src=${template.thumbnail}><div class="bookmark-item-delete">&times;</div></div>`
    )
    .join('')}`;
};

const addTemplate = () => {
  // localStorage에 추가하기
  const template = {
    id: getId(),
    thumbnail: $canvas.toDataURL(),
    url: canvas.getIsImage() ? $source.src : '',
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    fontSize: canvas.getFontSize(),
    fontFamily: canvas.getFontFamily(),
    textAlign: canvas.getTextAlign(),
    backgroundColor: canvas.getBackgroundColor(),
    color: canvas.getColor(),
    content: $textInput.value || 'hello, world'
  };

  templateLists.push(template);
  localStorage.setItem('template', JSON.stringify(templateLists));

  toaster.createToastAction(TEMPLATE_TOAST_TYPE.SUCCESS);
  templateRender();
};

const setCanvasState = template => {
  canvas.setCanvas(template);
  $source.src = template.url !== '' ? template.url : '';

  $widthSetting.value = canvas.getWidth();
  $canvas.setAttribute('width', canvas.getWidth());

  $heightSetting.value = canvas.getHeight();
  $canvas.setAttribute('height', canvas.getHeight());

  $textInput.value = template.content;

  [...$fontFamily.children].map(child => {
    if (child.getAttribute('selected') === '')
      child.removeAttribute('selected');

    if (child.getAttribute('value') === template.fontFamily) {
      child.selected = true;
    }
    return child;
  });

  [...$fontSize.children].map(child => {
    if (child.getAttribute('selected') === '')
      child.removeAttribute('selected');

    if (child.getAttribute('value') === template.fontSize) {
      child.selected = true;
    }
    return child;
  });

  [...$textAlign.children].map(child => {
    if (child.getAttribute('selected') === '')
      child.removeAttribute('selected');

    if (child.getAttribute('value') === template.textAlign) {
      child.selected = true;
    }
    return child;
  });

  $settingCheckbox.checked = false;
  $scaleSetting.disabled = true;
  $scaleSetting.value = 1;
  $scaleValue.textContent = 1;

  $widthSetting.disabled = false;
  $heightSetting.disabled = false;
};

window.addEventListener('DOMContentLoaded', () => {
  canvas.setBackgroundColor(getRandomColor());
  $bgColorPicker.value = canvas.getBackgroundColor();

  $widthSetting.value = canvas.getWidth();
  $heightSetting.value = canvas.getHeight();
  ctx.fillStyle = canvas.getBackgroundColor();
  ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());

  renderFavoriteColor();

  // template container 랜더링 하기
  if (!templateLists) {
    templateLists = [];
    return;
  }

  templateRender();
});

$widthSetting.onkeyup = ({ target }) => {
  const MAX_WIDTH = 1920;

  if (/[^0-9]/g.test(target.value)) {
    target.value = target.value.replace(/[^0-9]/g, '');

    alert('숫자만 입력해주세요');
    return;
  }

  if (+target.value > MAX_WIDTH) {
    target.value = MAX_WIDTH;

    alert(`지정할 수 있는 최대 너비는 ${MAX_WIDTH}입니다.`);
  }

  canvas.setWidth(target.value);
  $canvas.setAttribute('width', canvas.getWidth());
  render();
};

$heightSetting.onkeyup = ({ target }) => {
  const MAX_HEIGHT = 1080;

  if (/[^0-9]/g.test(target.value)) {
    target.value = target.value.replace(/[^0-9]/g, '');

    alert('숫자만 입력해주세요');
    return;
  }

  if (+target.value > MAX_HEIGHT) {
    target.value = MAX_HEIGHT;

    alert(`지정할 수 있는 최대 높이는 ${MAX_HEIGHT}입니다.`);
  }

  canvas.setHeight(target.value);
  $canvas.setAttribute('height', canvas.getHeight());
  render();
};

$settingCheckbox.onchange = ({ target }) => {
  [$widthSetting, $heightSetting, $scaleSetting].forEach($el => {
    $el.disabled = !$el.disabled;
  });

  if (!target.checked) {
    $scaleSetting.value = 1;
    $scaleValue.textContent = 1;
    render();
  }
};

$scaleSetting.oninput = ({ target }) => {
  $scaleValue.textContent = target.value;
  $widthSetting.value = Math.round(canvas.getWidth() * target.value);
  $heightSetting.value = Math.round(canvas.getHeight() * target.value);
  $canvas.setAttribute('width', $widthSetting.value);
  $canvas.setAttribute('height', $heightSetting.value);
  ctx.scale(target.value, target.value);
  render();
};

$textInput.onkeyup = () => {
  const PADDING = 20;

  $textInput.style.height = 'auto';
  $textInput.style.height = $textInput.scrollHeight - PADDING + 'px';

  render();
};

$fontSelectContainer.onchange = ({ target }) => {
  canvas.setFont(target.name, target.value);

  render();
};

// 캔버스 컬러 피커 색상 선택  이벤트
$bgColorPicker.onchange = e => {
  canvas.setBackgroundColor(e.target.value);
  canvas.setIsImage(false);
  $source.src = '';

  render();
};

// 캔버스 컬러 피커 랜덤 색상 변경  이벤트
document.querySelector('.bg-random-color').onclick = () => {
  canvas.setBackgroundColor(getRandomColor());
  canvas.setIsImage(false);
  $source.src = '';
  $bgColorPicker.value = canvas.getBackgroundColor();
  render();
};

// 폰트 컬러 피커 색상 선택 이벤트
$fontColorPicker.onchange = e => {
  canvas.setColor(e.target.value);
  render();
};

// 폰트 컬러 피커 랜덤 색상 변경  이벤트
document.querySelector('.font-random-color').onclick = () => {
  canvas.setColor(getRandomColor());
  $fontColorPicker.value = canvas.getColor();
  render();
};

// 현재 배경색 즐겨찾기에 저장
document.querySelector('.bookmark-bg-save').onclick = () => {
  if (favoriteBackgroundColor.includes(canvas.getBackgroundColor() + '')) {
    toaster.createToastAction(TOAST_TYPE.WARNING);
    return;
  }
  if (favoriteBackgroundColor.length >= 5) {
    toaster.createToastAction(TOAST_TYPE.ERROR);
    return;
  }
  favoriteBackgroundColor.push(canvas.getBackgroundColor());
  toaster.createToastAction(TOAST_TYPE.SUCCESS);
  localStorage.setItem(
    'favoriteBackgroundColor',
    JSON.stringify(favoriteBackgroundColor)
  );
  renderFavoriteColor();
};

// 현재 폰트색 즐겨찾기에 저장
document.querySelector('.bookmark-font-save').onclick = () => {
  if (favoriteFontColor.includes(canvas.getColor() + '')) {
    toaster.createToastAction(TOAST_TYPE.WARNING);
    return;
  }
  if (favoriteFontColor.length >= 5) {
    toaster.createToastAction(TOAST_TYPE.ERROR);
    return;
  }

  favoriteFontColor.push(canvas.getColor());
  toaster.createToastAction(TOAST_TYPE.SUCCESS);
  localStorage.setItem('favoriteFontColor', JSON.stringify(favoriteFontColor));
  renderFavoriteColor();
};

// 즐겨찾기에 저장된 배경색 클릭 시 반영
$favBgList.onclick = e => {
  if (e.target.classList.contains('bookmark-item-delete')) {
    favoriteBackgroundColor.splice(e.target.parentNode.getAttribute('id'), 1);
    e.target.parentNode.remove();
    [...$favBgList.children].forEach((child, idx) => {
      child.setAttribute('id', `${idx}`);
    });
    localStorage.setItem(
      'favoriteBackgroundColor',
      JSON.stringify(favoriteBackgroundColor)
    );
  }
  if (e.target.classList.contains('bookmark-bg-circle')) {
    canvas.setBackgroundColor(
      favoriteBackgroundColor[e.target.parentNode.getAttribute('id')]
    );

    $bgColorPicker.value = canvas.getBackgroundColor();
    canvas.setIsImage(false);
    render();
  }
};

// 즐겨찾기에 저장된 글자색 클릭 시 반영
$favFontList.onclick = e => {
  if (e.target.classList.contains('bookmark-item-delete')) {
    favoriteFontColor.splice(e.target.parentNode.getAttribute('id'), 1);
    e.target.parentNode.remove();
    [...$favFontList.children].forEach((child, idx) => {
      child.setAttribute('id', `${idx}`);
    });
    localStorage.setItem(
      'favoriteFontColor',
      JSON.stringify(favoriteFontColor)
    );
  }
  if (e.target.classList.contains('bookmark-font-circle')) {
    canvas.setColor(favoriteFontColor[e.target.parentNode.getAttribute('id')]);
    $fontColorPicker.value = canvas.getColor();
    render();
  }
};

// template 적용하기
$templateContainer.onclick = ({ target }) => {
  const id = [...$templateContainer.children].indexOf(target.parentNode);
  if (id === -1) return;

  // 템플릿 삭제 버튼
  if (target.classList.contains('bookmark-item-delete')) {
    const deleted = id + 1;

    templateLists = templateLists.filter(template => template.id !== deleted);
    templateLists = templateLists.map((template, i) => {
      template.id = i + 1;
      return template;
    });
    localStorage.setItem('template', JSON.stringify(templateLists));
    templateRender();

    return;
  }

  if (!target.classList.contains('bookmark-template-thumbnail')) return;

  // 템플릿 적용
  templateLists.forEach(template => {
    if (template.id === id + 1) setCanvasState(template);
  });

  render();
};

$upload.onchange = e => {
  if (!e.target.matches('input')) return;

  const reader = new FileReader();

  reader.onload = () => {
    $source.setAttribute('src', reader.result);
  };

  reader.readAsDataURL(e.target.files[0]);
};

$upload.onclick = e => {
  e.target.value = null;
};

$source.onload = () => {
  canvas.setIsImage(true);
  render();
};

// 캔버스 -> 이미지 다운로드 이벤트
document.querySelector('.download').onclick = e => {
  console.log(e.target);
  document.querySelector('.download').href = $canvas.toDataURL();
};

// 랜덤 이미지 생성 이벤트
document.querySelector('.random-image').onclick = () => {
  const randomIndex = getRandomNum();
  canvas.setIsImage(true);
  $source.src = `./img/img-${randomIndex}.png`;
};

// 템플릿 추가하기
document.querySelector('.bookmark-template-save').onclick = () => {
  addTemplate();
};
