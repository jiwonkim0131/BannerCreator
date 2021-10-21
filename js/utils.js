const getRandomColor = () =>
  '#' + ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);

const getRandomNum = () => Math.floor(Math.random() * 10);

export { getRandomColor, getRandomNum };
