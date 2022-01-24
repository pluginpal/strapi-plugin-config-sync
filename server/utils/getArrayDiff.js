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

const same = (arrayOne, arrayTwo, compareKeys) => {
  return arrayOne.filter(({
    [compareKeys[0]]: id1,
    [compareKeys[1]]: id2,
    ...restOne
  }) => {
    return !arrayTwo.some(({
      [compareKeys[0]]: id3,
      [compareKeys[1]]: id4,
      ...restTwo
    }) => id1 === id3
      && id2 === id4
      && JSON.stringify(restOne) === JSON.stringify(restTwo));
  });
};

module.exports = {
  difference,
  same,
};
