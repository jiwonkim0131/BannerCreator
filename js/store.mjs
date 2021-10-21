const canvas = {
  width: 700,
  height: 350,
  fontSize: '40px',
  fontFamilly: 'serif',
  textAlign: 'center',
  backgroundColor: 'skyblue',
  color: 'black',
  isImage: false
};

const getWidth = () => canvas.width;
const getHeight = () => canvas.height;
const getFontSize = () => canvas.fontSize;
const getFontFamilly = () => canvas.fontFamilly;
const getTextAlign = () => canvas.textAlign;
const getBackgroundColor = () => canvas.backgroundColor;
const getColor = () => canvas.color;
const getIsImage = () => canvas.isImage;

const setWidth = width => {
  canvas.width = width;
};
const setHeight = height => {
  canvas.height = height;
};
const setFont = (key, value) => {
  canvas[key] = value;
};
const setBackgroundColor = backgroundColor => {
  canvas.backgroundColor = backgroundColor;
};
const setColor = color => {
  canvas.color = color;
};
const setIsImage = isImage => {
  canvas.isImage = isImage;
};
const setCanvas = newCanvas => {
  canvas.width = newCanvas.width;
  canvas.height = newCanvas.height;
  canvas.fontSize = newCanvas.fontSize;
  canvas.fontFamilly = newCanvas.fontFamilly;
  canvas.textAlign = newCanvas.textAlign;
  canvas.backgroundColor = newCanvas.backgroundColor;
  canvas.color = newCanvas.color;
  canvas.isImage = newCanvas.url !== '';
};

const store = {
  getWidth,
  getHeight,
  getFontSize,
  getFontFamilly,
  getTextAlign,
  getBackgroundColor,
  getColor,
  getIsImage,
  setWidth,
  setHeight,
  setFont,
  setBackgroundColor,
  setColor,
  setIsImage,
  setCanvas
};

export default store;
