const getRandomColor = () =>
  '#' +
  ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

const getRandomNum = () => Math.floor(Math.random() * 10);

const getFontSizeRemovedPerPixel = fontSize => fontSize.replace(/px/, '');

export { getRandomColor, getRandomNum, getFontSizeRemovedPerPixel };
