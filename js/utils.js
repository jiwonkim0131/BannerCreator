const getRandomColor = () =>
  '#' + (Math.random().toString(16) + '000000').slice(2, 8);

const getRandomNum = () => Math.floor(Math.random() * 10);

const getFontSizeRemovedPerPixel = fontSize => fontSize.replace(/px/, '');

const getId = () => JSON.parse(localStorage.getItem('template')).length + 1;

export { getRandomColor, getRandomNum, getFontSizeRemovedPerPixel, getId };
