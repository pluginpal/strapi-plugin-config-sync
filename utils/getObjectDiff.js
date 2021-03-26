'use strict';
const { transform, isEqual, isArray, isObject } = require('lodash');

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
const difference = (origObj, newObj) => {
  function changes(newObj, origObj) {
    let arrayIndexCounter = 0

    const newObjChange = transform(newObj, function (result, value, key) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
        result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
      }
    });
    const origObjChange = transform(origObj, function (result, value, key) {
      if (!isEqual(value, newObj[key])) {
        let resultKey = isArray(newObj) ? arrayIndexCounter++ : key
        result[resultKey] = (isObject(value) && isObject(newObj[key])) ? changes(value, newObj[key]) : value
      }
    })

    return Object.assign(newObjChange, origObjChange);
  }
  
  return changes(newObj, origObj)
}

module.exports = difference;