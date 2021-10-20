const $canvas = document.querySelector('canvas');
const $widthSetting = document.querySelector('.width-setting');
const $heightSetting = document.querySelector('.height-setting');
const $textInput = document.querySelector('.text-input');
const $fontSelectContainer = document.querySelector('.font-select-container');
const ctx = $canvas.getContext('2d');
const font = {
  size: '15px',
  familly: 'serif',
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
  let width = 700;
  width = target.value;
  $canvas.setAttribute('width', width);
};
$heightSetting.onkeyup = ({ target }) => {
  let height = 700;
  height = target.value;
  $canvas.setAttribute('height', height);
};
$textInput.onkeyup = () => {
  ctx.clearRect(0, 0, 700, 350);
  ctx.font = font.size + ' ' + font.familly;
  ctx.fillText($textInput.value, 10, 50);
};
$fontSelectContainer.onchange = ({ target }) => {
  font[target.name] = target.value;
  ctx.clearRect(0, 0, 700, 350);
  ctx.font = font.size + ' ' + font.familly;
  ctx.fillText($textInput.value, 10, 50);
};

//캔버스 컬러 변경 이벤트
document.querySelector('.canvas-bg-color').onclick = e => {
  canvas.backgroundColor = e.target.value;
  render();
};

//폰트 컬러 변경 이벤트
document.querySelector('.font-color').onclick = e => {
  canvas.color = e.target.value;
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
  console.log('chekc');
  e.target.href = $canvas.toDataURL();
};
