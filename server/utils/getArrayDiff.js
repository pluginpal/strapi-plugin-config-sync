const difference = (arrayOne, arrayTwo, compareKeys) => {
  return arrayOne.filter(({
    [compareKeys[0]]: id1,
    [compareKeys[1]]: id2,
  }) => {
    return !arrayTwo.some(({
      [compareKeys[0]]: id3,
      [compareKeys[1]]: id4,
    }) => id1 === id3 && id2 === id4);
  });
};

module.exports = difference;
