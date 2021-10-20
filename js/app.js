const $canvas = document.getElementById('canvas');
const $widthSetting = document.querySelector('.width-setting');
const $heightSetting = document.querySelector('.height-setting');
const $textInput = document.querySelector('.text-input');
const $fontSelectContainer = document.querySelector('.font-select-container');
const ctx = $canvas.getContext('2d');
const font = {
  size: '15px',
  familly: 'serif',
};

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
