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

$download.onclick = e => {
  e.target.href = $canvas.toDataURL();
};
