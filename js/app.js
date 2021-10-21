import { TOAST_TYPE, toaster } from './toast.js';
import { getRandomColor, getRandomNum } from './utils.js';

const $widthSetting = document.querySelector('.width-setting');
const $heightSetting = document.querySelector('.height-setting');
const $settingCheckbox = document.querySelector('.setting-checkbox');
const $scaleSetting = document.querySelector('.scale-setting');
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
const $source = document.querySelector('.canvas-img > img');
const $textInput = document.querySelector('.text-input');
const $fontSelectContainer = document.querySelector('.font-select-container');
const $bgColorPicker = document.querySelector('.bg-color-picker');
const $fontColorPicker = document.querySelector('.font-color-picker');
const $favBgList = document.querySelector('.fav-bg-list');
const $favFontList = document.querySelector('.fav-font-list');
const $upload = document.querySelector('.upload');

const canvas = {
  width: 700,
  height: 350,
  fontSize: '40px',
  fontFamilly: 'serif',
  textAlign: 'center',
  backgroundColor: 'skyblue',
  color: 'black',
  index: 0,
  isImage: false
};

// 로컬스토리지에 저장된배경, 폰트 색 즐겨찾기 데이터
const favoriteBackgroundColor = JSON.parse(
  localStorage.getItem('favoriteBackgroundColor')
)
  ? JSON.parse(localStorage.getItem('favoriteBackgroundColor'))
  : [];
const favoriteFontColor = JSON.parse(localStorage.getItem('favoriteFontColor'))
  ? JSON.parse(localStorage.getItem('favoriteFontColor'))
  : [];

let templateLists = JSON.parse(localStorage.getItem('template'));

