const difference = (arrayOne, arrayTwo, compareKey) => {
  return arrayOne.filter(({ [compareKey]: id1 }) => {
    return !arrayTwo.some(({ [compareKey]: id2 }) => id2 === id1);
  });
};

module.exports = difference;
