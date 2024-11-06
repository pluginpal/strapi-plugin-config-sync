'use strict';

import transform from 'lodash/transform';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
const difference = (origObj, newObj) => {
  let arrayIndexCounter = 0;

  const newObjChange = transform(newObj, (result, value, key) => {
    if (!isEqual(value, origObj[key])) {
      const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
      result[resultKey] = (isObject(value) && isObject(origObj[key])) ? difference(value, origObj[key]) : value;
    }
  });
  const origObjChange = transform(origObj, (result, value, key) => {
    if (!isEqual(value, newObj[key])) {
      const resultKey = isArray(newObj) ? arrayIndexCounter++ : key;
      result[resultKey] = (isObject(value) && isObject(newObj[key])) ? difference(value, newObj[key]) : value;
    }
  });

  return Object.assign(newObjChange, origObjChange);
};

export default difference;