function renderText(x) {
  const textArrayByLinefeed = $textInput.value.match(/[^\r\n|\r|\n]+/g);
  const LINE_HEIGHT = 1.2;

  textArrayByLinefeed.forEach((text, index) => {
    const currentY =
      (canvas.height -
        textArrayByLinefeed.length *
          canvas.fontSize.slice(0, 2) *
          LINE_HEIGHT) /
        2 +
      canvas.fontSize.slice(0, 2) * index * LINE_HEIGHT;
    ctx.fillText(text, x, currentY);
  });
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (canvas.isImage) {
    ctx.drawImage($source, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = canvas.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.font = canvas.fontSize + ' ' + canvas.fontFamilly;
  ctx.textAlign = canvas.textAlign;
  ctx.textBaseline = 'top';
  const x =
    canvas.textAlign === 'center'
      ? canvas.width / 2
      : canvas.textAlign === 'left'
      ? 10
      : canvas.width - 10;
  ctx.fillStyle = canvas.color;
  renderText(x);
};

// 배경 색 즐겨찾기 초기값 설정 함수
const fetchFavoriteBgColor = () => {
  favoriteBackgroundColor.forEach((_, idx) => {
    const $favBgItemContainer = document.createElement('div');
    $favBgItemContainer.classList.add('fav-bg-item-container');
    $favBgItemContainer.setAttribute('id', idx);

    $favBgItemContainer.innerHTML = `<div class="fav-item-delete">-</div>
    <div class="fav-bg-item"></div>`;
    $favBgList.appendChild($favBgItemContainer);
    $favBgList.lastElementChild.lastElementChild.style.backgroundColor =
      favoriteBackgroundColor[idx];
  });
};

// 글자 색 즐겨찾기 초기값 설정 함수
const fetchFavoriteFontColor = () => {
  favoriteFontColor.forEach((_, idx) => {
    const $favFontItemContainer = document.createElement('div');
    $favFontItemContainer.classList.add('fav-font-item-container');
    $favFontItemContainer.setAttribute('id', idx);

    $favFontItemContainer.innerHTML = `<div class="fav-item-delete">-</div>
  <div class="fav-font-item"></div>`;
    $favFontList.appendChild($favFontItemContainer);
    $favFontList.lastElementChild.lastElementChild.style.backgroundColor =
      favoriteFontColor[idx];
  });
};

const favoriteBgItemAdd = () => {
  const $favBgItemContainer = document.createElement('div');
  $favBgItemContainer.classList.add('fav-bg-item-container');
  $favBgItemContainer.setAttribute('id', favoriteBackgroundColor.length - 1);
  $favBgItemContainer.innerHTML = `<div class="fav-item-delete">-</div>
  <div class="fav-bg-item"></div>`;
  $favBgList.appendChild($favBgItemContainer);
  $favBgList.lastElementChild.lastElementChild.style.backgroundColor =
    favoriteBackgroundColor[favoriteBackgroundColor.length - 1];
};

const favoriteFontItemAdd = () => {
  const $favFontItemContainer = document.createElement('div');
  $favFontItemContainer.classList.add('fav-font-item-container');
  $favFontItemContainer.setAttribute('id', favoriteFontColor.length - 1);
  $favFontItemContainer.innerHTML = `<div class="fav-item-delete">-</div>
  <div class="fav-font-item"></div>`;
  $favFontList.appendChild($favFontItemContainer);
  $favFontList.lastElementChild.lastElementChild.style.backgroundColor =
    favoriteFontColor[favoriteFontColor.length - 1];
};

const templateRender = () => {
  const $container = document.querySelector('.favorite-template-container');

  $container.innerHTML = `${templateLists
    .map(
      template =>
        `<div><img class="template-img" src=${template.thumbnail}></div>`
    )
    .join('')}`;
};

const getId = () =>
  document.querySelector('.favorite-template-container').children.length + 1;

const addTemplate = () => {
  // localStorage에 추가하기
  const template = {
    id: getId(),
    thumbnail: $canvas.toDataURL(),
    url: $source.src ? $source.src : '',
    width: canvas.width,
    height: canvas.height,
    fontSize: canvas.fontSize,
    fontFamilly: canvas.fontFamilly,
    textAlign: canvas.textAlign,
    backgroundColor: canvas.backgroundColor,
    color: canvas.color,
    content: $textInput.value || 'hello, world'
  };

  templateLists.push(template);
  localStorage.setItem('template', JSON.stringify(templateLists));

  templateRender();
};

const setCanvasState = ({
  url,
  width,
  height,
  fontSize,
  fontFamilly,
  textAlign,
  backgroundColor,
  color,
  content
}) => {
  canvas.width = width;
  canvas.height = height;
  canvas.fontSize = fontSize;
  canvas.fontFamilly = fontFamilly;
  canvas.textAlign = textAlign;
  canvas.backgroundColor = backgroundColor;
  canvas.color = color;
  canvas.isImage = url !== '';
  $source.src = url !== '' ? url : '';

  $widthSetting.value = canvas.width;
  $canvas.setAttribute('width', canvas.width);

  $heightSetting.value = canvas.height;
  $canvas.setAttribute('height', canvas.height);

  $textInput.value = content;
};

window.addEventListener('DOMContentLoaded', () => {
  $bgColorPicker.value = getRandomColor();
  canvas.backgroundColor = $bgColorPicker.value;

  $widthSetting.value = canvas.width;
  $heightSetting.value = canvas.height;
  ctx.fillStyle = canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 로컬스토리지에 저장되어있는 즐겨찾기(배경색, 폰트색) 초기화
  fetchFavoriteBgColor();
  fetchFavoriteFontColor();

  // template 받아오기
  if (templateLists) {
    templateRender();
  } else {
    templateLists = [];
  }
});

$widthSetting.onkeyup = ({ target }) => {
  canvas.width = target.value;
  $canvas.setAttribute('width', canvas.width);
  render();
};

$heightSetting.onkeyup = ({ target }) => {
  canvas.height = target.value;
  $canvas.setAttribute('height', canvas.height);
  render();
};

$settingCheckbox.onchange = ({ target }) => {
  $scaleSetting.disabled = !$scaleSetting.disabled;
  $widthSetting.disabled = !$widthSetting.disabled;
  $heightSetting.disabled = !$heightSetting.disabled;
  if (!target.checked) {
    canvas.width = $canvas.getAttribute('width');
    canvas.height = $canvas.getAttribute('height');
    $scaleSetting.value = 1;
    document.querySelector('.scale-value').textContent = 1;
  }
};

$scaleSetting.oninput = ({ target }) => {
  document.querySelector('.scale-value').textContent = target.value;
  $widthSetting.value = Math.round(canvas.width * target.value);
  $heightSetting.value = Math.round(canvas.height * target.value);
  $canvas.setAttribute('width', $widthSetting.value);
  $canvas.setAttribute('height', $heightSetting.value);
  ctx.scale(target.value, target.value);
  render();
};

$textInput.onkeyup = () => {
  $textInput.style.height = 'auto';
  $textInput.style.height = $textInput.scrollHeight - 20 + 'px';
  render();
};
$fontSelectContainer.onchange = ({ target }) => {
  canvas[target.name] = target.value;
  render();
};

// 캔버스 컬러 피커 색상 선택  이벤트
$bgColorPicker.onchange = e => {
  canvas.backgroundColor = e.target.value;
  canvas.isImage = false;
  $source.removeAttribute('src');

  render();
};

// 캔버스 컬러 피커 랜덤 색상 변경  이벤트
document.querySelector('.random-color-canvas').onclick = () => {
  canvas.backgroundColor = getRandomColor();
  canvas.isImage = false;
  $source.removeAttribute('src');
  $bgColorPicker.value = canvas.backgroundColor;

  render();
};

// 폰트 컬러 피커 색상 선택 이벤트
$fontColorPicker.onchange = e => {
  canvas.color = e.target.value;
  render();
};

// 폰트 컬러 피커 랜덤 색상 변경  이벤트
document.querySelector('.random-color-font').onclick = e => {
  canvas.color = getRandomColor();
  $fontColorPicker.value = canvas.color;
  render();
};

// 현재 배경색 즐겨찾기에 저장
document.querySelector('.favorite-bg').onclick = () => {
  if (favoriteBackgroundColor.includes(canvas.backgroundColor + '')) {
    toaster.createToastAction(TOAST_TYPE.WARNING);
    return;
  }
  if (favoriteBackgroundColor.length < 5) {
    toaster.createToastAction(TOAST_TYPE.SUCCESS);
  } else {
    toaster.createToastAction(TOAST_TYPE.ERROR);
    return;
  }

  favoriteBackgroundColor.push(canvas.backgroundColor);
  localStorage.setItem(
    'favoriteBackgroundColor',
    JSON.stringify(favoriteBackgroundColor)
  );
  favoriteBgItemAdd();
};

// 현재 폰트색 즐겨찾기에 저장
document.querySelector('.favorite-font').onclick = () => {
  if (favoriteFontColor.includes(canvas.color + '')) {
    toaster.createToastAction(TOAST_TYPE.WARNING);
    return;
  }
  if (favoriteFontColor.length < 5) {
    toaster.createToastAction(TOAST_TYPE.SUCCESS);
  } else {
    toaster.createToastAction(TOAST_TYPE.ERROR);
    return;
  }

  favoriteFontColor.push(canvas.color);
  localStorage.setItem('favoriteFontColor', JSON.stringify(favoriteFontColor));
  favoriteFontItemAdd();
};

// 즐겨찾기에 저장된 배경색 클릭 시 반영
$favBgList.onclick = e => {
  if (e.target.classList.contains('fav-item-delete')) {
    favoriteBackgroundColor.splice(e.target.parentNode.getAttribute('id'), 1);
    localStorage.setItem(
      'favoriteBackgroundColor',
      JSON.stringify(favoriteBackgroundColor)
    );
    e.target.parentNode.remove();
  }
  if (e.target.classList.contains('fav-bg-item')) {
    canvas.backgroundColor =
      favoriteBackgroundColor[e.target.parentNode.getAttribute('id')];
    $bgColorPicker.value = canvas.backgroundColor;
    canvas.isImage = false;
    render();
  }
};

// 즐겨찾기에 저장된 글자색 클릭 시 반영
$favFontList.onclick = e => {
  if (e.target.classList.contains('fav-item-delete')) {
    favoriteFontColor.splice(e.target.parentNode.getAttribute('id'), 1);
    localStorage.setItem(
      'favoriteFontColor',
      JSON.stringify(favoriteFontColor)
    );
    e.target.parentNode.remove();
  }
  if (e.target.classList.contains('fav-font-item')) {
    canvas.color = favoriteFontColor[e.target.parentNode.getAttribute('id')];
    $fontColorPicker.value = canvas.color;
    render();
  }
};

// template 적용하기
document.querySelector('.favorite-template-container').onclick = ({
  target
}) => {
  if (!target.classList.contains('template-img')) return;

  const id = [
    ...document.querySelector('.favorite-template-container').children
  ].indexOf(target.parentNode);
  if (id === -1) return;

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
  canvas.isImage = true;
  render();
};

// 캔버스 -> 이미지 다운로드 이벤트
document.querySelector('.download').onclick = e => {
  e.target.href = $canvas.toDataURL();
};

// 랜덤 이미지 생성 이벤트
document.querySelector('.random-image').onclick = () => {
  const randomIndex = getRandomNum();
  canvas.isImage = true;
  $source.src = `./img/img-${randomIndex}.png`;
  canvas.index = randomIndex;
};

// 템플릿 추가하기
document.querySelector('.template-store').onclick = () => {
  addTemplate();
};
