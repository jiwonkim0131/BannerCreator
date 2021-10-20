const $canvas = document.querySelector('canvas');
const $widthSetting = document.querySelector('.width-setting');
const $heightSetting = document.querySelector('.height-setting');
const $textInput = document.querySelector('.text-input');
const $fontSelectContainer = document.querySelector('.font-select-container');
const ctx = $canvas.getContext('2d');

const canvas = {
  width: 700,
  height: 350,
  fontSize: '15px',
  fontFamilly: 'serif',
  textAlign: 'center',
  backgroundColor: 'skyblue',
  color: 'black',
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = canvas.fontSize + ' ' + canvas.fontFamilly;
  ctx.textAlign = canvas.textAlign;
  const x =
    canvas.textAlign === 'center'
      ? canvas.width / 2
      : canvas.textAlign === 'left'
      ? 10
      : canvas.width - 10;
  ctx.fillStyle = canvas.color;
  ctx.fillText($textInput.value, x, canvas.height / 2);
};
const $source = document.querySelector('.canvas-img > img');
const $upload = document.querySelector('.upload');
const $download = document.querySelector('.download');

// 랜덤 컬러 코드 생성
const getRandomColor = () => '#' + Math.round(Math.random() * 0xffffff).toString(16);

const getRandomNum = range => Math.floor(Math.random() * range);

const getRandomImageUrl = (width, height) =>
  `https://picsum.photos/id/${getRandomNum(500)}/${width}/${height}`;

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
$textInput.onkeyup = () => {
  render();
};
$fontSelectContainer.onchange = ({ target }) => {
  canvas[target.name] = target.value;
  render();
};

//캔버스 컬러 피커  이벤트
document.querySelector('.canvas-bg-color').onchange = e => {
  canvas.backgroundColor = e.target.value;
  render();
};

//캔버스 컬러 랜덤 변경  이벤트
document.querySelector('.random-color-canvas').onclick = () => {
  canvas.backgroundColor = getRandomColor();
  document.querySelector('.canvas-bg-color').value = canvas.backgroundColor;
  render();
};

//폰트 컬러 피커 이벤트
document.querySelector('.font-color').onchange = e => {
  canvas.color = e.target.value;
  render();
};

//폰트 컬러 랜덤 변경  이벤트
document.querySelector('.random-color-font').onclick = e => {
  canvas.color = getRandomColor();
  document.querySelector('.font-color').value = canvas.color;
  render();
};

//랜덤 이미지 생성 이벤트
document.querySelector('.random-image').onclick = () => {
  $source.src = getRandomImageUrl(1500, 900);
  $source.crossOrigin = 'Anonymous';
};

$upload.onchange = e => {
  if (!e.target.matches('input')) return;

  const reader = new FileReader();

  reader.onload = () => {
    $source.setAttribute('src', reader.result);
  };

  reader.readAsDataURL(e.target.files[0]);
};

$source.onload = () => {
  if ($source.naturalWidth > 1919 || $source.naturalHeight > 1919) {
    alert('please small size image');
    return;
  }
  document.querySelector('.spinner').removeAttribute('hidden');

  setTimeout(() => {
    ctx.drawImage($source, 0, 0);
    document.querySelector('.spinner').setAttribute('hidden', '');
  }, 500);
};

document.querySelector('.download').onclick = e => {
  e.target.href = $canvas.toDataURL();
};

window.addEventListener('DOMContentLoaded', () => {
  $widthSetting.value = canvas.width;
  $heightSetting.value = canvas.height;
  ctx.fillStyle = canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
